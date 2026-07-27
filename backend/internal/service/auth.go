package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

const googleProvider = "google"

type AuthService struct {
	users    *repository.UserRepository
	cloner   *repository.CloneRepository
	google   auth.GoogleTokenVerifier
	tokens   *auth.TokenService
	template string // template user email for lookup fallback
}

func NewAuthService(
	users *repository.UserRepository,
	cloner *repository.CloneRepository,
	google auth.GoogleTokenVerifier,
	tokens *auth.TokenService,
	templateEmail string,
) *AuthService {
	return &AuthService{
		users:    users,
		cloner:   cloner,
		google:   google,
		tokens:   tokens,
		template: templateEmail,
	}
}

type AuthUserDTO struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatarUrl"`
	Provider  string `json:"provider"`
}

func (s *AuthService) LoginWithGoogle(ctx context.Context, idToken string) (AuthUserDTO, string, error) {
	identity, err := s.google.VerifyIDToken(ctx, idToken)
	if err != nil {
		return AuthUserDTO{}, "", apperrors.New(apperrors.UnauthorizedError)
	}
	if !identity.EmailVerified {
		return AuthUserDTO{}, "", apperrors.New(apperrors.ForbiddenError)
	}

	user, err := s.users.GetByProviderSubject(ctx, googleProvider, identity.Subject)
	if err != nil {
		if ae, ok := apperrors.IsAppError(err); !ok || ae.Code != apperrors.EntityNotFoundError {
			return AuthUserDTO{}, "", err
		}
		user, err = s.provisionGoogleUser(ctx, identity)
		if err != nil {
			return AuthUserDTO{}, "", err
		}
	} else if err := s.ensureStarterContent(ctx, user.ID); err != nil {
		return AuthUserDTO{}, "", err
	}

	uc := auth.UserContext{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
		Provider:  user.Provider,
	}
	token, _, err := s.tokens.Issue(uc)
	if err != nil {
		return AuthUserDTO{}, "", err
	}
	return toAuthUserDTO(uc), token, nil
}

func (s *AuthService) provisionGoogleUser(ctx context.Context, identity auth.GoogleIdentity) (repository.User, error) {
	name := strings.TrimSpace(identity.Name)
	if name == "" {
		name = strings.Split(identity.Email, "@")[0]
	}

	user, err := s.users.CreateSSOUser(ctx, name, identity.Email, googleProvider, identity.Subject, identity.Picture)
	if err != nil {
		return repository.User{}, err
	}

	template, err := s.templateUser(ctx)
	if err != nil {
		return repository.User{}, fmt.Errorf("template user: %w", err)
	}

	if err := s.cloner.CloneUserContent(ctx, template.ID, user.ID); err != nil {
		return repository.User{}, fmt.Errorf("clone template content: %w", err)
	}
	return user, nil
}

func (s *AuthService) templateUser(ctx context.Context) (repository.User, error) {
	user, err := s.users.GetByProviderSubject(ctx, config.TemplateProvider, config.TemplateProviderSubject)
	if err == nil {
		return user, nil
	}
	return s.users.GetByEmail(ctx, s.template)
}

// ensureStarterContent clones demo groups for users created before clone succeeded.
func (s *AuthService) ensureStarterContent(ctx context.Context, userID string) error {
	groups, err := s.cloner.CountGroups(ctx, userID)
	if err != nil {
		return err
	}
	if groups > 0 {
		return nil
	}
	template, err := s.templateUser(ctx)
	if err != nil {
		return fmt.Errorf("template user: %w", err)
	}
	return s.cloner.CloneUserContent(ctx, template.ID, userID)
}

func (s *AuthService) Me(ctx context.Context, user auth.UserContext) AuthUserDTO {
	return toAuthUserDTO(user)
}

func toAuthUserDTO(user auth.UserContext) AuthUserDTO {
	return AuthUserDTO{
		ID:        user.ID,
		Name:      user.Username,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
		Provider:  user.Provider,
	}
}
