package db

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
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

// EnsureTemplateData creates or upgrades the demo template user and starter groups.
func EnsureTemplateData(ctx context.Context, pool *pgxpool.Pool, templateEmail string) error {
	templateID, err := resolveTemplateUserID(ctx, pool, templateEmail)
	if err != nil {
		return err
	}
	return ensureTemplateGroups(ctx, pool, templateID)
}

func resolveTemplateUserID(ctx context.Context, pool *pgxpool.Pool, templateEmail string) (string, error) {
	var templateID string
	err := pool.QueryRow(ctx, `
		SELECT id FROM "User"
		WHERE provider = $1 AND provider_subject = $2
	`, config.TemplateProvider, config.TemplateProviderSubject).Scan(&templateID)
	if err == nil {
		return templateID, nil
	}
	if err != pgx.ErrNoRows {
		return "", err
	}

	// Upgrade an existing local seed user if present (pre-SSO databases).
	err = pool.QueryRow(ctx, `
		SELECT id FROM "User"
		WHERE email = $1 OR username = 'DemoUser'
		ORDER BY CASE WHEN email = $1 THEN 0 ELSE 1 END
		LIMIT 1
	`, templateEmail).Scan(&templateID)
	if err == nil {
		_, err = pool.Exec(ctx, `
			UPDATE "User"
			SET email = $2,
			    provider = $3,
			    provider_subject = $4,
			    password = NULL
			WHERE id = $1
		`, templateID, templateEmail, config.TemplateProvider, config.TemplateProviderSubject)
		if err != nil {
			return "", err
		}
		return templateID, nil
	}
	if err != pgx.ErrNoRows {
		return "", err
	}

	templateID = uuid.NewString()
	_, err = pool.Exec(ctx, `
		INSERT INTO "User" (id, username, email, password, provider, provider_subject, avatar_url)
		VALUES ($1, $2, $3, NULL, $4, $5, NULL)
	`, templateID, "DemoUser", templateEmail, config.TemplateProvider, config.TemplateProviderSubject)
	if err != nil {
		return "", err
	}
	return templateID, nil
}

func ensureTemplateGroups(ctx context.Context, pool *pgxpool.Pool, templateID string) error {
	var count int
	if err := pool.QueryRow(ctx, `SELECT COUNT(*) FROM "Group" WHERE "userId" = $1`, templateID).Scan(&count); err != nil {
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

	if err := seedGroup(ctx, tx, templateID, "Numbers", numbers); err != nil {
		return err
	}
	if err := seedGroup(ctx, tx, templateID, "Pronouns", pronouns); err != nil {
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
