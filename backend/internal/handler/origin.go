package handler

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
)

func requestOriginAllowed(r *http.Request, allowed []string) bool {
	if len(allowed) == 0 {
		return true
	}

	origin := strings.TrimSpace(r.Header.Get("Origin"))
	if origin == "" {
		if ref := strings.TrimSpace(r.Header.Get("Referer")); ref != "" {
			if u, err := url.Parse(ref); err == nil {
				origin = u.Scheme + "://" + u.Host
			}
		}
	}
	if origin == "" {
		return false
	}

	for _, candidate := range allowed {
		if strings.EqualFold(strings.TrimRight(candidate, "/"), strings.TrimRight(origin, "/")) {
			return true
		}
	}
	return false
}

func rejectIfOriginNotAllowed(w http.ResponseWriter, r *http.Request, allowed []string) bool {
	if requestOriginAllowed(r, allowed) {
		return false
	}
	mapHandlerError(w, apperrors.New(apperrors.ForbiddenError))
	return true
}
