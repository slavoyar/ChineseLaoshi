package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/db"
	"github.com/slavo/ChineseLaoshi/backend/internal/handler"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET is required")
	}
	if cfg.GoogleClientID == "" {
		log.Fatal("GOOGLE_CLIENT_ID is required")
	}

	migrationsPath := db.MigrationsPath()

	database, err := db.Bootstrap(ctx, cfg, migrationsPath)
	if err != nil {
		log.Fatalf("database bootstrap failed: %v", err)
	}
	defer database.Close()

	if err := db.EnsureTemplateData(ctx, database.Pool, cfg.TemplateEmail); err != nil {
		log.Fatalf("seed failed: %v", err)
	}

	userRepo := repository.NewUserRepository(database.Pool)
	groupRepo := repository.NewGroupRepository(database.Pool)
	wordRepo := repository.NewWordRepository(database.Pool)
	cardRepo := repository.NewCardRepository(database.Pool)
	cloneRepo := repository.NewCloneRepository(database.Pool)

	groupService := service.NewGroupService(database.Pool, cardRepo, groupRepo, wordRepo)
	cardService := service.NewCardService(database.Pool, cardRepo, groupRepo, wordRepo)
	wordService := service.NewWordService(wordRepo)

	tokenService := auth.NewTokenService(cfg.JWTSecret, cfg.SessionTTL)
	googleVerifier := auth.NewGoogleVerifier(cfg.GoogleClientID)
	authService := service.NewAuthService(userRepo, cloneRepo, googleVerifier, tokenService, cfg.TemplateEmail)
	authenticator := auth.NewSessionAuthenticator(tokenService, userRepo)

	cookieConfig := auth.CookieConfig{Secure: cfg.CookieSecure, TTL: cfg.SessionTTL}
	handlers := handler.NewHandlers(
		groupService,
		cardService,
		wordService,
		authService,
		userRepo,
		cfg.TemplateEmail,
		cookieConfig,
		cfg.AllowedOrigins,
	)
	enableLogger := cfg.NodeEnv != "test"
	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           handlers.Router(authenticator, enableLogger),
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("server listening on :%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server failed: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown error: %v", err)
	}
}
