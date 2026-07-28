package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRequestOriginAllowed(t *testing.T) {
	allowed := []string{"http://localhost:5173", "https://app.example.com"}

	tests := []struct {
		name    string
		origin  string
		referer string
		want    bool
	}{
		{"exact origin", "http://localhost:5173", "", true},
		{"origin trailing slash", "http://localhost:5173/", "", true},
		{"case insensitive", "HTTP://LOCALHOST:5173", "", true},
		{"referer fallback", "", "http://localhost:5173/page", true},
		{"rejected origin", "http://evil.com", "", false},
		{"missing origin and referer", "", "", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/auth/google", nil)
			if tt.origin != "" {
				req.Header.Set("Origin", tt.origin)
			}
			if tt.referer != "" {
				req.Header.Set("Referer", tt.referer)
			}
			if got := requestOriginAllowed(req, allowed); got != tt.want {
				t.Fatalf("requestOriginAllowed() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRequestOriginAllowedEmptyList(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/auth/google", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	if requestOriginAllowed(req, nil) {
		t.Fatal("expected rejected when allowlist is empty")
	}
	if requestOriginAllowed(req, []string{}) {
		t.Fatal("expected rejected when allowlist is empty slice")
	}
}

func TestRequireAllowedOriginMiddleware(t *testing.T) {
	allowed := []string{"https://chineselaoshi.slavoyar.tech"}
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	h := RequireAllowedOrigin(allowed)(next)

	t.Run("allowed origin", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/groups", nil)
		req.Header.Set("Origin", "https://chineselaoshi.slavoyar.tech")
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		if rec.Code != http.StatusNoContent {
			t.Fatalf("expected 204, got %d", rec.Code)
		}
	})

	t.Run("localhost rejected", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/groups", nil)
		req.Header.Set("Origin", "http://localhost:5173")
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		if rec.Code != http.StatusForbidden {
			t.Fatalf("expected 403, got %d", rec.Code)
		}
	})

	t.Run("missing origin rejected", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/groups", nil)
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		if rec.Code != http.StatusForbidden {
			t.Fatalf("expected 403, got %d", rec.Code)
		}
	})
}
