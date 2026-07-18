package repository

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

type CardRow struct {
	ID          string
	GroupID     string
	WordID      string
	ShowCount   int
	Progress    float64
	Step        float64
	IsWinStreak bool
	Streak      int
	UpdatedAt   time.Time
}

type UpdateCardInput struct {
	ID          string
	WordID      *string
	Progress    *float64
	ShowCount   *int
	Step        *float64
	IsWinStreak *bool
	Streak      *int
}

type CardRepository struct {
	pool *pgxpool.Pool
}

func NewCardRepository(pool *pgxpool.Pool) *CardRepository {
	return &CardRepository{pool: pool}
}

func cardToDTO(row CardRow, word dto.Word) dto.Card {
	return dto.Card{
		ID:          row.ID,
		GroupID:     row.GroupID,
		Progress:    row.Progress,
		Word:        word,
		ShowCount:   row.ShowCount,
		Step:        row.Step,
		IsWinStreak: row.IsWinStreak,
		Streak:      row.Streak,
	}
}

func (r *CardRepository) scanCardWithWord(row pgx.Row) (dto.Card, error) {
	var c CardRow
	var w dto.Word
	err := row.Scan(
		&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress, &c.Step, &c.IsWinStreak, &c.Streak, &c.UpdatedAt,
		&w.ID, &w.Symbols, &w.Transcription, &w.Translation,
	)
	if err != nil {
		return dto.Card{}, err
	}
	return cardToDTO(c, w), nil
}

func (r *CardRepository) GetCardByID(ctx context.Context, id string) (CardRow, error) {
	var c CardRow
	err := r.pool.QueryRow(ctx, `
		SELECT id, "groupId", "wordId", "showCount", progress, step, "isWinStreak", streak, "updatedAt"
		FROM "Card" WHERE id = $1
	`, id).Scan(&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress, &c.Step, &c.IsWinStreak, &c.Streak, &c.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return CardRow{}, apperrors.New(apperrors.EntityNotFoundError)
		}
		return CardRow{}, err
	}
	return c, nil
}

func (r *CardRepository) GetCardsCount(ctx context.Context, wordID string) (int, error) {
	var count int
	err := r.pool.QueryRow(ctx, `SELECT COUNT(*) FROM "Card" WHERE "wordId" = $1`, wordID).Scan(&count)
	return count, err
}

func (r *CardRepository) AssertOwnedByUser(ctx context.Context, cardID, userID string) error {
	var exists bool
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM "Card" c
			JOIN "Group" g ON g.id = c."groupId"
			WHERE c.id = $1 AND g."userId" = $2
		)
	`, cardID, userID).Scan(&exists)
	if err != nil {
		return err
	}
	if !exists {
		return apperrors.New(apperrors.EntityNotFoundError)
	}
	return nil
}

func (r *CardRepository) GetCardsByGroupID(ctx context.Context, groupID, userID string) ([]dto.Card, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT c.id, c."groupId", c."wordId", c."showCount", c.progress, c.step, c."isWinStreak", c.streak, c."updatedAt",
		       w.id, w.symbols, w.transcription, w.translation
		FROM "Card" c
		JOIN "Word" w ON w.id = c."wordId"
		JOIN "Group" g ON g.id = c."groupId"
		WHERE c."groupId" = $1 AND g."userId" = $2
	`, groupID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cards := make([]dto.Card, 0)
	for rows.Next() {
		card, err := r.scanCardWithWord(rows)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	return cards, rows.Err()
}

func (r *CardRepository) CreateCard(ctx context.Context, tx pgx.Tx, groupID, wordID string) (dto.Card, error) {
	id := uuid.NewString()
	row := tx.QueryRow(ctx, `
		INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
		VALUES ($1, $2, $3, NOW())
		RETURNING id, "groupId", "wordId", "showCount", progress, step, "isWinStreak", streak, "updatedAt"
	`, id, groupID, wordID)

	var c CardRow
	err := row.Scan(&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress, &c.Step, &c.IsWinStreak, &c.Streak, &c.UpdatedAt)
	if err != nil {
		return dto.Card{}, err
	}

	var w dto.Word
	err = tx.QueryRow(ctx, `
		SELECT id, symbols, transcription, translation FROM "Word" WHERE id = $1
	`, wordID).Scan(&w.ID, &w.Symbols, &w.Transcription, &w.Translation)
	if err != nil {
		return dto.Card{}, err
	}

	return cardToDTO(c, w), nil
}

