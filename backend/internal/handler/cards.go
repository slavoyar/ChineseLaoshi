package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type CardHandler struct {
	service *service.CardService
	resolve userIDResolver
}

func NewCardHandler(s *service.CardService, resolve userIDResolver) *CardHandler {
	return &CardHandler{service: s, resolve: resolve}
}

func (h *CardHandler) ListByGroup(w http.ResponseWriter, r *http.Request) {
	userID, err := h.resolve(r)
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	groupID := chi.URLParam(r, "groupId")
	cards, err := h.service.GetCardsByGroupID(r.Context(), groupID, userID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, cards)
}

func (h *CardHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body dto.CreateCard
	if !decodeJSON(w, r, &body) || !validateCreateCard(w, &body) {
		return
	}

	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	card, err := h.service.CreateCard(r.Context(), body, user.ID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, card)
}

func (h *CardHandler) Update(w http.ResponseWriter, r *http.Request) {
	var body dto.UpdateCardWord
	if !decodeJSON(w, r, &body) || !validateUpdateCardWord(w, &body) {
		return
	}

	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	if err := h.service.UpdateCard(r.Context(), body, user.ID); err != nil {
		mapHandlerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *CardHandler) UpdateStats(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ID      string `json:"id"`
		Guessed *bool  `json:"guessed"`
	}
	if !decodeJSON(w, r, &body) {
		return
	}
	if body.ID == "" || !isUUID(body.ID) {
		writeValidationError(w, "id is required")
		return
	}
	if body.Guessed == nil {
		writeValidationError(w, "guessed is required")
		return
	}

	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	if err := h.service.UpdateCardStats(r.Context(), dto.UpdateCardStats{
		ID:      body.ID,
		Guessed: *body.Guessed,
	}, user.ID); err != nil {
		mapHandlerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *CardHandler) GetWriteCards(w http.ResponseWriter, r *http.Request) {
	var body dto.GetWriteCard
	if !decodeJSON(w, r, &body) || !validateGetWriteCard(w, &body) {
		return
	}

	userID, err := h.resolve(r)
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	cards, err := h.service.GetWriteCards(r.Context(), body, userID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, cards)
}

func (h *CardHandler) Delete(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	cardID := chi.URLParam(r, "cardId")
	if err := h.service.DeleteCard(r.Context(), cardID, user.ID); err != nil {
		mapHandlerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
