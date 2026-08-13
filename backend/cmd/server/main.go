package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/applog"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/db"
	"github.com/slavo/ChineseLaoshi/backend/internal/handler"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

func main() {
	cfg := config.Load()
	applog.Install(os.Stderr, applog.NewTelegram(cfg.TelegramRelayBase, cfg.TelegramBotToken, cfg.TelegramChatID))
	ctx := context.Background()

	if cfg.JWTSecret == "" {
		applog.Fatal("ERROR JWT_SECRET is required")
	}
	if cfg.GoogleClientID == "" {
		applog.Fatal("ERROR GOOGLE_CLIENT_ID is required")
	}

	migrationsPath := db.MigrationsPath()

	database, err := db.Bootstrap(ctx, cfg, migrationsPath)
	if err != nil {
		applog.Fatalf("ERROR database bootstrap failed: %v", err)
	}
	defer database.Close()

	if err := db.EnsureTemplateData(ctx, database.Pool, cfg.TemplateEmail); err != nil {
		applog.Fatalf("ERROR seed failed: %v", err)
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

	ln, err := net.Listen("tcp", server.Addr)
	if err != nil {
		applog.Fatalf("ERROR server failed: %v", err)
	}
	log.Printf("INFO server listening on :%s", cfg.Port)
	applog.Notify(startedMessage())
	go func() {
		if err := server.Serve(ln); err != nil && err != http.ErrServerClosed {
			applog.Fatalf("ERROR server failed: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("ERROR shutdown error: %v", err)
	}
	applog.Flush()
}

func startedMessage() string {
	msg := "Chinese Laoshi server started"
	if sha := os.Getenv("SOURCE_COMMIT"); sha != "" {
		if len(sha) > 12 {
			sha = sha[:12]
		}
		msg += " " + sha
	}
	return msg
}
