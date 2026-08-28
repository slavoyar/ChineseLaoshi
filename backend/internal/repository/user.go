package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
)

type User struct {
	ID                  string
	Username            string
	Email               string
	Password            *string
	Provider            string
	ProviderSubject     string
	AvatarURL           string
	OnboardingCompleted bool
}

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (User, error) {
	return r.scanUser(r.pool.QueryRow(ctx, `
		SELECT id, username, email, password, COALESCE(provider, ''), COALESCE(provider_subject, ''), COALESCE(avatar_url, ''), "onboardingCompleted"
		FROM "User" WHERE id = $1
	`, id))
}

func (r *UserRepository) SetOnboardingCompleted(ctx context.Context, id string, completed bool) error {
	tag, err := r.pool.Exec(ctx, `
		UPDATE "User" SET "onboardingCompleted" = $2 WHERE id = $1
	`, id, completed)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return apperrors.New(apperrors.EntityNotFoundError)
	}
	return nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (User, error) {
	return r.scanUser(r.pool.QueryRow(ctx, `
		SELECT id, username, email, password, COALESCE(provider, ''), COALESCE(provider_subject, ''), COALESCE(avatar_url, ''), "onboardingCompleted"
		FROM "User"
		WHERE email = $1 OR username = $1
	`, email))
}

func (r *UserRepository) GetByProviderSubject(ctx context.Context, provider, subject string) (User, error) {
	return r.scanUser(r.pool.QueryRow(ctx, `
		SELECT id, username, email, password, COALESCE(provider, ''), COALESCE(provider_subject, ''), COALESCE(avatar_url, ''), "onboardingCompleted"
		FROM "User"
		WHERE provider = $1 AND provider_subject = $2
	`, provider, subject))
}

func (r *UserRepository) CreateSSOUser(ctx context.Context, username, email, provider, subject, avatarURL string) (User, error) {
	id := uuid.NewString()
	uniqueUsername, err := r.uniqueUsername(ctx, username)
	if err != nil {
		return User{}, err
	}

	_, err = r.pool.Exec(ctx, `
		INSERT INTO "User" (id, username, email, password, provider, provider_subject, avatar_url)
		VALUES ($1, $2, $3, NULL, $4, $5, $6)
	`, id, uniqueUsername, email, provider, subject, avatarURL)
	if err != nil {
		return User{}, err
	}

	return r.GetByID(ctx, id)
}

func (r *UserRepository) uniqueUsername(ctx context.Context, base string) (string, error) {
	base = strings.TrimSpace(base)
	if base == "" {
		base = "user"
	}
	candidate := base
	for i := 0; i < 20; i++ {
		var exists bool
		err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM "User" WHERE username = $1)`, candidate).Scan(&exists)
		if err != nil {
			return "", err
		}
		if !exists {
			return candidate, nil
		}
		candidate = fmt.Sprintf("%s-%s", base, uuid.NewString()[:8])
	}
	return "", errors.New("could not allocate unique username")
}

func (r *UserRepository) scanUser(row pgx.Row) (User, error) {
	var user User
	var password *string
	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&password,
		&user.Provider,
		&user.ProviderSubject,
		&user.AvatarURL,
		&user.OnboardingCompleted,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return User{}, apperrors.New(apperrors.EntityNotFoundError)
		}
		return User{}, err
	}
	user.Password = password
	return user, nil
}
