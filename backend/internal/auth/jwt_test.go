package auth

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestTokenService_IssueParseRoundtrip(t *testing.T) {
	svc := NewTokenService("secret", time.Hour)
	user := UserContext{ID: "user-1", Username: "test", Email: "test@example.com"}

	token, expiresAt, err := svc.Issue(user)
	if err != nil {
		t.Fatalf("issue: %v", err)
	}
	if token == "" {
		t.Fatal("expected non-empty token")
	}
	if expiresAt.Before(time.Now()) {
		t.Fatal("expected future expiry")
	}

	claims, err := svc.Parse(token)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if claims.UserID != user.ID || claims.Username != user.Username || claims.Email != user.Email {
		t.Fatalf("unexpected claims: %+v", claims)
	}
}

func TestTokenService_ParseExpired(t *testing.T) {
	svc := NewTokenService("secret", -time.Hour)
	token, _, err := svc.Issue(UserContext{ID: "user-1", Username: "test", Email: "test@example.com"})
	if err != nil {
		t.Fatalf("issue: %v", err)
	}
	if _, err := svc.Parse(token); err == nil {
		t.Fatal("expected error for expired token")
	}
}

func TestTokenService_ParseWrongSecret(t *testing.T) {
	issuer := NewTokenService("secret-a", time.Hour)
	parser := NewTokenService("secret-b", time.Hour)

	token, _, err := issuer.Issue(UserContext{ID: "user-1", Username: "test", Email: "test@example.com"})
	if err != nil {
		t.Fatalf("issue: %v", err)
	}
	if _, err := parser.Parse(token); err == nil {
		t.Fatal("expected error for wrong secret")
	}
}

func TestTokenService_ParseBadSigningMethod(t *testing.T) {
	token := jwt.NewWithClaims(jwt.SigningMethodNone, &Claims{
		UserID:   "user-1",
		Username: "test",
		Email:    "test@example.com",
	})
	unsigned, err := token.SignedString(jwt.UnsafeAllowNoneSignatureType)
	if err != nil {
		t.Fatalf("sign: %v", err)
	}

	svc := NewTokenService("secret", time.Hour)
	if _, err := svc.Parse(unsigned); err == nil {
		t.Fatal("expected error for unexpected signing method")
	}
}
