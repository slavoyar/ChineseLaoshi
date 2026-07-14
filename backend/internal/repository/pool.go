package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type PoolBeginner interface {
	Begin(ctx context.Context) (pgx.Tx, error)
}
