package service

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
)

type GroupService struct {
	pool   repository.PoolBeginner
	cards  *repository.CardRepository
	groups *repository.GroupRepository
	words  *repository.WordRepository
}

func NewGroupService(
	pool repository.PoolBeginner,
	cards *repository.CardRepository,
	groups *repository.GroupRepository,
	words *repository.WordRepository,
) *GroupService {
	return &GroupService{pool: pool, cards: cards, groups: groups, words: words}
}

func (s *GroupService) GetGroupsByUserID(ctx context.Context, userID string) ([]dto.Group, error) {
	return s.groups.GetGroupsByUserID(ctx, userID)
}

func (s *GroupService) CreateGroup(ctx context.Context, data dto.CreateGroup, userID string) (dto.Group, error) {
	return s.groups.CreateGroup(ctx, data, userID)
}

func (s *GroupService) UpdateGroup(ctx context.Context, data dto.UpdateGroup, userID string) (dto.Group, error) {
	group, err := s.groups.UpdateGroup(ctx, data, userID)
	if err == pgx.ErrNoRows {
		return dto.Group{}, apperrors.New(apperrors.EntityNotFoundError)
	}
	return group, err
}

func (s *GroupService) DeleteGroup(ctx context.Context, id, userID string) error {
	if err := s.groups.AssertOwnedByUser(ctx, id, userID); err != nil {
		return err
	}

	cards, err := s.cards.GetCardsByGroupID(ctx, id, userID)
	if err != nil {
		return err
	}

	wordIDs := make([]string, 0, len(cards))
	for _, card := range cards {
		wordIDs = append(wordIDs, card.Word.ID)
	}

	wordsInOtherGroups, err := s.words.GetWordsInOtherGroups(ctx, id, wordIDs)
	if err != nil {
		return err
	}

	otherSet := make(map[string]struct{}, len(wordsInOtherGroups))
	for _, w := range wordsInOtherGroups {
		otherSet[w.WordID] = struct{}{}
	}

	var singleUsageWordIDs []string
	for _, wordID := range wordIDs {
		if _, found := otherSet[wordID]; !found {
			singleUsageWordIDs = append(singleUsageWordIDs, wordID)
		}
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `DELETE FROM "Card" WHERE "groupId" = $1`, id); err != nil {
		return err
	}

	tag, err := tx.Exec(ctx, `DELETE FROM "Group" WHERE id = $1 AND "userId" = $2`, id, userID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return apperrors.New(apperrors.EntityNotFoundError)
	}

	if len(singleUsageWordIDs) > 0 {
		if _, err := tx.Exec(ctx, `DELETE FROM "Word" WHERE id = ANY($1)`, singleUsageWordIDs); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
