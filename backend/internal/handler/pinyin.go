package handler

import (
	"net/http"
	"strings"

	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type PinyinHandler struct{}

func NewPinyinHandler() *PinyinHandler {
	return &PinyinHandler{}
}

func (h *PinyinHandler) Convert(w http.ResponseWriter, r *http.Request) {
	var body dto.PinyinRequest
	if !decodeJSON(w, r, &body) {
		return
	}
	body.Text = strings.TrimSpace(body.Text)
	if body.Text == "" {
		writeValidationError(w, "text is required")
		return
	}
	writeJSON(w, http.StatusOK, service.ConvertPinyin(body.Text))
}
