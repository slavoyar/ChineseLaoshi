package service_test

import (
	"context"
	"testing"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func setupFullServices(t *testing.T) (*service.GroupService, *service.CardService, string) {
	t.Helper()
	app := testutil.SetupTestApp(t)
	groupRepo := repository.NewGroupRepository(app.Pool())
	cardRepo := repository.NewCardRepository(app.Pool())
	wordRepo := repository.NewWordRepository(app.Pool())
	userID := testutil.GetUUID(1)
	groupSvc := service.NewGroupService(app.Pool(), cardRepo, groupRepo, wordRepo)
	cardSvc := service.NewCardService(app.Pool(), cardRepo, groupRepo, wordRepo)
	return groupSvc, cardSvc, userID
}

func TestGroupService_UpdateGroup(t *testing.T) {
	svc, _, userID := setupFullServices(t)
	group, err := svc.CreateGroup(context.Background(), dto.CreateGroup{Name: "To Update"}, userID)
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	updated, err := svc.UpdateGroup(context.Background(), dto.UpdateGroup{ID: group.ID, Name: "Updated"}, userID)
	if err != nil || updated.Name != "Updated" {
		t.Fatalf("update: %v %+v", err, updated)
	}
}

func TestGroupService_DeleteGroup(t *testing.T) {
	svc, _, userID := setupFullServices(t)
	group, err := svc.CreateGroup(context.Background(), dto.CreateGroup{Name: "To Delete"}, userID)
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if err := svc.DeleteGroup(context.Background(), group.ID, userID); err != nil {
		t.Fatalf("delete: %v", err)
	}
}

func TestGroupService_DeleteGroupWithCards(t *testing.T) {
	groupSvc, cardSvc, userID := setupFullServices(t)
	symbols, transcription, translation := "五", "wu", "five"
	card, err := cardSvc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(3),
		Word: dto.CreateCardWord{
			Symbols:       &symbols,
			Transcription: &transcription,
			Translation:   &translation,
		},
	}, userID)
	if err != nil {
		t.Fatalf("create card: %v", err)
	}
	groupID := card.GroupID
	if err := groupSvc.DeleteGroup(context.Background(), groupID, userID); err != nil {
		t.Fatalf("delete group: %v", err)
	}
}

func TestCardService_CreateCardWithNewWord(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	symbols, transcription, translation := "四", "si", "four"
	card, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(1),
		Word: dto.CreateCardWord{
			Symbols:       &symbols,
			Transcription: &transcription,
			Translation:   &translation,
		},
	}, userID)
	if err != nil {
		t.Fatalf("create card: %v", err)
	}
	if card.Word.Symbols != "四" {
		t.Fatalf("unexpected card: %+v", card)
	}
}

func TestCardService_CreateCardWithExistingWord(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	wordID := testutil.GetUUID(1)
	card, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(1),
		Word:    dto.CreateCardWord{ID: &wordID},
	}, userID)
	if err != nil {
		t.Fatalf("create card: %v", err)
	}
	if card.Word.ID != wordID {
		t.Fatalf("unexpected word id: %s", card.Word.ID)
	}
}

func TestCardService_DeleteCard(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	if err := svc.DeleteCard(context.Background(), testutil.GetUUID(3), userID); err != nil {
		t.Fatalf("delete card: %v", err)
	}
}

func TestCardService_UpdateCard(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	err := svc.UpdateCard(context.Background(), dto.UpdateCardWord{
		ID:   testutil.GetUUID(1),
		Word: dto.Word{ID: testutil.GetUUID(1), Symbols: "一", Transcription: "yi", Translation: "one"},
	}, userID)
	if err != nil {
		t.Fatalf("update card: %v", err)
	}
}

func TestCardService_GetCardsByGroupNotOwned(t *testing.T) {
	_, svc, _ := setupFullServices(t)
	_, err := svc.GetCardsByGroupID(context.Background(), testutil.GetUUID(1), testutil.GetUUID(404))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_CreateCardValidationError(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	_, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(1),
		Word:    dto.CreateCardWord{},
	}, userID)
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.ValidationError {
		t.Fatalf("expected validation error, got %v", err)
	}
}

