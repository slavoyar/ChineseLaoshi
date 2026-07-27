package repository_test

import (
	"context"
	"os"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestMain(m *testing.M) {
	app := testutil.MustInit()
	code := m.Run()
	app.Cleanup()
	os.Exit(code)
}

func setupRepos(t *testing.T) (*repository.UserRepository, *repository.GroupRepository, *repository.CardRepository, *repository.WordRepository, *repository.CloneRepository, *pgxpool.Pool, string) {
	t.Helper()
	app := testutil.SetupTestApp(t)
	userID := testutil.GetUUID(1)
	return repository.NewUserRepository(app.Pool()),
		repository.NewGroupRepository(app.Pool()),
		repository.NewCardRepository(app.Pool()),
		repository.NewWordRepository(app.Pool()),
		repository.NewCloneRepository(app.Pool()),
		app.Pool(),
		userID
}

func TestUserRepository_GetByEmail(t *testing.T) {
	users, _, _, _, _, _, _ := setupRepos(t)
	user, err := users.GetByEmail(context.Background(), testutil.DefaultTestEmail)
	if err != nil {
		t.Fatalf("get by email: %v", err)
	}
	if user.Email != testutil.DefaultTestEmail {
		t.Fatalf("unexpected email: %s", user.Email)
	}
}

func TestUserRepository_GetByProviderSubject(t *testing.T) {
	users, _, _, _, _, _, _ := setupRepos(t)
	user, err := users.GetByProviderSubject(context.Background(), "google", "test-subject-1")
	if err != nil {
		t.Fatalf("get by provider: %v", err)
	}
	if user.Email != testutil.DefaultTestEmail {
		t.Fatalf("unexpected user: %+v", user)
	}
}

func TestUserRepository_GetByIDNotFound(t *testing.T) {
	users, _, _, _, _, _, _ := setupRepos(t)
	_, err := users.GetByID(context.Background(), testutil.GetUUID(404))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestUserRepository_CreateSSOUser(t *testing.T) {
	users, _, _, _, _, _, _ := setupRepos(t)
	user, err := users.CreateSSOUser(context.Background(), "NewUser", "sso-new@example.com", "google", "sso-subject-new", "http://pic")
	if err != nil {
		t.Fatalf("create sso user: %v", err)
	}
	if user.Email != "sso-new@example.com" {
		t.Fatalf("unexpected user: %+v", user)
	}
}

func TestGroupRepository_CRUD(t *testing.T) {
	_, groups, _, _, _, _, userID := setupRepos(t)
	ctx := context.Background()

	created, err := groups.CreateGroup(ctx, dto.CreateGroup{Name: "Repo Group"}, userID)
	if err != nil {
		t.Fatalf("create: %v", err)
	}

	list, err := groups.GetGroupsByUserID(ctx, userID)
	if err != nil || len(list) < 4 {
		t.Fatalf("list groups: %v len=%d", err, len(list))
	}

	updated, err := groups.UpdateGroup(ctx, dto.UpdateGroup{ID: created.ID, Name: "Renamed"}, userID)
	if err != nil || updated.Name != "Renamed" {
		t.Fatalf("update: %v %+v", err, updated)
	}

	if err := groups.AssertOwnedByUser(ctx, created.ID, userID); err != nil {
		t.Fatalf("assert owned: %v", err)
	}

	if err := groups.AssertOwnedByUser(ctx, created.ID, testutil.GetUUID(404)); err == nil {
		t.Fatal("expected not owned error")
	}
}

func TestCardRepository_GetCardsByGroupID(t *testing.T) {
	_, _, cards, _, _, _, userID := setupRepos(t)
	list, err := cards.GetCardsByGroupID(context.Background(), testutil.GetUUID(1), userID)
	if err != nil {
		t.Fatalf("get cards: %v", err)
	}
	if len(list) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(list))
	}
}

func TestCardRepository_GetWriteCards(t *testing.T) {
	_, _, cards, _, _, _, userID := setupRepos(t)
	list, err := cards.GetWriteCards(context.Background(), 2, userID, nil)
	if err != nil {
		t.Fatalf("get write cards: %v", err)
	}
	if len(list) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(list))
	}
}

func TestCardRepository_AssertOwnedByUser(t *testing.T) {
	_, _, cards, _, _, _, userID := setupRepos(t)
	if err := cards.AssertOwnedByUser(context.Background(), testutil.GetUUID(1), userID); err != nil {
		t.Fatalf("assert owned: %v", err)
	}
	if err := cards.AssertOwnedByUser(context.Background(), testutil.GetUUID(404), userID); err == nil {
		t.Fatal("expected not found")
	}
}

func TestWordRepository_SearchWord(t *testing.T) {
	_, _, _, words, _, _, _ := setupRepos(t)
	results, err := words.SearchWord(context.Background(), "собака")
	if err != nil {
		t.Fatalf("search: %v", err)
	}
	if len(results) == 0 {
		t.Fatal("expected matches")
	}
}

