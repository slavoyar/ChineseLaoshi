package testutil

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/db"
	"github.com/slavo/ChineseLaoshi/backend/internal/handler"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

const DefaultTestEmail = "slavoyar@mail.com"

var (
	sharedApp     *TestApp
	sharedAppOnce sync.Once
	sharedAppErr  error
)

func GetUUID(id int) string {
	return fmt.Sprintf("00000000-0000-0000-0000-%012d", id)
}

type TestApp struct {
	Server  *httptest.Server
	pool    *pgxpool.Pool
	tokens  *auth.TokenService
	Cleanup func()
}

func (a *TestApp) Pool() *pgxpool.Pool {
	return a.pool
}

func (a *TestApp) Tokens() *auth.TokenService {
	return a.tokens
}

func (a *TestApp) AuthenticatedRequest(t *testing.T, method, url string, body io.Reader) *http.Request {
	t.Helper()
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	token, _, err := a.tokens.Issue(auth.UserContext{
		ID:       GetUUID(1),
		Username: "slavoyar",
		Email:    DefaultTestEmail,
		Provider: "google",
	})
	if err != nil {
		t.Fatalf("issue token: %v", err)
	}
	req.AddCookie(&http.Cookie{Name: auth.SessionCookieName, Value: token})
	return req
}

func SetupStrictAuthApp(t *testing.T) *TestApp {
	t.Helper()
	base := SetupTestApp(t)

	userRepo := repository.NewUserRepository(base.pool)
	tokenService := auth.NewTokenService("test-jwt-secret", config.DefaultSessionTTL)
	authenticator := auth.NewSessionAuthenticator(tokenService, userRepo)

	groupRepo := repository.NewGroupRepository(base.pool)
	wordRepo := repository.NewWordRepository(base.pool)
	cardRepo := repository.NewCardRepository(base.pool)
	cloneRepo := repository.NewCloneRepository(base.pool)

	groupService := service.NewGroupService(base.pool, cardRepo, groupRepo, wordRepo)
	cardService := service.NewCardService(base.pool, cardRepo, groupRepo, wordRepo)
	wordService := service.NewWordService(wordRepo)
	googleVerifier := auth.NewGoogleVerifier("test-google-client-id")
	authService := service.NewAuthService(userRepo, cloneRepo, googleVerifier, tokenService, config.DefaultTemplateEmail)

	cookieConfig := auth.CookieConfig{Secure: false, TTL: config.DefaultSessionTTL}
	handlers := handler.NewHandlers(
		groupService,
		cardService,
		wordService,
		authService,
		userRepo,
		config.DefaultTemplateEmail,
		cookieConfig,
		[]string{"http://localhost:5173"},
	)

	server := httptest.NewServer(handlers.Router(authenticator, false))
	t.Cleanup(func() { server.Close() })

	return &TestApp{
		Server:  server,
		pool:    base.pool,
		tokens:  tokenService,
		Cleanup: func() {},
	}
}

func SetupTestApp(t *testing.T) *TestApp {
	t.Helper()
	app := MustInit()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := seedTestData(ctx, app.pool); err != nil {
		t.Fatalf("reseed test data: %v", err)
	}
	return app
}

func MustInit() *TestApp {
	sharedAppOnce.Do(func() {
		sharedApp, sharedAppErr = newTestApp()
	})
	if sharedAppErr != nil {
		panic(sharedAppErr)
	}
	return sharedApp
}

