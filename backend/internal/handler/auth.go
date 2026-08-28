package handler

import (
	"log"
	"net/http"

	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/middleware"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
)

type AuthHandler struct {
	service      *service.AuthService
	cookieConfig auth.CookieConfig
}

func NewAuthHandler(s *service.AuthService, cookieConfig auth.CookieConfig) *AuthHandler {
	return &AuthHandler{service: s, cookieConfig: cookieConfig}
}

type googleLoginBody struct {
	IDToken string `json:"idToken"`
}

type telegramLoginBody struct {
	InitData string `json:"initData"`
}

type telegramLoginResponse struct {
	User  service.AuthUserDTO `json:"user"`
	Token string              `json:"token"`
}

func (h *AuthHandler) TelegramLogin(w http.ResponseWriter, r *http.Request) {
	var body telegramLoginBody
	if !decodeJSON(w, r, &body) {
		return
	}
	if body.InitData == "" {
		writeValidationError(w, "initData is required")
		return
	}

	user, token, err := h.service.LoginWithTelegram(r.Context(), body.InitData)
	if err != nil {
		log.Printf("WARN telegram login failed: %v", err)
		mapHandlerError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, telegramLoginResponse{User: user, Token: token})
}

func (h *AuthHandler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
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
		log.Printf("WARN google login failed: %v", err)
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
	dto, err := h.service.Me(r.Context(), user)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, dto)
}

func (h *AuthHandler) CompleteOnboarding(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.UserFromContext(r.Context())
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	dto, err := h.service.CompleteOnboarding(r.Context(), user.ID)
	if err != nil {
		mapHandlerError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, dto)
}
