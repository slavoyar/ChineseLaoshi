package auth

import (
	"net/http"

	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

// DefaultUserAuthenticator resolves a fixed user for tests.
type DefaultUserAuthenticator struct {
	users        *repository.UserRepository
	defaultEmail string
}

func NewDefaultUserAuthenticator(users *repository.UserRepository, defaultEmail string) *DefaultUserAuthenticator {
	return &DefaultUserAuthenticator{users: users, defaultEmail: defaultEmail}
}

func (a *DefaultUserAuthenticator) UserFromRequest(r *http.Request) (UserContext, error) {
	user, err := a.users.GetByEmail(r.Context(), a.defaultEmail)
	if err != nil {
		return UserContext{}, err
	}
	return UserContext{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
		Provider:  user.Provider,
	}, nil
}
