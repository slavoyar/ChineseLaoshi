package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

type WordRepository struct {
	pool *pgxpool.Pool
}

func NewWordRepository(pool *pgxpool.Pool) *WordRepository {
	return &WordRepository{pool: pool}
}

func (r *WordRepository) SearchWord(ctx context.Context, query string) ([]dto.Word, error) {
	if query == "" {
		return []dto.Word{}, nil
	}

	rows, err := r.pool.Query(ctx, `
		SELECT id, symbols, transcription, translation FROM "Word"
		WHERE translation ILIKE '%' || $1 || '%'
		   OR transcription ILIKE '%' || $1 || '%'
		   OR symbols ILIKE '%' || $1 || '%'
		LIMIT 10
	`, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var words []dto.Word
	for rows.Next() {
		var w dto.Word
		if err := rows.Scan(&w.ID, &w.Symbols, &w.Transcription, &w.Translation); err != nil {
			return nil, err
		}
		words = append(words, w)
	}
	if words == nil {
		words = []dto.Word{}
	}
	return words, rows.Err()
}

func (r *WordRepository) CreateWord(ctx context.Context, tx pgx.Tx, data dto.CreateWord) (dto.Word, error) {
	id := uuid.NewString()
	var w dto.Word
	err := tx.QueryRow(ctx, `
		INSERT INTO "Word" (id, symbols, transcription, translation)
		VALUES ($1, $2, $3, $4)
		RETURNING id, symbols, transcription, translation
	`, id, data.Symbols, data.Transcription, data.Translation).Scan(
		&w.ID, &w.Symbols, &w.Transcription, &w.Translation,
	)
	return w, err
}

func (r *WordRepository) UpdateWord(ctx context.Context, data dto.Word) (dto.Word, error) {
	var w dto.Word
	err := r.pool.QueryRow(ctx, `
		UPDATE "Word"
		SET symbols = $2, transcription = $3, translation = $4
		WHERE id = $1
		RETURNING id, symbols, transcription, translation
	`, data.ID, data.Symbols, data.Transcription, data.Translation).Scan(
		&w.ID, &w.Symbols, &w.Transcription, &w.Translation,
	)
	return w, err
}

func (r *WordRepository) DeleteWord(ctx context.Context, tx pgx.Tx, id string) error {
	_, err := tx.Exec(ctx, `DELETE FROM "Word" WHERE id = $1`, id)
	return err
}

func (r *WordRepository) DeleteWords(ctx context.Context, ids []string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM "Word" WHERE id = ANY($1)`, ids)
	return err
}

type WordInOtherGroup struct {
	WordID string
	Count  int
}

func (r *WordRepository) GetWordsInOtherGroups(ctx context.Context, groupID string, wordIDs []string) ([]WordInOtherGroup, error) {
	if len(wordIDs) == 0 {
		return []WordInOtherGroup{}, nil
	}

	rows, err := r.pool.Query(ctx, `
		SELECT "wordId", COUNT(*)::int
		FROM "Card"
		WHERE "wordId" = ANY($1) AND "groupId" <> $2
		GROUP BY "wordId"
	`, wordIDs, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []WordInOtherGroup
	for rows.Next() {
		var item WordInOtherGroup
		if err := rows.Scan(&item.WordID, &item.Count); err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	if result == nil {
		result = []WordInOtherGroup{}
	}
	return result, rows.Err()
}
