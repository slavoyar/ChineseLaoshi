package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

type GroupHandler struct {
	service *service.GroupService
}

func NewGroupHandler(s *service.GroupService) *GroupHandler {
	return &GroupHandler{service: s}
}

func (h *GroupHandler) List(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	groups, err := h.service.GetGroupsByUserID(r.Context(), user.ID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, groups)
}

func (h *GroupHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body dto.CreateGroup
	if !decodeJSON(w, r, &body) || !validateCreateGroup(w, &body) {
		return
	}

	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	group, err := h.service.CreateGroup(r.Context(), body, user.ID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, group)
}

func (h *GroupHandler) Update(w http.ResponseWriter, r *http.Request) {
	var body dto.UpdateGroup
	if !decodeJSON(w, r, &body) || !validateUpdateGroup(w, &body) {
		return
	}

	group, err := h.service.UpdateGroup(r.Context(), body)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, group)
}

func (h *GroupHandler) Delete(w http.ResponseWriter, r *http.Request) {
	groupID := chi.URLParam(r, "groupId")
	if err := h.service.DeleteGroup(r.Context(), groupID); err != nil {
		mapHandlerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
