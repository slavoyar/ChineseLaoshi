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
	"unicode/utf8"
)

type CardRow struct {
	ID            string
	GroupID       string
	WordID        string
	ShowCount     int
	Progress      float64
	Due           time.Time
	Stability     float64
	Difficulty    float64
	ElapsedDays   int
	ScheduledDays int
	Reps          int
	Lapses        int
	State         int
	LastReview    *time.Time
	UpdatedAt     time.Time
}

type CardWithWord struct {
	Card CardRow
	Word dto.Word
}

type UpdateCardInput struct {
	ID            string
	WordID        *string
	Progress      *float64
	ShowCount     *int
	Due           *time.Time
	Stability     *float64
	Difficulty    *float64
	ElapsedDays   *int
	ScheduledDays *int
	Reps          *int
	Lapses        *int
	State         *int
	LastReview    *time.Time
}

type CardRepository struct {
	pool *pgxpool.Pool
}

func NewCardRepository(pool *pgxpool.Pool) *CardRepository {
	return &CardRepository{pool: pool}
}

const cardSelectCols = `c.id, c."groupId", c."wordId", c."showCount", c.progress,
	c.due, c.stability, c.difficulty, c."elapsedDays", c."scheduledDays",
	c.reps, c.lapses, c.state, c."lastReview", c."updatedAt"`

const cardReturningCols = `id, "groupId", "wordId", "showCount", progress,
	due, stability, difficulty, "elapsedDays", "scheduledDays",
	reps, lapses, state, "lastReview", "updatedAt"`

func (r *CardRepository) scanCardRow(row pgx.Row) (CardRow, error) {
	var c CardRow
	err := row.Scan(
		&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress,
		&c.Due, &c.Stability, &c.Difficulty, &c.ElapsedDays, &c.ScheduledDays,
		&c.Reps, &c.Lapses, &c.State, &c.LastReview, &c.UpdatedAt,
	)
	return c, err
}

func (r *CardRepository) scanCardWithWord(row pgx.Row) (CardWithWord, error) {
	var c CardRow
	var w dto.Word
	err := row.Scan(
		&c.ID, &c.GroupID, &c.WordID, &c.ShowCount, &c.Progress,
		&c.Due, &c.Stability, &c.Difficulty, &c.ElapsedDays, &c.ScheduledDays,
		&c.Reps, &c.Lapses, &c.State, &c.LastReview, &c.UpdatedAt,
		&w.ID, &w.Symbols, &w.Transcription, &w.Translation,
	)
	if err != nil {
		return CardWithWord{}, err
	}
	return CardWithWord{Card: c, Word: w}, nil
}

