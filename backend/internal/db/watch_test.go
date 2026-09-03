package db_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/db"
)

func TestWatchConsecutiveFailures(t *testing.T) {
	t.Parallel()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	failures := 0
	err := db.Watch(ctx, func(context.Context) error {
		failures++
		return errors.New("connection refused")
	}, 10*time.Millisecond, 3)
	if err == nil {
		t.Fatal("expected error after 3 consecutive failures")
	}
	if failures != 3 {
		t.Fatalf("expected 3 ping attempts, got %d", failures)
	}
}

func TestWatchResetsOnSuccess(t *testing.T) {
	t.Parallel()

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	attempts := 0
	err := db.Watch(ctx, func(context.Context) error {
		attempts++
		if attempts%3 == 0 {
			return nil
		}
		return errors.New("temporary")
	}, 10*time.Millisecond, 3)
	if err != nil {
		t.Fatalf("expected nil when failures never reach limit, got %v", err)
	}
	if attempts < 3 {
		t.Fatalf("expected multiple attempts, got %d", attempts)
	}
}

func TestWatchContextCancel(t *testing.T) {
	t.Parallel()

	ctx, cancel := context.WithCancel(context.Background())
	called := false

	done := make(chan error, 1)
	go func() {
		done <- db.Watch(ctx, func(context.Context) error {
			called = true
			return nil
		}, 10*time.Millisecond, 3)
	}()

	time.Sleep(25 * time.Millisecond)
	cancel()

	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("expected nil on cancel, got %v", err)
		}
	case <-time.After(time.Second):
		t.Fatal("watch did not stop after context cancel")
	}
	if !called {
		t.Fatal("expected at least one ping before cancel")
	}
}
