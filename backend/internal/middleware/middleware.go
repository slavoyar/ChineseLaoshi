package middleware

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
		next.ServeHTTP(ww, r)
		log.Printf(
			"[%s] %s %s %d - %s",
			time.Now().Format(time.RFC3339),
			r.Method,
			r.URL.String(),
			ww.Status(),
			time.Since(start),
		)
	})
}

func Auth(authenticator auth.Authenticator) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, err := authenticator.UserFromRequest(r.Context())
			if err != nil {
				writeError(w, err)
				return
			}
			ctx := auth.WithUser(r.Context(), user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func Recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				log.Printf("panic: %v", rec)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func writeError(w http.ResponseWriter, err error) {
	if ae, ok := apperrors.IsAppError(err); ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(ae.StatusCode)
		_ = json.NewEncoder(w).Encode(ae)
		return
	}

	if errors.Is(err, pgx.ErrNoRows) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"message": "Prisma: Not found"})
		return
	}

	log.Printf("internal error: %v", err)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)
	_ = json.NewEncoder(w).Encode(map[string]string{"message": err.Error()})
}

func UserFromContext(ctx context.Context) (auth.UserContext, error) {
	user, ok := auth.UserFromContext(ctx)
	if !ok {
		return auth.UserContext{}, apperrors.New(apperrors.EntityNotFoundError)
	}
	return user, nil
}
