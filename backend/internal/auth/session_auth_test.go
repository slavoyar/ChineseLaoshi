package auth_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestSessionAuthenticator_ValidCookie(t *testing.T) {
	app := testutil.SetupTestApp(t)
	userRepo := repository.NewUserRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", time.Hour)
	authenticator := auth.NewSessionAuthenticator(tokenService, userRepo)

	token, _, err := tokenService.Issue(auth.UserContext{
		ID:       testutil.GetUUID(1),
		Username: "slavoyar",
		Email:    testutil.DefaultTestEmail,
		Provider: "google",
	})
	if err != nil {
		t.Fatalf("issue token: %v", err)
	}

	req := httptest.NewRequest("GET", "/", nil)
	req.AddCookie(&http.Cookie{Name: auth.SessionCookieName, Value: token})

	user, err := authenticator.UserFromRequest(req)
	if err != nil {
		t.Fatalf("UserFromRequest: %v", err)
	}
	if user.Email != testutil.DefaultTestEmail {
		t.Fatalf("expected %s, got %s", testutil.DefaultTestEmail, user.Email)
	}
}

func TestSessionAuthenticator_MissingCookie(t *testing.T) {
	app := testutil.SetupTestApp(t)
	userRepo := repository.NewUserRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", time.Hour)
	authenticator := auth.NewSessionAuthenticator(tokenService, userRepo)

	req := httptest.NewRequest("GET", "/", nil)
	if _, err := authenticator.UserFromRequest(req); err == nil {
		t.Fatal("expected error for missing cookie")
	}
}

func TestSessionAuthenticator_InvalidToken(t *testing.T) {
	app := testutil.SetupTestApp(t)
	userRepo := repository.NewUserRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", time.Hour)
	authenticator := auth.NewSessionAuthenticator(tokenService, userRepo)

	req := httptest.NewRequest("GET", "/", nil)
	req.AddCookie(&http.Cookie{Name: auth.SessionCookieName, Value: "not-a-valid-token"})

	if _, err := authenticator.UserFromRequest(req); err == nil {
		t.Fatal("expected error for invalid token")
	}
}

func TestDefaultUserAuthenticator(t *testing.T) {
	app := testutil.SetupTestApp(t)
	userRepo := repository.NewUserRepository(app.Pool())
	authenticator := auth.NewDefaultUserAuthenticator(userRepo, testutil.DefaultTestEmail)

	req := httptest.NewRequest("GET", "/", nil)
	user, err := authenticator.UserFromRequest(req)
	if err != nil {
		t.Fatalf("UserFromRequest: %v", err)
	}
	if user.Email != testutil.DefaultTestEmail {
		t.Fatalf("expected %s, got %s", testutil.DefaultTestEmail, user.Email)
	}
}