func (r *CardRepository) UpdateCard(ctx context.Context, tx pgx.Tx, data UpdateCardInput) (dto.Card, error) {
	query := `UPDATE "Card" SET "updatedAt" = NOW()`
	args := []any{data.ID}
	argPos := 2

	if data.WordID != nil {
		query += fmt.Sprintf(`, "wordId" = $%d`, argPos)
		args = append(args, *data.WordID)
		argPos++
	}
	if data.Progress != nil {
		query += fmt.Sprintf(`, progress = $%d`, argPos)
		args = append(args, *data.Progress)
		argPos++
	}
	if data.ShowCount != nil {
		query += fmt.Sprintf(`, "showCount" = $%d`, argPos)
		args = append(args, *data.ShowCount)
		argPos++
	}
	if data.Step != nil {
		query += fmt.Sprintf(`, step = $%d`, argPos)
		args = append(args, *data.Step)
		argPos++
	}
	if data.IsWinStreak != nil {
		query += fmt.Sprintf(`, "isWinStreak" = $%d`, argPos)
		args = append(args, *data.IsWinStreak)
		argPos++
	}
	if data.Streak != nil {
		query += fmt.Sprintf(`, streak = $%d`, argPos)
		args = append(args, *data.Streak)
		argPos++
	}

	query += fmt.Sprintf(` WHERE id = $1
		RETURNING id, "groupId", "wordId", "showCount", progress, step, "isWinStreak", streak, "updatedAt"`)

	var c CardRow
	var err error
	if tx != nil {
		err = tx.QueryRow(ctx, query, args...).Scan(
			&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress, &c.Step, &c.IsWinStreak, &c.Streak, &c.UpdatedAt,
		)
	} else {
		err = r.pool.QueryRow(ctx, query, args...).Scan(
			&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress, &c.Step, &c.IsWinStreak, &c.Streak, &c.UpdatedAt,
		)
	}
	if err != nil {
		return dto.Card{}, err
	}

	var w dto.Word
	if tx != nil {
		err = tx.QueryRow(ctx, `
			SELECT id, symbols, transcription, translation FROM "Word" WHERE id = $1
		`, c.WordID).Scan(&w.ID, &w.Symbols, &w.Transcription, &w.Translation)
	} else {
		err = r.pool.QueryRow(ctx, `
			SELECT id, symbols, transcription, translation FROM "Word" WHERE id = $1
		`, c.WordID).Scan(&w.ID, &w.Symbols, &w.Transcription, &w.Translation)
	}
	if err != nil {
		return dto.Card{}, err
	}

	return cardToDTO(c, w), nil
}

func (r *CardRepository) DeleteCard(ctx context.Context, tx pgx.Tx, id string) error {
	tag, err := tx.Exec(ctx, `DELETE FROM "Card" WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *CardRepository) DeleteCardByGroupID(ctx context.Context, groupID string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM "Card" WHERE "groupId" = $1`, groupID)
	return err
}

func (r *CardRepository) GetWriteCards(ctx context.Context, count int, userID string, groupID *string) ([]dto.Card, error) {
	query := `
		SELECT c.id, c."groupId", c."wordId", c."showCount", c.progress, c.step, c."isWinStreak", c.streak, c."updatedAt",
		       w.id, w.symbols, w.transcription, w.translation
		FROM "Card" c
		JOIN "Word" w ON w.id = c."wordId"
		JOIN "Group" g ON g.id = c."groupId"
		WHERE g."userId" = $1
	`
	args := []any{userID}

	if groupID != nil && *groupID != "" {
		query += ` AND c."groupId" = $2`
		args = append(args, *groupID)
	}

	query += ` ORDER BY c.progress ASC LIMIT ` + strconv.Itoa(count)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []dto.Card
	for rows.Next() {
		card, err := r.scanCardWithWord(rows)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	if cards == nil {
		cards = []dto.Card{}
	}
	return cards, rows.Err()
}
