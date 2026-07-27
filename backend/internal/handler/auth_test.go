package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"testing"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

var testHTTPClient = &http.Client{Timeout: 5 * time.Second}

func TestAuth_GoogleLoginInvalidToken(t *testing.T) {
	app := testutil.SetupTestApp(t)
	body, _ := json.Marshal(map[string]string{"idToken": "invalid-token"})
	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, app.Server.URL+"/api/auth/google", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://localhost:5173")
	res, err := testHTTPClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", res.StatusCode)
	}
}

func TestAuth_GoogleLoginMissingToken(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodPost, app.Server.URL+"/api/auth/google", bytes.NewReader([]byte(`{}`)))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://localhost:5173")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", res.StatusCode)
	}
}

func TestAuth_GoogleLoginOriginRejected(t *testing.T) {
	app := testutil.SetupTestApp(t)
	body, _ := json.Marshal(map[string]string{"idToken": "token"})
	req, _ := http.NewRequest(http.MethodPost, app.Server.URL+"/api/auth/google", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://evil.com")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", res.StatusCode)
	}
}

func TestAuth_Logout(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodPost, app.Server.URL+"/api/auth/logout", nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", res.StatusCode)
	}
	cookies := res.Cookies()
	var sessionCookie *http.Cookie
	for _, c := range cookies {
		if c.Name == auth.SessionCookieName {
			sessionCookie = c
			break
		}
	}
	if sessionCookie == nil {
		t.Fatal("expected session cookie to be cleared on logout")
	}
	if sessionCookie.Value != "" {
		t.Fatalf("expected empty session cookie value, got %q", sessionCookie.Value)
	}
	if sessionCookie.MaxAge != -1 {
		t.Fatalf("expected MaxAge -1, got %d", sessionCookie.MaxAge)
	}
}

func TestAuth_MeUnauthorized(t *testing.T) {
	app := testutil.SetupStrictAuthApp(t)
	res, err := http.Get(app.Server.URL + "/api/auth/me")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", res.StatusCode)
	}
}

func TestAuth_MeWithSession(t *testing.T) {
	app := testutil.SetupStrictAuthApp(t)
	req := app.AuthenticatedRequest(t, http.MethodGet, app.Server.URL+"/api/auth/me", nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var body map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if body["email"] != testutil.DefaultTestEmail {
		t.Fatalf("expected email %s, got %v", testutil.DefaultTestEmail, body["email"])
	}
}

func TestGroups_CreateUnauthorized(t *testing.T) {
	app := testutil.SetupStrictAuthApp(t)
	body, _ := json.Marshal(map[string]string{"name": "test"})
	res, err := http.Post(app.Server.URL+"/api/groups", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", res.StatusCode)
	}
}
