package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CloneRepository struct {
	pool *pgxpool.Pool
}

func NewCloneRepository(pool *pgxpool.Pool) *CloneRepository {
	return &CloneRepository{pool: pool}
}

func (r *CloneRepository) CountGroups(ctx context.Context, userID string) (int, error) {
	var count int
	err := r.pool.QueryRow(ctx, `SELECT COUNT(*) FROM "Group" WHERE "userId" = $1`, userID).Scan(&count)
	return count, err
}

// CloneUserContent copies groups/cards/words from templateUserID to targetUserID.
func (r *CloneRepository) CloneUserContent(ctx context.Context, templateUserID, targetUserID string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	rows, err := tx.Query(ctx, `
		SELECT id, name, "wordCount" FROM "Group" WHERE "userId" = $1
	`, templateUserID)
	if err != nil {
		return err
	}

	type groupRow struct {
		id        string
		name      string
		wordCount int
	}
	var groups []groupRow
	for rows.Next() {
		var g groupRow
		if err := rows.Scan(&g.id, &g.name, &g.wordCount); err != nil {
			rows.Close()
			return err
		}
		groups = append(groups, g)
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return err
	}
	rows.Close()

	for _, g := range groups {
		newGroupID := uuid.NewString()
		_, err = tx.Exec(ctx, `
			INSERT INTO "Group" (id, name, "wordCount", "userId")
			VALUES ($1, $2, $3, $4)
		`, newGroupID, g.name, g.wordCount, targetUserID)
		if err != nil {
			return err
		}

		if err := cloneGroupCards(ctx, tx, g.id, newGroupID); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func cloneGroupCards(ctx context.Context, tx pgx.Tx, sourceGroupID, targetGroupID string) error {
	rows, err := tx.Query(ctx, `
		SELECT w.transcription, w.translation, w.symbols
		FROM "Card" c
		JOIN "Word" w ON w.id = c."wordId"
		WHERE c."groupId" = $1
	`, sourceGroupID)
	if err != nil {
		return err
	}

	type wordRow struct {
		transcription string
		translation   string
		symbols       string
	}
	var words []wordRow
	for rows.Next() {
		var w wordRow
		if err := rows.Scan(&w.transcription, &w.translation, &w.symbols); err != nil {
			rows.Close()
			return err
		}
		words = append(words, w)
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return err
	}
	rows.Close()

	for _, w := range words {
		wordID := uuid.NewString()
		_, err = tx.Exec(ctx, `
			INSERT INTO "Word" (id, transcription, translation, symbols)
			VALUES ($1, $2, $3, $4)
		`, wordID, w.transcription, w.translation, w.symbols)
		if err != nil {
			return err
		}

		cardID := uuid.NewString()
		_, err = tx.Exec(ctx, `
			INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
			VALUES ($1, $2, $3, NOW())
		`, cardID, targetGroupID, wordID)
		if err != nil {
			return err
		}
	}
	return nil
}
