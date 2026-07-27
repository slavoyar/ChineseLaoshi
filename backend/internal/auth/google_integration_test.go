package auth_test

import (
	"context"
	"testing"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
)

func TestGoogleVerifier_InvalidToken(t *testing.T) {
	verifier := auth.NewGoogleVerifier("test-client-id")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := verifier.VerifyIDToken(ctx, "not-a-real-token")
	if err == nil {
		t.Fatal("expected error for invalid token")
	}
}