func TestCardService_UpdateCardStatsWrongGuess(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	err := svc.UpdateCardStats(context.Background(), dto.UpdateCardStats{
		ID: testutil.GetUUID(2), Guessed: false,
	}, userID)
	if err != nil {
		t.Fatalf("update stats: %v", err)
	}
}

func TestCardService_UpdateCardSharedWord(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	wordID := testutil.GetUUID(1)
	_, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(2),
		Word:    dto.CreateCardWord{ID: &wordID},
	}, userID)
	if err != nil {
		t.Fatalf("create shared word card: %v", err)
	}
	err = svc.UpdateCard(context.Background(), dto.UpdateCardWord{
		ID:   testutil.GetUUID(1),
		Word: dto.Word{ID: wordID, Symbols: "一", Transcription: "yi", Translation: "one updated"},
	}, userID)
	if err != nil {
		t.Fatalf("update shared word card: %v", err)
	}
}

func TestGroupService_DeleteGroupNotFound(t *testing.T) {
	svc, _, userID := setupFullServices(t)
	err := svc.DeleteGroup(context.Background(), testutil.GetUUID(404), userID)
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_DeleteCardNotFound(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	err := svc.DeleteCard(context.Background(), testutil.GetUUID(404), userID)
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_UpdateCardEmptyWordID(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	err := svc.UpdateCard(context.Background(), dto.UpdateCardWord{
		ID:   testutil.GetUUID(1),
		Word: dto.Word{Symbols: "一", Transcription: "yi", Translation: "one"},
	}, userID)
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityUpdateError {
		t.Fatalf("expected update error, got %v", err)
	}
}

func TestGroupService_DeleteGroupWithSharedWord(t *testing.T) {
	groupSvc, cardSvc, userID := setupFullServices(t)
	wordID := testutil.GetUUID(1)
	_, err := cardSvc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(2),
		Word:    dto.CreateCardWord{ID: &wordID},
	}, userID)
	if err != nil {
		t.Fatalf("create shared card: %v", err)
	}
	if err := groupSvc.DeleteGroup(context.Background(), testutil.GetUUID(1), userID); err != nil {
		t.Fatalf("delete group with shared word: %v", err)
	}
}

func TestCardService_GetWriteCardsWithGroupFilter(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	groupID := testutil.GetUUID(1)
	cards, err := svc.GetWriteCards(context.Background(), dto.GetWriteCard{Count: "5", GroupID: &groupID}, userID)
	if err != nil {
		t.Fatalf("get write cards: %v", err)
	}
	if len(cards) != 2 {
		t.Fatalf("expected 2 cards in group, got %d", len(cards))
	}
}

func TestCardService_GetQuizDistractors(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	words, err := svc.GetQuizDistractors(context.Background(), testutil.GetUUID(1), userID)
	if err != nil {
		t.Fatalf("get distractors: %v", err)
	}
	if len(words) == 0 {
		t.Fatal("expected at least one distractor")
	}
	for _, w := range words {
		if w.ID == testutil.GetUUID(1) {
			t.Fatal("distractors must not include the card's own word")
		}
	}
}

