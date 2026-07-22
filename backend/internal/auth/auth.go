package auth

import (
	"context"
	"net/http"
)

type UserContext struct {
	ID        string
	Username  string
	Email     string
	AvatarURL string
	Provider  string
}

type contextKey string

const userContextKey contextKey = "user"

func WithUser(ctx context.Context, user UserContext) context.Context {
	return context.WithValue(ctx, userContextKey, user)
}

func UserFromContext(ctx context.Context) (UserContext, bool) {
	user, ok := ctx.Value(userContextKey).(UserContext)
	return user, ok
}

type Authenticator interface {
	UserFromRequest(r *http.Request) (UserContext, error)
}
