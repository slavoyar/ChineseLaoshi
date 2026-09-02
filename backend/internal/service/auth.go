package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/template"
)

const googleProvider = "google"

type AuthService struct {
	users    *repository.UserRepository
	cloner   *repository.CloneRepository
	google   auth.GoogleTokenVerifier
	telegram auth.TelegramInitDataVerifier
	tokens   *auth.TokenService
	template string // template user email for lookup fallback
}

func NewAuthService(
	users *repository.UserRepository,
	cloner *repository.CloneRepository,
	google auth.GoogleTokenVerifier,
	telegram auth.TelegramInitDataVerifier,
	tokens *auth.TokenService,
	templateEmail string,
) *AuthService {
	return &AuthService{
		users:    users,
		cloner:   cloner,
		google:   google,
		telegram: telegram,
		tokens:   tokens,
		template: templateEmail,
	}
}

type AuthUserDTO struct {
	ID                  string `json:"id"`
	Name                string `json:"name"`
	Email               string `json:"email"`
	AvatarURL           string `json:"avatarUrl"`
	Provider            string `json:"provider"`
	OnboardingCompleted bool   `json:"onboardingCompleted"`
}

func (s *AuthService) LoginWithGoogle(ctx context.Context, idToken, locale string) (AuthUserDTO, string, error) {
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
		user, err = s.provisionGoogleUser(ctx, identity, locale)
		if err != nil {
			return AuthUserDTO{}, "", err
		}
	} else if err := s.ensureStarterContent(ctx, user.ID, locale); err != nil {
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
	return toAuthUserDTO(user), token, nil
}

func (s *AuthService) LoginWithTelegram(ctx context.Context, initData, locale string) (AuthUserDTO, string, error) {
	if s.telegram == nil {
		return AuthUserDTO{}, "", apperrors.New(apperrors.UnauthorizedError)
	}

	identity, err := s.telegram.VerifyInitData(initData)
	if err != nil {
		return AuthUserDTO{}, "", err
	}

	user, err := s.users.GetByProviderSubject(ctx, auth.TelegramProvider(), identity.Subject)
	if err != nil {
		if ae, ok := apperrors.IsAppError(err); !ok || ae.Code != apperrors.EntityNotFoundError {
			return AuthUserDTO{}, "", err
		}
		user, err = s.provisionTelegramUser(ctx, identity, locale)
		if err != nil {
			return AuthUserDTO{}, "", err
		}
	} else if err := s.ensureStarterContent(ctx, user.ID, locale); err != nil {
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
	return toAuthUserDTO(user), token, nil
}

func (s *AuthService) provisionTelegramUser(ctx context.Context, identity auth.TelegramIdentity, locale string) (repository.User, error) {
	email := identity.Subject + "@telegram.invalid"
	user, err := s.users.CreateSSOUser(ctx, identity.Name, email, auth.TelegramProvider(), identity.Subject, identity.PhotoURL)
	if err != nil {
		return repository.User{}, err
	}

	tmpl, err := template.ResolveUser(ctx, s.users, s.template, locale)
	if err != nil {
		return repository.User{}, fmt.Errorf("template user: %w", err)
	}

	if err := s.cloner.CloneUserContent(ctx, tmpl.ID, user.ID); err != nil {
		return repository.User{}, fmt.Errorf("clone template content: %w", err)
	}
	return user, nil
}

func (s *AuthService) provisionGoogleUser(ctx context.Context, identity auth.GoogleIdentity, locale string) (repository.User, error) {
	name := strings.TrimSpace(identity.Name)
	if name == "" {
		name = strings.Split(identity.Email, "@")[0]
	}

	user, err := s.users.CreateSSOUser(ctx, name, identity.Email, googleProvider, identity.Subject, identity.Picture)
	if err != nil {
		return repository.User{}, err
	}

	tmpl, err := template.ResolveUser(ctx, s.users, s.template, locale)
	if err != nil {
		return repository.User{}, fmt.Errorf("template user: %w", err)
	}

	if err := s.cloner.CloneUserContent(ctx, tmpl.ID, user.ID); err != nil {
		return repository.User{}, fmt.Errorf("clone template content: %w", err)
	}
	return user, nil
}

// ensureStarterContent clones demo groups for users created before clone succeeded.
func (s *AuthService) ensureStarterContent(ctx context.Context, userID, locale string) error {
	groups, err := s.cloner.CountGroups(ctx, userID)
	if err != nil {
		return err
	}
	if groups > 0 {
		return nil
	}
	tmpl, err := template.ResolveUser(ctx, s.users, s.template, locale)
	if err != nil {
		return fmt.Errorf("template user: %w", err)
	}
	return s.cloner.CloneUserContent(ctx, tmpl.ID, userID)
}

func (s *AuthService) Me(ctx context.Context, user auth.UserContext) (AuthUserDTO, error) {
	dbUser, err := s.users.GetByID(ctx, user.ID)
	if err != nil {
		return AuthUserDTO{}, err
	}
	return toAuthUserDTO(dbUser), nil
}

func (s *AuthService) CompleteOnboarding(ctx context.Context, userID string) (AuthUserDTO, error) {
	if err := s.users.SetOnboardingCompleted(ctx, userID, true); err != nil {
		return AuthUserDTO{}, err
	}
	dbUser, err := s.users.GetByID(ctx, userID)
	if err != nil {
		return AuthUserDTO{}, err
	}
	return toAuthUserDTO(dbUser), nil
}

func toAuthUserDTO(user repository.User) AuthUserDTO {
	return AuthUserDTO{
		ID:                  user.ID,
		Name:                user.Username,
		Email:               user.Email,
		AvatarURL:           user.AvatarURL,
		Provider:            user.Provider,
		OnboardingCompleted: user.OnboardingCompleted,
	}
}
