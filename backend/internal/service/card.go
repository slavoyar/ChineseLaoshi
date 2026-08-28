package service

import (
	"context"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	fsrs "github.com/open-spaced-repetition/go-fsrs/v3"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

type CardService struct {
	pool   repository.PoolBeginner
	cards  *repository.CardRepository
	groups *repository.GroupRepository
	words  *repository.WordRepository
	fsrs   *fsrs.FSRS
}

func NewCardService(
	pool repository.PoolBeginner,
	cards *repository.CardRepository,
	groups *repository.GroupRepository,
	words *repository.WordRepository,
) *CardService {
	params := fsrs.DefaultParam()
	params.RequestRetention = 0.9
	return &CardService{
		pool:   pool,
		cards:  cards,
		groups: groups,
		words:  words,
		fsrs:   fsrs.NewFSRS(params),
	}
}

func rowToFSRSCard(row repository.CardRow) fsrs.Card {
	card := fsrs.Card{
		Due:           row.Due,
		Stability:     row.Stability,
		Difficulty:    row.Difficulty,
		ElapsedDays:   uint64(row.ElapsedDays),
		ScheduledDays: uint64(row.ScheduledDays),
		Reps:          uint64(row.Reps),
		Lapses:        uint64(row.Lapses),
		State:         fsrs.State(row.State),
	}
	if row.LastReview != nil {
		card.LastReview = *row.LastReview
	}
	return card
}

func (s *CardService) progressFor(row repository.CardRow, now time.Time) float64 {
	state := fsrs.State(row.State)
	if state == fsrs.New {
		return 0
	}
	r := s.fsrs.GetRetrievability(rowToFSRSCard(row), now)
	// Right after a review R≈1 even for Again. Keep Learning/Relearning mastery visually low
	// until the card graduates to Review; scheduling still uses full FSRS state.
	if state == fsrs.Learning || state == fsrs.Relearning {
		if r > 0.45 {
			return 0.45
		}
	}
	return r
}

func (s *CardService) toDTO(cw repository.CardWithWord, now time.Time) dto.Card {
	return dto.Card{
		ID:        cw.Card.ID,
		GroupID:   cw.Card.GroupID,
		Progress:  s.progressFor(cw.Card, now),
		Word:      cw.Word,
		ShowCount: cw.Card.ShowCount,
	}
}

func (s *CardService) toDTOs(rows []repository.CardWithWord) []dto.Card {
	now := time.Now()
	out := make([]dto.Card, len(rows))
	for i, row := range rows {
		out[i] = s.toDTO(row, now)
	}
	return out
}

func (s *CardService) GetCardsByGroupID(ctx context.Context, groupID, userID string) ([]dto.Card, error) {
	if err := s.groups.AssertOwnedByUser(ctx, groupID, userID); err != nil {
		return nil, err
	}
	rows, err := s.cards.GetCardsByGroupID(ctx, groupID, userID)
	if err != nil {
		return nil, err
	}
	return s.toDTOs(rows), nil
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

	row, err := s.cards.CreateCard(ctx, tx, data.GroupID, wordID)
	if err != nil {
		return dto.Card{}, err
	}

	if err := s.groups.IncrementWordCount(ctx, tx, data.GroupID); err != nil {
		return dto.Card{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return dto.Card{}, err
	}
	return s.toDTO(row, time.Now()), nil
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

	now := time.Now()
	rating := fsrs.Again
	if data.Guessed {
		rating = fsrs.Good
	}

	next := s.fsrs.Next(rowToFSRSCard(card), now, rating).Card
	progress := s.progressFor(repository.CardRow{
		Due:           next.Due,
		Stability:     next.Stability,
		Difficulty:    next.Difficulty,
		ElapsedDays:   int(next.ElapsedDays),
		ScheduledDays: int(next.ScheduledDays),
		Reps:          int(next.Reps),
		Lapses:        int(next.Lapses),
		State:         int(next.State),
		LastReview:    &next.LastReview,
	}, now)
	showCount := card.ShowCount + 1
	elapsedDays := int(next.ElapsedDays)
	scheduledDays := int(next.ScheduledDays)
	reps := int(next.Reps)
	lapses := int(next.Lapses)
	state := int(next.State)
	lastReview := next.LastReview

	_, err = s.cards.UpdateCard(ctx, nil, repository.UpdateCardInput{
		ID:            data.ID,
		Progress:      &progress,
		ShowCount:     &showCount,
		Due:           &next.Due,
		Stability:     &next.Stability,
		Difficulty:    &next.Difficulty,
		ElapsedDays:   &elapsedDays,
		ScheduledDays: &scheduledDays,
		Reps:          &reps,
		Lapses:        &lapses,
		State:         &state,
		LastReview:    &lastReview,
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
	rows, err := s.cards.GetWriteCards(ctx, count, userID, data.GroupID)
	if err != nil {
		return nil, err
	}
	return s.toDTOs(rows), nil
}

func (s *CardService) GetQuizDistractors(ctx context.Context, cardID, userID string) ([]dto.Word, error) {
	if err := s.cards.AssertOwnedByUser(ctx, cardID, userID); err != nil {
		return nil, err
	}
	words, err := s.cards.GetQuizDistractors(ctx, cardID, userID)
	if err != nil {
		return nil, err
	}
	if words == nil {
		words = []dto.Word{}
	}
	return words, nil
}
