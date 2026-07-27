package middleware

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jackc/pgx/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
)

type mockAuthenticator struct {
	user auth.UserContext
	err  error
}

func (m mockAuthenticator) UserFromRequest(r *http.Request) (auth.UserContext, error) {
	if m.err != nil {
		return auth.UserContext{}, m.err
	}
	return m.user, nil
}

func TestRequireAuthRejectsMissingUser(t *testing.T) {
	handler := RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", w.Code)
	}
}

func TestOptionalAuthAttachesUser(t *testing.T) {
	user := auth.UserContext{ID: "1", Username: "test", Email: "a@b.com"}
	mw := OptionalAuth(mockAuthenticator{user: user})
	called := false

	handler := mw(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
		got, ok := auth.UserFromContext(r.Context())
		if !ok || got.ID != user.ID {
			t.Fatalf("expected user in context, got %+v ok=%v", got, ok)
		}
	}))

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if !called {
		t.Fatal("expected handler to be called")
	}
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}

func TestRecovererCatchesPanic(t *testing.T) {
	handler := Recoverer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("boom")
	}))

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", w.Code)
	}
}

func TestWriteErrorAppError(t *testing.T) {
	w := httptest.NewRecorder()
	writeError(w, apperrors.New(apperrors.ForbiddenError))

	if w.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", w.Code)
	}
	var body apperrors.AppError
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Code != apperrors.ForbiddenError {
		t.Fatalf("expected forbidden code, got %s", body.Code)
	}
}

func TestWriteErrorNoRows(t *testing.T) {
	w := httptest.NewRecorder()
	writeError(w, pgx.ErrNoRows)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", w.Code)
	}
}

func TestWriteErrorGeneric(t *testing.T) {
	w := httptest.NewRecorder()
	writeError(w, errors.New("unexpected"))

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", w.Code)
	}
}

func TestUserFromContextMiddleware(t *testing.T) {
	ctx := auth.WithUser(context.Background(), auth.UserContext{ID: "1"})
	user, err := UserFromContext(ctx)
	if err != nil || user.ID != "1" {
		t.Fatalf("expected user, got %+v err=%v", user, err)
	}

	if _, err := UserFromContext(context.Background()); err == nil {
		t.Fatal("expected unauthorized without user")
	}
}
