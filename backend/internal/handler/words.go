package handler

import (
	"net/http"

	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type WordHandler struct {
	service *service.WordService
}

func NewWordHandler(s *service.WordService) *WordHandler {
	return &WordHandler{service: s}
}

func (h *WordHandler) Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("search")
	words, err := h.service.Search(r.Context(), query)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, words)
}
