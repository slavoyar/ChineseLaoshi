package auth

import "context"

type UserContext struct {
	ID       string
	Username string
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
	UserFromRequest(ctx context.Context) (UserContext, error)
}
