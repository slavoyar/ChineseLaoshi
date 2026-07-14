package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/shared/contracts/dto"
)

type GroupRepository struct {
	pool *pgxpool.Pool
}

func NewGroupRepository(pool *pgxpool.Pool) *GroupRepository {
	return &GroupRepository{pool: pool}
}

func (r *GroupRepository) GetGroupsByUserID(ctx context.Context, userID string) ([]dto.Group, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, name, "wordCount" FROM "Group" WHERE "userId" = $1
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []dto.Group
	for rows.Next() {
		var g dto.Group
		if err := rows.Scan(&g.ID, &g.Name, &g.WordCount); err != nil {
			return nil, err
		}
		groups = append(groups, g)
	}
	return groups, rows.Err()
}

func (r *GroupRepository) CreateGroup(ctx context.Context, data dto.CreateGroup, userID string) (dto.Group, error) {
	id := uuid.NewString()
	var g dto.Group
	err := r.pool.QueryRow(ctx, `
		INSERT INTO "Group" (id, name, "wordCount", "userId")
		VALUES ($1, $2, 0, $3)
		RETURNING id, name, "wordCount"
	`, id, data.Name, userID).Scan(&g.ID, &g.Name, &g.WordCount)
	if err != nil {
		return dto.Group{}, err
	}
	return g, nil
}

func (r *GroupRepository) UpdateGroup(ctx context.Context, data dto.UpdateGroup) (dto.Group, error) {
	var g dto.Group
	err := r.pool.QueryRow(ctx, `
		UPDATE "Group" SET name = $2 WHERE id = $1
		RETURNING id, name, "wordCount"
	`, data.ID, data.Name).Scan(&g.ID, &g.Name, &g.WordCount)
	if err != nil {
		if err == pgx.ErrNoRows {
			return dto.Group{}, pgx.ErrNoRows
		}
		return dto.Group{}, err
	}
	return g, nil
}

func (r *GroupRepository) DeleteGroup(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM "Group" WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *GroupRepository) IncrementWordCount(ctx context.Context, tx pgx.Tx, id string) error {
	_, err := tx.Exec(ctx, `
		UPDATE "Group" SET "wordCount" = "wordCount" + 1 WHERE id = $1
	`, id)
	return err
}

func (r *GroupRepository) DecrementWordCount(ctx context.Context, tx pgx.Tx, id string) error {
	_, err := tx.Exec(ctx, `
		UPDATE "Group" SET "wordCount" = "wordCount" - 1 WHERE id = $1
	`, id)
	return err
}