func (r *CardRepository) GetCardByID(ctx context.Context, id string) (CardRow, error) {
	c, err := r.scanCardRow(r.pool.QueryRow(ctx, `
		SELECT `+cardReturningCols+`
		FROM "Card" WHERE id = $1
	`, id))
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

func (r *CardRepository) GetCardsByGroupID(ctx context.Context, groupID, userID string) ([]CardWithWord, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT `+cardSelectCols+`,
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

	cards := make([]CardWithWord, 0)
	for rows.Next() {
		card, err := r.scanCardWithWord(rows)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	return cards, rows.Err()
}

func (r *CardRepository) CreateCard(ctx context.Context, tx pgx.Tx, groupID, wordID string) (CardWithWord, error) {
	id := uuid.NewString()
	c, err := r.scanCardRow(tx.QueryRow(ctx, `
		INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
		VALUES ($1, $2, $3, NOW())
		RETURNING `+cardReturningCols+`
	`, id, groupID, wordID))
	if err != nil {
		return CardWithWord{}, err
	}

	var w dto.Word
	err = tx.QueryRow(ctx, `
		SELECT id, symbols, transcription, translation FROM "Word" WHERE id = $1
	`, wordID).Scan(&w.ID, &w.Symbols, &w.Transcription, &w.Translation)
	if err != nil {
		return CardWithWord{}, err
	}

	return CardWithWord{Card: c, Word: w}, nil
}

func (r *CardRepository) UpdateCard(ctx context.Context, tx pgx.Tx, data UpdateCardInput) (CardWithWord, error) {
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
	if data.Due != nil {
		query += fmt.Sprintf(`, due = $%d`, argPos)
		args = append(args, *data.Due)
		argPos++
	}
	if data.Stability != nil {
		query += fmt.Sprintf(`, stability = $%d`, argPos)
		args = append(args, *data.Stability)
		argPos++
	}
	if data.Difficulty != nil {
		query += fmt.Sprintf(`, difficulty = $%d`, argPos)
		args = append(args, *data.Difficulty)
		argPos++
	}
	if data.ElapsedDays != nil {
		query += fmt.Sprintf(`, "elapsedDays" = $%d`, argPos)
		args = append(args, *data.ElapsedDays)
		argPos++
	}
	if data.ScheduledDays != nil {
		query += fmt.Sprintf(`, "scheduledDays" = $%d`, argPos)
		args = append(args, *data.ScheduledDays)
		argPos++
	}
	if data.Reps != nil {
		query += fmt.Sprintf(`, reps = $%d`, argPos)
		args = append(args, *data.Reps)
		argPos++
	}
	if data.Lapses != nil {
		query += fmt.Sprintf(`, lapses = $%d`, argPos)
		args = append(args, *data.Lapses)
		argPos++
	}
	if data.State != nil {
		query += fmt.Sprintf(`, state = $%d`, argPos)
		args = append(args, *data.State)
		argPos++
	}
	if data.LastReview != nil {
		query += fmt.Sprintf(`, "lastReview" = $%d`, argPos)
		args = append(args, *data.LastReview)
	}

	query += ` WHERE id = $1 RETURNING ` + cardReturningCols

	var c CardRow
	var err error
	if tx != nil {
		c, err = r.scanCardRow(tx.QueryRow(ctx, query, args...))
	} else {
		c, err = r.scanCardRow(r.pool.QueryRow(ctx, query, args...))
	}
	if err != nil {
		return CardWithWord{}, err
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
		return CardWithWord{}, err
	}

	return CardWithWord{Card: c, Word: w}, nil
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

func (r *CardRepository) GetWriteCards(ctx context.Context, count int, userID string, groupID *string) ([]CardWithWord, error) {
	query := `
		SELECT ` + cardSelectCols + `,
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

	query += `
		ORDER BY
			CASE
				WHEN c.due <= NOW() THEN 0
				WHEN c.state = 0 THEN 1
				ELSE 2
			END,
			c.due ASC
		LIMIT ` + strconv.Itoa(count)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []CardWithWord
	for rows.Next() {
		card, err := r.scanCardWithWord(rows)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	if cards == nil {
		cards = []CardWithWord{}
	}
	return cards, rows.Err()
}

func (r *CardRepository) GetQuizDistractors(ctx context.Context, cardID, userID string) ([]dto.Word, error) {
	var groupID, symbols string
	err := r.pool.QueryRow(ctx, `
		SELECT c."groupId", w.symbols
		FROM "Card" c
		JOIN "Word" w ON w.id = c."wordId"
		JOIN "Group" g ON g.id = c."groupId"
		WHERE c.id = $1 AND g."userId" = $2
	`, cardID, userID).Scan(&groupID, &symbols)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, apperrors.New(apperrors.EntityNotFoundError)
		}
		return nil, err
	}

	symbolLen := utf8.RuneCountInString(symbols)

	rows, err := r.pool.Query(ctx, `
		SELECT w.id, w.symbols, w.transcription, w.translation
		FROM "Card" c
		JOIN "Word" w ON w.id = c."wordId"
		JOIN "Group" g ON g.id = c."groupId"
		WHERE g."userId" = $1
		  AND c.id != $2
		  AND char_length(w.symbols) = $3
		GROUP BY w.id, w.symbols, w.transcription, w.translation
		ORDER BY MIN(CASE WHEN c."groupId" = $4 THEN 0 ELSE 1 END), random()
		LIMIT 10
	`, userID, cardID, symbolLen, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	words := make([]dto.Word, 0)
	for rows.Next() {
		var w dto.Word
		if err := rows.Scan(&w.ID, &w.Symbols, &w.Transcription, &w.Translation); err != nil {
			return nil, err
		}
		words = append(words, w)
	}
	return words, rows.Err()
}