func TestWordRepository_SearchWordEmpty(t *testing.T) {
	_, _, _, words, _, _, _ := setupRepos(t)
	results, err := words.SearchWord(context.Background(), "")
	if err != nil {
		t.Fatalf("search: %v", err)
	}
	if len(results) != 0 {
		t.Fatalf("expected empty, got %d", len(results))
	}
}

func TestWordRepository_GetWordsInOtherGroups(t *testing.T) {
	_, _, _, words, _, _, _ := setupRepos(t)
	result, err := words.GetWordsInOtherGroups(context.Background(), testutil.GetUUID(1), []string{testutil.GetUUID(1)})
	if err != nil {
		t.Fatalf("get words in other groups: %v", err)
	}
	if len(result) != 0 {
		t.Fatalf("expected no words in other groups, got %d", len(result))
	}
}

func TestCloneRepository_CountGroupsAndClone(t *testing.T) {
	users, _, _, _, cloner, _, _ := setupRepos(t)
	ctx := context.Background()

	sourceUserID := testutil.GetUUID(1)

	newUser, err := users.CreateSSOUser(ctx, "CloneTarget", "clone-target@example.com", "google", "clone-target-sub", "")
	if err != nil {
		t.Fatalf("create target user: %v", err)
	}

	count, err := cloner.CountGroups(ctx, newUser.ID)
	if err != nil || count != 0 {
		t.Fatalf("count groups: %v count=%d", err, count)
	}

	if err := cloner.CloneUserContent(ctx, sourceUserID, newUser.ID); err != nil {
		t.Fatalf("clone: %v", err)
	}

	count, err = cloner.CountGroups(ctx, newUser.ID)
	if err != nil || count == 0 {
		t.Fatalf("expected cloned groups, count=%d err=%v", count, err)
	}
}

func TestGroupRepository_DeleteGroup(t *testing.T) {
	_, groups, _, _, _, _, userID := setupRepos(t)
	ctx := context.Background()
	created, err := groups.CreateGroup(ctx, dto.CreateGroup{Name: "Delete Me"}, userID)
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if err := groups.DeleteGroup(ctx, created.ID, userID); err != nil {
		t.Fatalf("delete: %v", err)
	}
}

func TestGroupRepository_IncrementDecrementWordCount(t *testing.T) {
	_, groups, _, _, _, pool, userID := setupRepos(t)
	ctx := context.Background()
	groupID := testutil.GetUUID(3)

	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)

	if err := groups.IncrementWordCount(ctx, tx, groupID); err != nil {
		t.Fatalf("increment: %v", err)
	}
	if err := groups.DecrementWordCount(ctx, tx, groupID); err != nil {
		t.Fatalf("decrement: %v", err)
	}
	_ = userID
}

func TestCardRepository_CreateUpdateDelete(t *testing.T) {
	_, groups, cards, words, _, pool, userID := setupRepos(t)
	ctx := context.Background()
	groupID := testutil.GetUUID(3)

	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)

	word, err := words.CreateWord(ctx, tx, dto.CreateWord{
		Symbols: "六", Transcription: "liu", Translation: "six",
	})
	if err != nil {
		t.Fatalf("create word: %v", err)
	}

	card, err := cards.CreateCard(ctx, tx, groupID, word.ID)
	if err != nil {
		t.Fatalf("create card: %v", err)
	}

	if err := groups.IncrementWordCount(ctx, tx, groupID); err != nil {
		t.Fatalf("increment word count: %v", err)
	}
	if err := tx.Commit(ctx); err != nil {
		t.Fatalf("commit: %v", err)
	}

	row, err := cards.GetCardByID(ctx, card.ID)
	if err != nil {
		t.Fatalf("get card: %v", err)
	}
	if row.WordID != word.ID {
		t.Fatalf("unexpected word id: %s", row.WordID)
	}

	count, err := cards.GetCardsCount(ctx, word.ID)
	if err != nil || count != 1 {
		t.Fatalf("cards count: %v %d", err, count)
	}

	progress := 0.5
	updated, err := cards.UpdateCard(ctx, nil, repository.UpdateCardInput{
		ID: card.ID, Progress: &progress,
	})
	if err != nil || updated.Progress != 0.5 {
		t.Fatalf("update card: %v %+v", err, updated)
	}

	tx, err = pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)
	if err := cards.DeleteCard(ctx, tx, card.ID); err != nil {
		t.Fatalf("delete card: %v", err)
	}
	if err := words.DeleteWord(ctx, tx, word.ID); err != nil {
		t.Fatalf("delete word: %v", err)
	}
	if err := tx.Commit(ctx); err != nil {
		t.Fatalf("commit delete: %v", err)
	}
	_ = userID
}

func TestWordRepository_UpdateAndDeleteWords(t *testing.T) {
	_, _, _, words, _, pool, _ := setupRepos(t)
	ctx := context.Background()

	updated, err := words.UpdateWord(ctx, dto.Word{
		ID: testutil.GetUUID(1), Symbols: "一", Transcription: "yi", Translation: "one",
	})
	if err != nil || updated.Translation != "one" {
		t.Fatalf("update word: %v %+v", err, updated)
	}

	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)

	tempWord, err := words.CreateWord(ctx, tx, dto.CreateWord{
		Symbols: "七", Transcription: "qi", Translation: "seven",
	})
	if err != nil {
		t.Fatalf("create temp word: %v", err)
	}
	if err := tx.Commit(ctx); err != nil {
		t.Fatalf("commit: %v", err)
	}

	if err := words.DeleteWords(ctx, []string{tempWord.ID}); err != nil {
		t.Fatalf("delete words: %v", err)
	}
}

