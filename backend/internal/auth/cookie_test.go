package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestSetSessionCookie(t *testing.T) {
	w := httptest.NewRecorder()
	cfg := CookieConfig{Secure: true, TTL: time.Hour}
	SetSessionCookie(w, "token-value", cfg)

	res := w.Result()
	cookies := res.Cookies()
	if len(cookies) != 1 {
		t.Fatalf("expected 1 cookie, got %d", len(cookies))
	}
	c := cookies[0]
	if c.Name != SessionCookieName {
		t.Fatalf("expected cookie name %s, got %s", SessionCookieName, c.Name)
	}
	if c.Value != "token-value" {
		t.Fatalf("expected token-value, got %s", c.Value)
	}
	if !c.HttpOnly {
		t.Fatal("expected HttpOnly")
	}
	if !c.Secure {
		t.Fatal("expected Secure")
	}
	if c.Path != "/" {
		t.Fatalf("expected path /, got %s", c.Path)
	}
	if c.MaxAge != 3600 {
		t.Fatalf("expected MaxAge 3600, got %d", c.MaxAge)
	}
}

func TestClearSessionCookie(t *testing.T) {
	w := httptest.NewRecorder()
	cfg := CookieConfig{Secure: false, TTL: time.Hour}
	ClearSessionCookie(w, cfg)

	res := w.Result()
	c := res.Cookies()[0]
	if c.Value != "" {
		t.Fatalf("expected empty value, got %s", c.Value)
	}
	if c.MaxAge != -1 {
		t.Fatalf("expected MaxAge -1, got %d", c.MaxAge)
	}
}

func TestSessionTokenFromRequest(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.AddCookie(&http.Cookie{Name: SessionCookieName, Value: "abc"})
	token, err := SessionTokenFromRequest(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if token != "abc" {
		t.Fatalf("expected abc, got %s", token)
	}
}

func TestSessionTokenFromRequestMissing(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	if _, err := SessionTokenFromRequest(req); err == nil {
		t.Fatal("expected error for missing cookie")
	}
}
