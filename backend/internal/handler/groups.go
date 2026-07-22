package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type userIDResolver func(r *http.Request) (string, error)

type GroupHandler struct {
	service *service.GroupService
	resolve userIDResolver
}

func NewGroupHandler(s *service.GroupService, resolve userIDResolver) *GroupHandler {
	return &GroupHandler{service: s, resolve: resolve}
}

func (h *GroupHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, err := h.resolve(r)
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	groups, err := h.service.GetGroupsByUserID(r.Context(), userID)
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

	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	group, err := h.service.UpdateGroup(r.Context(), body, user.ID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, group)
}

func (h *GroupHandler) Delete(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}

	groupID := chi.URLParam(r, "groupId")
	if err := h.service.DeleteGroup(r.Context(), groupID, user.ID); err != nil {
		mapHandlerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
