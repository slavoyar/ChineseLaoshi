package handler

import (
	"log"
	"net/http"

	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type AuthHandler struct {
	service        *service.AuthService
	cookieConfig   auth.CookieConfig
	allowedOrigins []string
}

func NewAuthHandler(s *service.AuthService, cookieConfig auth.CookieConfig, allowedOrigins []string) *AuthHandler {
	return &AuthHandler{service: s, cookieConfig: cookieConfig, allowedOrigins: allowedOrigins}
}

type googleLoginBody struct {
	IDToken string `json:"idToken"`
}

func (h *AuthHandler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	if rejectIfOriginNotAllowed(w, r, h.allowedOrigins) {
		return
	}

	var body googleLoginBody
	if !decodeJSON(w, r, &body) {
		return
	}
	if body.IDToken == "" {
		writeValidationError(w, "idToken is required")
		return
	}

	user, token, err := h.service.LoginWithGoogle(r.Context(), body.IDToken)
	if err != nil {
		log.Printf("google login failed: %v", err)
		mapHandlerError(w, err)
		return
	}

	auth.SetSessionCookie(w, token, h.cookieConfig)
	writeJSON(w, http.StatusOK, user)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	auth.ClearSessionCookie(w, h.cookieConfig)
	w.WriteHeader(http.StatusNoContent)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, h.service.Me(r.Context(), user))
}
