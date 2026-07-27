package apperrors

import (
	"errors"
	"testing"
)

func TestNewAndIsAppError(t *testing.T) {
	codes := []ErrorCode{
		EntityNotFoundError,
		EntityCreateError,
		EntityUpdateError,
		EntityDeleteError,
		ValidationError,
		UnauthorizedError,
		ForbiddenError,
	}
	for _, code := range codes {
		err := New(code)
		if err.Code != code {
			t.Fatalf("expected code %s, got %s", code, err.Code)
		}
		def := errorDefs[code]
		if err.Message != def.Message || err.StatusCode != def.StatusCode {
			t.Fatalf("unexpected error fields for %s: %+v", code, err)
		}
		ae, ok := IsAppError(err)
		if !ok || ae != err {
			t.Fatalf("IsAppError failed for %s", code)
		}
	}
}

func TestIsAppErrorNonAppError(t *testing.T) {
	if _, ok := IsAppError(errors.New("plain")); ok {
		t.Fatal("expected false for plain error")
	}
}

func TestAppErrorString(t *testing.T) {
	err := New(UnauthorizedError)
	if err.Error() == "" {
		t.Fatal("expected non-empty error string")
	}
}
