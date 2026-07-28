package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type Handlers struct {
	Groups          *GroupHandler
	Cards           *CardHandler
	Words           *WordHandler
	Auth            *AuthHandler
	users           *repository.UserRepository
	templateEmail   string
	allowedOrigins  []string
}

func NewHandlers(
	groupService *service.GroupService,
	cardService *service.CardService,
	wordService *service.WordService,
	authService *service.AuthService,
	users *repository.UserRepository,
	templateEmail string,
	cookieConfig auth.CookieConfig,
	allowedOrigins []string,
) *Handlers {
	h := &Handlers{
		Words:          NewWordHandler(wordService),
		Auth:           NewAuthHandler(authService, cookieConfig),
		users:          users,
		templateEmail:  templateEmail,
		allowedOrigins: allowedOrigins,
	}
	h.Groups = NewGroupHandler(groupService, h.resolveUserID)
	h.Cards = NewCardHandler(cardService, h.resolveUserID)
	return h
}

func (h *Handlers) Router(authenticator auth.Authenticator, enableLogger bool) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(chimw.RealIP)
	r.Use(chimw.RequestID)
	if enableLogger {
		r.Use(middleware.Logger)
	}
	r.Use(middleware.OptionalAuth(authenticator))

	r.Route("/api", func(r chi.Router) {
		r.Use(RequireAllowedOrigin(h.allowedOrigins))

		r.Route("/auth", func(r chi.Router) {
			r.Post("/google", h.Auth.GoogleLogin)
			r.Post("/logout", h.Auth.Logout)
			r.With(middleware.RequireAuth).Get("/me", h.Auth.Me)
		})

		r.Route("/groups", func(r chi.Router) {
			r.Get("/", h.Groups.List)
			r.With(middleware.RequireAuth).Post("/", h.Groups.Create)
			r.With(middleware.RequireAuth).Put("/", h.Groups.Update)
			r.With(middleware.RequireAuth).Delete("/{groupId}", h.Groups.Delete)
		})

		r.Route("/cards", func(r chi.Router) {
			r.Get("/{groupId}", h.Cards.ListByGroup)
			r.Post("/study/write", h.Cards.GetWriteCards)
			r.With(middleware.RequireAuth).Post("/", h.Cards.Create)
			r.With(middleware.RequireAuth).Put("/", h.Cards.Update)
			r.With(middleware.RequireAuth).Post("/stats", h.Cards.UpdateStats)
			r.With(middleware.RequireAuth).Delete("/{cardId}", h.Cards.Delete)
		})

		r.Get("/words", h.Words.Search)
	})

	return r
}

func (h *Handlers) resolveUserID(r *http.Request) (string, error) {
	if user, ok := auth.UserFromContext(r.Context()); ok {
		return user.ID, nil
	}
	template, err := h.users.GetByProviderSubject(r.Context(), config.TemplateProvider, config.TemplateProviderSubject)
	if err == nil {
		return template.ID, nil
	}
	template, err = h.users.GetByEmail(r.Context(), h.templateEmail)
	if err != nil {
		return "", err
	}
	return template.ID, nil
}
