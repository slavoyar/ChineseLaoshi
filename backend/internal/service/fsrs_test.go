package service_test

import (
	"context"
	"testing"
	"time"

	fsrs "github.com/open-spaced-repetition/go-fsrs/v3"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func setupCardServices(t *testing.T) (*service.GroupService, *service.CardService, *repository.CardRepository, string) {
	t.Helper()
	app := testutil.SetupTestApp(t)
	groupRepo := repository.NewGroupRepository(app.Pool())
	cardRepo := repository.NewCardRepository(app.Pool())
	wordRepo := repository.NewWordRepository(app.Pool())
	userID := testutil.GetUUID(1)
	groupSvc := service.NewGroupService(app.Pool(), cardRepo, groupRepo, wordRepo)
	cardSvc := service.NewCardService(app.Pool(), cardRepo, groupRepo, wordRepo)
	return groupSvc, cardSvc, cardRepo, userID
}

func TestCardService_CreateCardStartsAsNewWithZeroProgress(t *testing.T) {
	_, svc, cardRepo, userID := setupCardServices(t)

	symbols, transcription, translation := "十", "shi", "ten"
	card, err := svc.CreateCard(context.Background(), dto.CreateCard{
		GroupID: testutil.GetUUID(3),
		Word: dto.CreateCardWord{
			Symbols: &symbols, Transcription: &transcription, Translation: &translation,
		},
	}, userID)
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if card.Progress != 0 {
		t.Fatalf("expected progress 0 for new card, got %f", card.Progress)
	}

	row, err := cardRepo.GetCardByID(context.Background(), card.ID)
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	if row.State != int(fsrs.New) {
		t.Fatalf("expected New state, got %d", row.State)
	}
	if row.Stability != 0 || row.Difficulty != 0 || row.Reps != 0 {
		t.Fatalf("expected zeroed FSRS fields, got %+v", row)
	}
	if row.LastReview != nil {
		t.Fatal("expected nil lastReview for new card")
	}
}

func TestCardService_ListProgressIsZeroForNewCards(t *testing.T) {
	_, svc, _, userID := setupCardServices(t)
	cards, err := svc.GetCardsByGroupID(context.Background(), testutil.GetUUID(1), userID)
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if len(cards) == 0 {
		t.Fatal("expected seeded cards")
	}
	for _, c := range cards {
		if c.Progress != 0 {
			t.Fatalf("seeded new card %s: expected progress 0, got %f", c.ID, c.Progress)
		}
	}
}

func TestCardService_ProgressRecomputedOnRead(t *testing.T) {
	_, svc, cardRepo, userID := setupCardServices(t)
	cardID := testutil.GetUUID(1)

	lastReview := time.Now().UTC().Add(-10 * 24 * time.Hour)
	stability := 5.0
	difficulty := 5.0
	state := int(fsrs.Review)
	staleProgress := 0.99
	reps := 3

	_, err := cardRepo.UpdateCard(context.Background(), nil, repository.UpdateCardInput{
		ID:         cardID,
		Progress:   &staleProgress,
		Stability:  &stability,
		Difficulty: &difficulty,
		State:      &state,
		Reps:       &reps,
		LastReview: &lastReview,
		Due:        ptrTime(time.Now().UTC().Add(24 * time.Hour)),
	})
	if err != nil {
		t.Fatalf("seed fsrs state: %v", err)
	}

	cards, err := svc.GetCardsByGroupID(context.Background(), testutil.GetUUID(1), userID)
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	var found *dto.Card
	for i := range cards {
		if cards[i].ID == cardID {
			found = &cards[i]
			break
		}
	}
	if found == nil {
		t.Fatal("card not in list")
	}
	if found.Progress >= staleProgress {
		t.Fatalf("expected decayed retrievability < stored %f, got %f", staleProgress, found.Progress)
	}
	if found.Progress <= 0 || found.Progress > 1 {
		t.Fatalf("progress out of range: %f", found.Progress)
	}
}

func TestCardService_GetWriteCardsDueFirstThenNew(t *testing.T) {
	groupSvc, svc, cardRepo, userID := setupCardServices(t)
	ctx := context.Background()

	created, err := groupSvc.CreateGroup(ctx, dto.CreateGroup{Name: "FSRS Queue"}, userID)
	if err != nil {
		t.Fatalf("create group: %v", err)
	}

	makeWordCard := func(symbols, transcription, translation string) string {
		t.Helper()
		s, tr, tl := symbols, transcription, translation
		card, err := svc.CreateCard(ctx, dto.CreateCard{
			GroupID: created.ID,
			Word:    dto.CreateCardWord{Symbols: &s, Transcription: &tr, Translation: &tl},
		}, userID)
		if err != nil {
			t.Fatalf("create card %s: %v", symbols, err)
		}
		return card.ID
	}

	dueID := makeWordCard("甲", "jia", "due")
	newID := makeWordCard("乙", "yi", "new")
	futureID := makeWordCard("丙", "bing", "future")

	past := time.Now().UTC().Add(-2 * time.Hour)
	futureNear := time.Now().UTC().Add(2 * time.Hour)
	futureFar := time.Now().UTC().Add(7 * 24 * time.Hour)
	reviewState := int(fsrs.Review)
	newState := int(fsrs.New)
	stability := 5.0

	if _, err := cardRepo.UpdateCard(ctx, nil, repository.UpdateCardInput{
		ID: dueID, Due: &past, State: &reviewState, Stability: &stability,
		LastReview: ptrTime(time.Now().UTC().Add(-3 * 24 * time.Hour)),
	}); err != nil {
		t.Fatalf("update due card: %v", err)
	}
	if _, err := cardRepo.UpdateCard(ctx, nil, repository.UpdateCardInput{
		ID: newID, Due: &futureNear, State: &newState,
	}); err != nil {
		t.Fatalf("update new card: %v", err)
	}
	if _, err := cardRepo.UpdateCard(ctx, nil, repository.UpdateCardInput{
		ID: futureID, Due: &futureFar, State: &reviewState, Stability: &stability,
		LastReview: ptrTime(time.Now().UTC().Add(-1 * 24 * time.Hour)),
	}); err != nil {
		t.Fatalf("update future card: %v", err)
	}

	list, err := svc.GetWriteCards(ctx, dto.GetWriteCard{Count: "3", GroupID: &created.ID}, userID)
	if err != nil {
		t.Fatalf("write cards: %v", err)
	}
	if len(list) != 3 {
		t.Fatalf("expected 3 cards, got %d", len(list))
	}
	if list[0].ID != dueID {
		t.Fatalf("expected due card first, got %s", list[0].ID)
	}
	if list[1].ID != newID {
		t.Fatalf("expected new card second, got %s", list[1].ID)
	}
	if list[2].ID != futureID {
		t.Fatalf("expected future review card last, got %s", list[2].ID)
	}
}

func TestCardService_GoodThenAgainUpdatesFSRSState(t *testing.T) {
	_, svc, cardRepo, userID := setupCardServices(t)
	cardID := testutil.GetUUID(1)
	ctx := context.Background()

	if err := svc.UpdateCardStats(ctx, dto.UpdateCardStats{ID: cardID, Guessed: true}, userID); err != nil {
		t.Fatalf("good: %v", err)
	}
	afterGood, err := cardRepo.GetCardByID(ctx, cardID)
	if err != nil {
		t.Fatalf("get after good: %v", err)
	}
	if afterGood.State == int(fsrs.New) {
		t.Fatal("expected card to leave New after Good")
	}
	if afterGood.Reps < 1 {
		t.Fatalf("expected reps >= 1, got %d", afterGood.Reps)
	}
	if afterGood.ShowCount != 1 {
		t.Fatalf("expected showCount 1, got %d", afterGood.ShowCount)
	}
	if afterGood.LastReview == nil {
		t.Fatal("expected lastReview after Good")
	}
	if afterGood.Stability <= 0 {
		t.Fatalf("expected stability > 0, got %f", afterGood.Stability)
	}
	goodDue := afterGood.Due

	if err := svc.UpdateCardStats(ctx, dto.UpdateCardStats{ID: cardID, Guessed: false}, userID); err != nil {
		t.Fatalf("again: %v", err)
	}
	afterAgain, err := cardRepo.GetCardByID(ctx, cardID)
	if err != nil {
		t.Fatalf("get after again: %v", err)
	}
	if afterAgain.ShowCount != 2 {
		t.Fatalf("expected showCount 2, got %d", afterAgain.ShowCount)
	}
	// Learning-step Again may land at a similar short horizon; it must not push due later.
	if afterAgain.Due.After(goodDue) {
		t.Fatalf("Again should not schedule later than prior Good due: again=%v good=%v", afterAgain.Due, goodDue)
	}
	if afterAgain.Progress < 0 || afterAgain.Progress > 1 {
		t.Fatalf("progress out of range: %f", afterAgain.Progress)
	}
	if afterAgain.State == int(fsrs.Learning) || afterAgain.State == int(fsrs.Relearning) {
		if afterAgain.Progress > 0.45 {
			t.Fatalf("expected capped progress after Again while learning, got %f", afterAgain.Progress)
		}
	}
}

func TestCardService_SeedCardsMatchSoftResetDefaults(t *testing.T) {
	_, _, cardRepo, _ := setupCardServices(t)
	row, err := cardRepo.GetCardByID(context.Background(), testutil.GetUUID(1))
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	if row.State != int(fsrs.New) || row.Progress != 0 || row.Stability != 0 || row.Reps != 0 {
		t.Fatalf("expected soft-reset New defaults, got %+v", row)
	}
	if row.LastReview != nil {
		t.Fatal("expected nil lastReview")
	}
}

func TestCardService_AgainDoesNotShowFullMastery(t *testing.T) {
	_, svc, cardRepo, userID := setupCardServices(t)
	cardID := testutil.GetUUID(1)
	ctx := context.Background()

	if err := svc.UpdateCardStats(ctx, dto.UpdateCardStats{ID: cardID, Guessed: false}, userID); err != nil {
		t.Fatalf("again on new: %v", err)
	}
	row, err := cardRepo.GetCardByID(ctx, cardID)
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	cards, err := svc.GetCardsByGroupID(ctx, testutil.GetUUID(1), userID)
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	var found *dto.Card
	for i := range cards {
		if cards[i].ID == cardID {
			found = &cards[i]
			break
		}
	}
	if found == nil {
		t.Fatal("card missing from list")
	}
	if found.Progress > 0.45 {
		t.Fatalf("failed card should not show high mastery, got %f (row state=%d)", found.Progress, row.State)
	}
}

func ptrTime(t time.Time) *time.Time {
	return &t
}