func TestCardRepository_DeleteCardByGroupID(t *testing.T) {
	_, groups, cards, _, _, _, userID := setupRepos(t)
	ctx := context.Background()

	created, err := groups.CreateGroup(ctx, dto.CreateGroup{Name: "Temp"}, userID)
	if err != nil {
		t.Fatalf("create group: %v", err)
	}
	if err := cards.DeleteCardByGroupID(ctx, created.ID); err != nil {
		t.Fatalf("delete cards by group: %v", err)
	}
	if err := groups.DeleteGroup(ctx, created.ID, userID); err != nil {
		t.Fatalf("delete group: %v", err)
	}
}

func TestCardRepository_GetCardByIDNotFound(t *testing.T) {
	_, _, cards, _, _, _, _ := setupRepos(t)
	_, err := cards.GetCardByID(context.Background(), testutil.GetUUID(404))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestCardRepository_DeleteCardNotFound(t *testing.T) {
	_, _, cards, _, _, pool, _ := setupRepos(t)
	ctx := context.Background()
	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)
	if err := cards.DeleteCard(ctx, tx, testutil.GetUUID(404)); err == nil {
		t.Fatal("expected error deleting missing card")
	}
}

func TestGroupRepository_UpdateGroupNotFound(t *testing.T) {
	_, groups, _, _, _, _, userID := setupRepos(t)
	_, err := groups.UpdateGroup(context.Background(), dto.UpdateGroup{
		ID: testutil.GetUUID(404), Name: "missing",
	}, userID)
	if err == nil {
		t.Fatal("expected error updating missing group")
	}
}

func TestUserRepository_GetByEmailNotFound(t *testing.T) {
	users, _, _, _, _, _, _ := setupRepos(t)
	_, err := users.GetByEmail(context.Background(), "missing@example.com")
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func TestUserRepository_DuplicateUsername(t *testing.T) {
	users, _, _, _, _, _, _ := setupRepos(t)
	ctx := context.Background()
	first, err := users.CreateSSOUser(ctx, "SameName", "first@example.com", "google", "dup-sub-1", "")
	if err != nil {
		t.Fatalf("create first: %v", err)
	}
	second, err := users.CreateSSOUser(ctx, "SameName", "second@example.com", "google", "dup-sub-2", "")
	if err != nil {
		t.Fatalf("create second: %v", err)
	}
	if first.Username == second.Username {
		t.Fatalf("expected unique usernames, both %s", first.Username)
	}
}

func TestCardRepository_GetWriteCardsWithGroup(t *testing.T) {
	_, _, cards, _, _, _, userID := setupRepos(t)
	groupID := testutil.GetUUID(1)
	list, err := cards.GetWriteCards(context.Background(), 5, userID, &groupID)
	if err != nil {
		t.Fatalf("get write cards: %v", err)
	}
	if len(list) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(list))
	}
}

func TestWordRepository_GetWordsInOtherGroupsWithSharedWord(t *testing.T) {
	_, _, cards, words, _, pool, userID := setupRepos(t)
	ctx := context.Background()
	wordID := testutil.GetUUID(1)

	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	_, err = tx.Exec(ctx, `
		INSERT INTO "Card" (id, "groupId", "wordId", "updatedAt")
		VALUES ($1, $2, $3, NOW())
	`, testutil.GetUUID(97), testutil.GetUUID(2), wordID)
	if err != nil {
		t.Fatalf("insert shared card: %v", err)
	}
	if err := tx.Commit(ctx); err != nil {
		t.Fatalf("commit: %v", err)
	}

	shared, err := words.GetWordsInOtherGroups(ctx, testutil.GetUUID(2), []string{wordID})
	if err != nil {
		t.Fatalf("shared words: %v", err)
	}
	if len(shared) == 0 {
		t.Fatal("expected word shared with another group")
	}
	_ = cards
	_ = userID
}

func TestGroupRepository_DeleteGroupNotFound(t *testing.T) {
	_, groups, _, _, _, _, userID := setupRepos(t)
	err := groups.DeleteGroup(context.Background(), testutil.GetUUID(404), userID)
	if err == nil {
		t.Fatal("expected error deleting missing group")
	}
}

func TestCardRepository_UpdateCardWithTx(t *testing.T) {
	_, _, cards, _, _, pool, _ := setupRepos(t)
	ctx := context.Background()
	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)

	showCount := 5
	updated, err := cards.UpdateCard(ctx, tx, repository.UpdateCardInput{
		ID: testutil.GetUUID(1), ShowCount: &showCount,
	})
	if err != nil || updated.ShowCount != 5 {
		t.Fatalf("update with tx: %v %+v", err, updated)
	}
}
