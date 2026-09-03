package db

import (
	"context"
	"errors"
	"fmt"
	"time"
)

const (
	WatchInterval  = 5 * time.Second
	WatchFailLimit = 3
)

// Watch pings the database on interval. After failLimit consecutive failures it
// returns an error so the caller can exit and let the container restart.
func Watch(ctx context.Context, ping func(context.Context) error, interval time.Duration, failLimit int) error {
	if failLimit < 1 {
		return errors.New("failLimit must be at least 1")
	}

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	failures := 0
	for {
		select {
		case <-ctx.Done():
			return nil
		case <-ticker.C:
			pingCtx, cancel := context.WithTimeout(ctx, interval)
			err := ping(pingCtx)
			cancel()
			if err != nil {
				failures++
				if failures >= failLimit {
					return fmt.Errorf("%d consecutive ping failures: %w", failLimit, err)
				}
				continue
			}
			failures = 0
		}
	}
}
