package db

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	embeddedpostgres "github.com/fergusstrange/embedded-postgres"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
)

type DB struct {
	Pool     *pgxpool.Pool
	embedded *embeddedpostgres.EmbeddedPostgres
}

func Bootstrap(ctx context.Context, cfg config.Config, migrationsPath string) (*DB, error) {
	dbURL := cfg.DBURL
	var embedded *embeddedpostgres.EmbeddedPostgres

	if dbURL == "" {
		if err := os.MkdirAll(cfg.DataDir, 0o755); err != nil {
			return nil, fmt.Errorf("create data dir: %w", err)
		}

		embedded = embeddedpostgres.NewDatabase(embeddedpostgres.DefaultConfig().
			Username("postgres").
			Password("postgres").
			Database("chineselaoshi").
			Version(embeddedpostgres.V16).
			DataPath(cfg.DataDir).
			Port(cfg.EmbeddedPGPort))

		if err := embedded.Start(); err != nil {
			return nil, fmt.Errorf("start embedded postgres: %w", err)
		}

		dbURL = fmt.Sprintf(
			"postgres://postgres:postgres@localhost:%d/chineselaoshi?sslmode=disable",
			cfg.EmbeddedPGPort,
		)
	}

	if err := runMigrations(dbURL, migrationsPath); err != nil {
		if embedded != nil {
			_ = embedded.Stop()
		}
		return nil, fmt.Errorf("migrate: %w", err)
	}

	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		if embedded != nil {
			_ = embedded.Stop()
		}
		return nil, fmt.Errorf("connect: %w", err)
	}

	return &DB{Pool: pool, embedded: embedded}, nil
}

func runMigrations(dbURL, migrationsPath string) error {
	absPath, err := filepath.Abs(migrationsPath)
	if err != nil {
		return err
	}

	sourceURL := "file://" + filepath.ToSlash(absPath)
	m, err := migrate.New(sourceURL, dbURL)
	if err != nil {
		return err
	}
	defer m.Close()

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}

func (d *DB) Close() {
	if d.Pool != nil {
		d.Pool.Close()
	}
	if d.embedded != nil {
		_ = d.embedded.Stop()
	}
}
