package template

import (
	"context"

	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/locale"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

// ResolveUser returns the starter-pack template user for the given locale.
func ResolveUser(
	ctx context.Context,
	users *repository.UserRepository,
	enTemplateEmail, rawLocale string,
) (repository.User, error) {
	lang := locale.Normalize(rawLocale)
	subject := config.TemplateProviderSubject
	fallbackEmail := enTemplateEmail
	if lang == "ru" {
		subject = config.TemplateProviderSubjectRU
		fallbackEmail = config.DefaultTemplateEmailRU
	}

	user, err := users.GetByProviderSubject(ctx, config.TemplateProvider, subject)
	if err == nil {
		return user, nil
	}
	return users.GetByEmail(ctx, fallbackEmail)
}
