package auth

import (
	"net/http"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

type SessionAuthenticator struct {
	tokens *TokenService
	users  *repository.UserRepository
}

func NewSessionAuthenticator(tokens *TokenService, users *repository.UserRepository) *SessionAuthenticator {
	return &SessionAuthenticator{tokens: tokens, users: users}
}

func (a *SessionAuthenticator) UserFromRequest(r *http.Request) (UserContext, error) {
	raw, err := SessionTokenFromRequest(r)
	if err != nil {
		return UserContext{}, apperrors.New(apperrors.UnauthorizedError)
	}

	claims, err := a.tokens.Parse(raw)
	if err != nil {
		return UserContext{}, apperrors.New(apperrors.UnauthorizedError)
	}

	user, err := a.users.GetByID(r.Context(), claims.UserID)
	if err != nil {
		return UserContext{}, apperrors.New(apperrors.UnauthorizedError)
	}

	return UserContext{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
		Provider:  user.Provider,
	}, nil
}
