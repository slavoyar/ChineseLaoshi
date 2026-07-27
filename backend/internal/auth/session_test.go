package auth

import (
	"context"
	"testing"
)

func TestWithUserAndUserFromContext(t *testing.T) {
	user := UserContext{ID: "1", Username: "test", Email: "a@b.com"}
	ctx := WithUser(context.Background(), user)

	got, ok := UserFromContext(ctx)
	if !ok {
		t.Fatal("expected user in context")
	}
	if got != user {
		t.Fatalf("expected %+v, got %+v", user, got)
	}
}

func TestUserFromContextMissing(t *testing.T) {
	if _, ok := UserFromContext(context.Background()); ok {
		t.Fatal("expected no user in context")
	}
}
