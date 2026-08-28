package auth

import (
	"net/http"
	"strings"
	"time"
)

type CookieConfig struct {
	Secure bool
	TTL    time.Duration
}

func SetSessionCookie(w http.ResponseWriter, token string, cfg CookieConfig) {
	http.SetCookie(w, &http.Cookie{
		Name:     SessionCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int(cfg.TTL.Seconds()),
	})
}

func ClearSessionCookie(w http.ResponseWriter, cfg CookieConfig) {
	http.SetCookie(w, &http.Cookie{
		Name:     SessionCookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})
}

func SessionTokenFromRequest(r *http.Request) (string, error) {
	if header := r.Header.Get("Authorization"); header != "" {
		const prefix = "Bearer "
		if strings.HasPrefix(header, prefix) {
			token := strings.TrimSpace(header[len(prefix):])
			if token != "" {
				return token, nil
			}
		}
	}

	cookie, err := r.Cookie(SessionCookieName)
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}
