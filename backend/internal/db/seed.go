package db

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type seedWord struct {
	transcription string
	translation   string
	symbols       string
}

var numbers = []seedWord{
	{"yī", "one", "一"},
	{"èr", "two", "二"},
	{"sān", "three", "三"},
	{"sì", "four", "四"},
	{"wǔ", "five", "五"},
	{"liù", "six", "六"},
	{"qī", "seven", "七"},
	{"bā", "eight", "八"},
	{"jiǔ", "nine", "九"},
	{"shí", "ten", "十"},
}

var pronouns = []seedWord{
	{"wǒ", "I", "我"},
	{"nǐ", "you", "你"},
	{"tā", "he", "他"},
	{"tā", "she", "她"},
	{"wǒmen", "we", "我们"},
	{"nǐmen", "you (plural)", "你们"},
	{"tāmen", "they", "他们"},
}

func SeedIfEmpty(ctx context.Context, pool *pgxpool.Pool, defaultUserEmail string) error {
	var count int
	if err := pool.QueryRow(ctx, `SELECT COUNT(*) FROM "User"`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	userID := uuid.NewString()
	_, err = tx.Exec(ctx, `
		INSERT INTO "User" (id, username, email, password)
		VALUES ($1, $2, $3, $4)
	`, userID, "DemoUser", defaultUserEmail, "")
	if err != nil {
		return err
	}

	if err := seedGroup(ctx, tx, userID, "Numbers", numbers); err != nil {
		return err
	}
	if err := seedGroup(ctx, tx, userID, "Pronouns", pronouns); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func seedGroup(ctx context.Context, tx pgx.Tx, userID, name string, words []seedWord) error {
	groupID := uuid.NewString()
	_, err := tx.Exec(ctx, `
		INSERT INTO "Group" (id, name, "wordCount", "userId")
		VALUES ($1, $2, $3, $4)
	`, groupID, name, len(words), userID)
	if err != nil {
		return err
	}

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
		`, cardID, groupID, wordID)
		if err != nil {
			return err
		}
	}

	return nil
}
