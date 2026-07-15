package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
)

type User struct {
	ID       string
	Username string
	Email    string
	Password string
}

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (User, error) {
	var user User
	err := r.pool.QueryRow(ctx, `
		SELECT id, username, email, password FROM "User" WHERE id = $1
	`, id).Scan(&user.ID, &user.Username, &user.Email, &user.Password)
	if err != nil {
		if err == pgx.ErrNoRows {
			return User{}, apperrors.New(apperrors.EntityNotFoundError)
		}
		return User{}, err
	}
	return user, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (User, error) {
	var user User
	err := r.pool.QueryRow(ctx, `
		SELECT id, username, email, password FROM "User"
		WHERE email = $1 OR username = $1
	`, email).Scan(&user.ID, &user.Username, &user.Email, &user.Password)
	if err != nil {
		if err == pgx.ErrNoRows {
			return User{}, apperrors.New(apperrors.EntityNotFoundError)
		}
		return User{}, err
	}
	return user, nil
}
