package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type Handlers struct {
	Groups *GroupHandler
	Cards  *CardHandler
	Words  *WordHandler
}

func NewHandlers(
	groupService *service.GroupService,
	cardService *service.CardService,
	wordService *service.WordService,
) *Handlers {
	return &Handlers{
		Groups: NewGroupHandler(groupService),
		Cards:  NewCardHandler(cardService),
		Words:  NewWordHandler(wordService),
	}
}

func (h *Handlers) Router(authenticator auth.Authenticator, enableLogger bool) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(chimw.RealIP)
	r.Use(chimw.RequestID)
	if enableLogger {
		r.Use(middleware.Logger)
	}
	r.Use(middleware.Auth(authenticator))

	r.Route("/api", func(r chi.Router) {
		r.Route("/groups", func(r chi.Router) {
			r.Get("/", h.Groups.List)
			r.Post("/", h.Groups.Create)
			r.Put("/", h.Groups.Update)
			r.Delete("/{groupId}", h.Groups.Delete)
		})

		r.Route("/cards", func(r chi.Router) {
			r.Get("/{groupId}", h.Cards.ListByGroup)
			r.Post("/", h.Cards.Create)
			r.Put("/", h.Cards.Update)
			r.Post("/stats", h.Cards.UpdateStats)
			r.Post("/study/write", h.Cards.GetWriteCards)
			r.Delete("/{cardId}", h.Cards.Delete)
		})

		r.Get("/words", h.Words.Search)
	})

	return r
}