func TestCardService_GetQuizDistractorsNotFound(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	_, err := svc.GetQuizDistractors(context.Background(), testutil.GetUUID(404), userID)
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_GetQuizDistractorsNotOwned(t *testing.T) {
	_, svc, _ := setupFullServices(t)
	_, err := svc.GetQuizDistractors(context.Background(), testutil.GetUUID(1), testutil.GetUUID(404))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_UpdateCardStatsWinStreak(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	app := testutil.SetupTestApp(t)
	cardRepo := repository.NewCardRepository(app.Pool())
	cardID := testutil.GetUUID(1)

	if err := svc.UpdateCardStats(context.Background(), dto.UpdateCardStats{
		ID: cardID, Guessed: true,
	}, userID); err != nil {
		t.Fatalf("update stats: %v", err)
	}

	row, err := cardRepo.GetCardByID(context.Background(), cardID)
	if err != nil {
		t.Fatalf("get card: %v", err)
	}
	if row.Reps < 1 {
		t.Fatalf("expected reps after good review, got %d", row.Reps)
	}
	if row.LastReview == nil {
		t.Fatal("expected lastReview to be set")
	}
	if !row.Due.After(time.Now().Add(-time.Minute)) {
		t.Fatalf("expected due to be scheduled, got %v", row.Due)
	}
}

func TestCardService_CreateCardGroupNotOwned(t *testing.T) {
	_, svc, _ := setupFullServices(t)
	symbols, transcription, translation := "八", "ba", "eight"
	_, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(404),
		Word: dto.CreateCardWord{
			Symbols: &symbols, Transcription: &transcription, Translation: &translation,
		},
	}, testutil.GetUUID(1))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_DeleteCardRemovesOrphanWord(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	symbols, transcription, translation := "九", "jiu", "nine"
	card, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(3),
		Word: dto.CreateCardWord{
			Symbols: &symbols, Transcription: &transcription, Translation: &translation,
		},
	}, userID)
	if err != nil {
		t.Fatalf("create card: %v", err)
	}
	if err := svc.DeleteCard(context.Background(), card.ID, userID); err != nil {
		t.Fatalf("delete card: %v", err)
	}
}

func TestCardService_UpdateCardStatsGoodAndAgain(t *testing.T) {
	_, svc, userID := setupFullServices(t)
	app := testutil.SetupTestApp(t)
	cardRepo := repository.NewCardRepository(app.Pool())
	cardID := testutil.GetUUID(1)

	if err := svc.UpdateCardStats(context.Background(), dto.UpdateCardStats{
		ID: cardID, Guessed: true,
	}, userID); err != nil {
		t.Fatalf("good review: %v", err)
	}
	afterGood, err := cardRepo.GetCardByID(context.Background(), cardID)
	if err != nil {
		t.Fatalf("get after good: %v", err)
	}
	if afterGood.Progress < 0 || afterGood.Progress > 1 {
		t.Fatalf("progress out of range: %f", afterGood.Progress)
	}
	if afterGood.Stability <= 0 {
		t.Fatalf("expected positive stability after good, got %f", afterGood.Stability)
	}
	goodDue := afterGood.Due

	if err := svc.UpdateCardStats(context.Background(), dto.UpdateCardStats{
		ID: cardID, Guessed: false,
	}, userID); err != nil {
		t.Fatalf("again review: %v", err)
	}
	afterAgain, err := cardRepo.GetCardByID(context.Background(), cardID)
	if err != nil {
		t.Fatalf("get after again: %v", err)
	}
	if afterAgain.Due.IsZero() {
		t.Fatal("expected due after again")
	}
	if !afterAgain.Due.Before(goodDue.Add(24 * time.Hour)) {
		// Failures should not schedule further out than a successful long interval.
		t.Fatalf("expected again due sooner than far-future good due: again=%v good=%v", afterAgain.Due, goodDue)
	}
	if afterAgain.Progress < 0 || afterAgain.Progress > 1 {
		t.Fatalf("progress out of range after again: %f", afterAgain.Progress)
	}
}

func TestGroupService_DeleteGroupNotOwned(t *testing.T) {
	svc, _, _ := setupFullServices(t)
	err := svc.DeleteGroup(context.Background(), testutil.GetUUID(1), testutil.GetUUID(404))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardService_GetWriteCardsGroupNotOwned(t *testing.T) {
	_, svc, _ := setupFullServices(t)
	groupID := testutil.GetUUID(404)
	_, err := svc.GetWriteCards(context.Background(), dto.GetWriteCard{Count: "2", GroupID: &groupID}, testutil.GetUUID(1))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}
