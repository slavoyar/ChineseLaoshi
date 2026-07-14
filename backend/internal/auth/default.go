package auth

import (
	"context"

	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

type DefaultUserAuthenticator struct {
	users        *repository.UserRepository
	defaultEmail string
}

func NewDefaultUserAuthenticator(users *repository.UserRepository, defaultEmail string) *DefaultUserAuthenticator {
	return &DefaultUserAuthenticator{users: users, defaultEmail: defaultEmail}
}

func (a *DefaultUserAuthenticator) UserFromRequest(ctx context.Context) (UserContext, error) {
	user, err := a.users.GetByEmail(ctx, a.defaultEmail)
	if err != nil {
		return UserContext{}, err
	}
	return UserContext{ID: user.ID, Username: user.Username}, nil
}
