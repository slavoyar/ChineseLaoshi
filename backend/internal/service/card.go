package service

import (
	"context"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

const (
	stepDiff = 0.02
	maxStep  = 0.2
	minStep  = 0.05
)

type CardService struct {
	pool   repository.PoolBeginner
	cards  *repository.CardRepository
	groups *repository.GroupRepository
	words  *repository.WordRepository
}

func NewCardService(
	pool repository.PoolBeginner,
	cards *repository.CardRepository,
	groups *repository.GroupRepository,
	words *repository.WordRepository,
) *CardService {
	return &CardService{pool: pool, cards: cards, groups: groups, words: words}
}

func (s *CardService) GetCardsByGroupID(ctx context.Context, groupID, userID string) ([]dto.Card, error) {
	if err := s.groups.AssertOwnedByUser(ctx, groupID, userID); err != nil {
		return nil, err
	}
	return s.cards.GetCardsByGroupID(ctx, groupID, userID)
}

func isCreateWord(word dto.CreateCardWord) bool {
	return word.Symbols != nil && word.Transcription != nil && word.Translation != nil &&
		*word.Symbols != "" && *word.Transcription != "" && *word.Translation != ""
}

func (s *CardService) CreateCard(ctx context.Context, data dto.CreateCard, userID string) (dto.Card, error) {
	if err := s.groups.AssertOwnedByUser(ctx, data.GroupID, userID); err != nil {
		return dto.Card{}, err
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return dto.Card{}, err
	}
	defer tx.Rollback(ctx)

	var wordID string
	if isCreateWord(data.Word) {
		word, err := s.words.CreateWord(ctx, tx, dto.CreateWord{
			Symbols:       *data.Word.Symbols,
			Transcription: *data.Word.Transcription,
			Translation:   *data.Word.Translation,
		})
		if err != nil {
			return dto.Card{}, err
		}
		wordID = word.ID
	} else if data.Word.ID != nil {
		wordID = *data.Word.ID
	} else {
		return dto.Card{}, apperrors.New(apperrors.ValidationError)
	}

	card, err := s.cards.CreateCard(ctx, tx, data.GroupID, wordID)
	if err != nil {
		return dto.Card{}, err
	}

	if err := s.groups.IncrementWordCount(ctx, tx, data.GroupID); err != nil {
		return dto.Card{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return dto.Card{}, err
	}
	return card, nil
}

func (s *CardService) DeleteCard(ctx context.Context, id, userID string) error {
	if err := s.cards.AssertOwnedByUser(ctx, id, userID); err != nil {
		return err
	}

	card, err := s.cards.GetCardByID(ctx, id)
	if err != nil {
		return err
	}

	cardsCount, err := s.cards.GetCardsCount(ctx, card.WordID)
	if err != nil {
		return err
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if err := s.cards.DeleteCard(ctx, tx, id); err != nil {
		if err == pgx.ErrNoRows {
			return apperrors.New(apperrors.EntityNotFoundError)
		}
		return err
	}

	if cardsCount == 1 {
		if err := s.words.DeleteWord(ctx, tx, card.WordID); err != nil {
			return err
		}
	}

	if err := s.groups.DecrementWordCount(ctx, tx, card.GroupID); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (s *CardService) UpdateCard(ctx context.Context, data dto.UpdateCardWord, userID string) error {
	if err := s.cards.AssertOwnedByUser(ctx, data.ID, userID); err != nil {
		return err
	}
	if data.Word.ID == "" {
		return apperrors.New(apperrors.EntityUpdateError)
	}

	cardCount, err := s.cards.GetCardsCount(ctx, data.Word.ID)
	if err != nil {
		return err
	}

	if cardCount != 1 {
		tx, err := s.pool.Begin(ctx)
		if err != nil {
			return err
		}
		defer tx.Rollback(ctx)

		word, err := s.words.CreateWord(ctx, tx, dto.CreateWord{
			Symbols:       data.Word.Symbols,
			Transcription: data.Word.Transcription,
			Translation:   data.Word.Translation,
		})
		if err != nil {
			return err
		}

		_, err = s.cards.UpdateCard(ctx, tx, repository.UpdateCardInput{
			ID:     data.ID,
			WordID: &word.ID,
		})
		if err != nil {
			return err
		}

		return tx.Commit(ctx)
	}

	_, err = s.words.UpdateWord(ctx, data.Word)
	return err
}

func (s *CardService) UpdateCardStats(ctx context.Context, data dto.UpdateCardStats, userID string) error {
	if err := s.cards.AssertOwnedByUser(ctx, data.ID, userID); err != nil {
		return err
	}

	card, err := s.cards.GetCardByID(ctx, data.ID)
	if err != nil {
		return err
	}

	updatedStep := minStep + stepDiff*float64(card.Streak)
	if updatedStep > maxStep {
		updatedStep = maxStep
	}

	var progress float64
	if data.Guessed {
		progress = card.Progress + updatedStep
		if progress > 1 {
			progress = 1
		}
	} else {
		progress = card.Progress - updatedStep
		if progress < 0 {
			progress = 0
		}
	}

	streak := 0
	if data.Guessed == card.IsWinStreak && data.Guessed {
		streak = card.Streak + 1
	}

	showCount := card.ShowCount + 1
	isWinStreak := data.Guessed

	_, err = s.cards.UpdateCard(ctx, nil, repository.UpdateCardInput{
		ID:          data.ID,
		Progress:    &progress,
		ShowCount:   &showCount,
		Step:        &updatedStep,
		IsWinStreak: &isWinStreak,
		Streak:      &streak,
	})
	return err
}

func (s *CardService) GetWriteCards(ctx context.Context, data dto.GetWriteCard, userID string) ([]dto.Card, error) {
	count, err := strconv.Atoi(data.Count)
	if err != nil {
		return nil, apperrors.New(apperrors.ValidationError)
	}
	if data.GroupID != nil && *data.GroupID != "" {
		if err := s.groups.AssertOwnedByUser(ctx, *data.GroupID, userID); err != nil {
			return nil, err
		}
	}
	return s.cards.GetWriteCards(ctx, count, userID, data.GroupID)
}