func newTestApp() (*TestApp, error) {
	ctx := context.Background()
	pid := os.Getpid()
	dataDir := filepath.Join(os.TempDir(), fmt.Sprintf("chineselaoshi-test-pg-%d", pid))
	port, err := freePort()
	if err != nil {
		return nil, err
	}

	cfg := config.Config{
		Port:           "3000",
		DBURL:          "",
		DataDir:        dataDir,
		TemplateEmail:  config.DefaultTemplateEmail,
		NodeEnv:        "test",
		EmbeddedPGPort: port,
		JWTSecret:      "test-jwt-secret",
		GoogleClientID: "test-google-client-id",
		SessionTTL:     config.DefaultSessionTTL,
	}

	database, err := db.Bootstrap(ctx, cfg, db.MigrationsPath())
	if err != nil {
		return nil, err
	}

	if err := seedTestData(ctx, database.Pool); err != nil {
		database.Close()
		return nil, err
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

	authenticator := auth.NewDefaultUserAuthenticator(userRepo, DefaultTestEmail)
	cookieConfig := auth.CookieConfig{Secure: false, TTL: cfg.SessionTTL}
	handlers := handler.NewHandlers(
		groupService,
		cardService,
		wordService,
		authService,
		userRepo,
		cfg.TemplateEmail,
		cookieConfig,
		[]string{"http://localhost:5173"},
	)
	server := httptest.NewServer(handlers.Router(authenticator, false))

	return &TestApp{
		Server: server,
		pool:   database.Pool,
		tokens: tokenService,
		Cleanup: func() {
			server.Close()
			database.Close()
		},
	}, nil
}

func seedTestData(ctx context.Context, pool *pgxpool.Pool) error {
	_, err := pool.Exec(ctx, `TRUNCATE "Card", "Group", "Word", "User" CASCADE`)
	if err != nil {
		return err
	}

	// Template user for anonymous reads / clone source.
	templateID := GetUUID(99)
	_, err = pool.Exec(ctx, `
		INSERT INTO "User" (id, username, email, password, provider, provider_subject)
		VALUES ($1, $2, $3, NULL, $4, $5)
	`, templateID, "DemoUser", config.DefaultTemplateEmail, config.TemplateProvider, config.TemplateProviderSubject)
	if err != nil {
		return err
	}

	userID := GetUUID(1)
	_, err = pool.Exec(ctx, `
		INSERT INTO "User" (id, username, email, password, provider, provider_subject)
		VALUES ($1, $2, $3, NULL, $4, $5)
	`, userID, "slavoyar", DefaultTestEmail, "google", "test-subject-1")
	if err != nil {
		return err
	}

	// Template user demo group for clone-on-login tests.
	_, err = pool.Exec(ctx, `
		INSERT INTO "Group" (id, name, "wordCount", "userId")
		VALUES ($1, $2, 1, $3)
	`, GetUUID(98), "Demo", templateID)
	if err != nil {
		return err
	}
	_, err = pool.Exec(ctx, `
		INSERT INTO "Word" (id, symbols, transcription, translation)
		VALUES ($1, $2, $3, $4)
	`, GetUUID(98), "你", "ni", "you")
	if err != nil {
		return err
	}
	_, err = pool.Exec(ctx, `
		INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
		VALUES ($1, $2, $3, NOW())
	`, GetUUID(98), GetUUID(98), GetUUID(98))
	if err != nil {
		return err
	}

	groups := []struct {
		id   string
		name string
	}{
		{GetUUID(1), "Numbers"},
		{GetUUID(2), "Colors"},
		{GetUUID(3), "Animals"},
	}

	for _, g := range groups {
		_, err = pool.Exec(ctx, `
			INSERT INTO "Group" (id, name, "wordCount", "userId")
			VALUES ($1, $2, 0, $3)
		`, g.id, g.name, userID)
		if err != nil {
			return err
		}
	}

	words := []struct {
		id, symbols, transcription, translation string
	}{
		{GetUUID(1), "一", "yi", "один"},
		{GetUUID(2), "二", "er", "два"},
		{GetUUID(3), "狗", "gou", "собака"},
	}

	for _, w := range words {
		_, err = pool.Exec(ctx, `
			INSERT INTO "Word" (id, symbols, transcription, translation)
			VALUES ($1, $2, $3, $4)
		`, w.id, w.symbols, w.transcription, w.translation)
		if err != nil {
			return err
		}
	}

	cards := []struct {
		id, groupID, wordID string
	}{
		{GetUUID(1), GetUUID(1), GetUUID(1)},
		{GetUUID(2), GetUUID(1), GetUUID(2)},
		{GetUUID(3), GetUUID(2), GetUUID(3)},
	}

	for _, c := range cards {
		_, err = pool.Exec(ctx, `
			INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
			VALUES ($1, $2, $3, NOW())
		`, c.id, c.groupID, c.wordID)
		if err != nil {
			return err
		}
	}

	_, err = pool.Exec(ctx, `UPDATE "Group" SET "wordCount" = 2 WHERE id = $1`, GetUUID(1))
	if err != nil {
		return err
	}
	_, err = pool.Exec(ctx, `UPDATE "Group" SET "wordCount" = 1 WHERE id = $1`, GetUUID(2))
	return err
}

func freePort() (uint32, error) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return 0, err
	}
	defer listener.Close()
	return uint32(listener.Addr().(*net.TCPAddr).Port), nil
}
