package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRequestOriginAllowed(t *testing.T) {
	allowed := []string{"http://localhost:5173", "https://app.example.com"}

	tests := []struct {
		name   string
		origin string
		referer string
		want   bool
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
	if !requestOriginAllowed(req, nil) {
		t.Fatal("expected allowed when list is empty")
	}
}
