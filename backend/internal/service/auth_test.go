package service_test

import (
	"context"
	"os"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
	"github.com/slavo/ChineseLaoshi/backend/internal/config"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/service"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestMain(m *testing.M) {
	app := testutil.MustInit()
	code := m.Run()
	app.Cleanup()
	os.Exit(code)
}

type fakeGoogleVerifier struct {
	identity auth.GoogleIdentity
	err      error
}

func (f fakeGoogleVerifier) VerifyIDToken(ctx context.Context, rawToken string) (auth.GoogleIdentity, error) {
	if f.err != nil {
		return auth.GoogleIdentity{}, f.err
	}
	return f.identity, nil
}

type fakeTelegramVerifier struct {
	identity auth.TelegramIdentity
	err      error
}

func (f fakeTelegramVerifier) VerifyInitData(initData string) (auth.TelegramIdentity, error) {
	if f.err != nil {
		return auth.TelegramIdentity{}, f.err
	}
	return f.identity, nil
}

func newAuthService(t *testing.T, google auth.GoogleTokenVerifier) *service.AuthService {
	t.Helper()
	return newAuthServiceWithVerifiers(t, google, nil)
}

func newAuthServiceWithVerifiers(
	t *testing.T,
	google auth.GoogleTokenVerifier,
	telegram auth.TelegramInitDataVerifier,
) *service.AuthService {
	t.Helper()
	app := testutil.SetupTestApp(t)
	userRepo := repository.NewUserRepository(app.Pool())
	cloneRepo := repository.NewCloneRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", config.DefaultSessionTTL)
	return service.NewAuthService(userRepo, cloneRepo, google, telegram, tokenService, config.DefaultTemplateEmail)
}

func TestAuthService_LoginWithGoogleInvalidToken(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{err: context.Canceled})
	_, _, err := svc.LoginWithGoogle(context.Background(), "bad", "")
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.UnauthorizedError {
		t.Fatalf("expected unauthorized, got %v", err)
	}
}

func TestAuthService_LoginWithGoogleUnverifiedEmail(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "sub-1", Email: "new@example.com", EmailVerified: false,
	}})
	_, _, err := svc.LoginWithGoogle(context.Background(), "token", "")
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.ForbiddenError {
		t.Fatalf("expected forbidden, got %v", err)
	}
}

func TestAuthService_LoginWithGoogleNewUser(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "new-google-subject", Email: "brandnew@example.com", EmailVerified: true, Name: "Brand New",
	}})
	user, token, err := svc.LoginWithGoogle(context.Background(), "token", "")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	if user.Email != "brandnew@example.com" || token == "" {
		t.Fatalf("unexpected login result: %+v token=%q", user, token)
	}
}

func TestAuthService_LoginWithGoogleExistingUser(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "test-subject-1", Email: testutil.DefaultTestEmail, EmailVerified: true, Name: "slavoyar",
	}})
	user, token, err := svc.LoginWithGoogle(context.Background(), "token", "")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	if user.Email != testutil.DefaultTestEmail || token == "" {
		t.Fatalf("unexpected login result: %+v", user)
	}
}

func TestAuthService_LoginWithGoogleEmptyNameUsesEmailPrefix(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "empty-name-subject", Email: "prefix@example.com", EmailVerified: true, Name: "  ",
	}})
	user, _, err := svc.LoginWithGoogle(context.Background(), "token", "")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	if user.Name != "prefix" {
		t.Fatalf("expected name prefix, got %s", user.Name)
	}
}

func TestAuthService_LoginWithTelegramNilVerifier(t *testing.T) {
	svc := newAuthService(t, nil)
	_, _, err := svc.LoginWithTelegram(context.Background(), "init-data", "")
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.UnauthorizedError {
		t.Fatalf("expected unauthorized, got %v", err)
	}
}

func TestAuthService_LoginWithTelegramInvalidInitData(t *testing.T) {
	svc := newAuthServiceWithVerifiers(t, nil, fakeTelegramVerifier{err: apperrors.New(apperrors.UnauthorizedError)})
	_, _, err := svc.LoginWithTelegram(context.Background(), "bad", "")
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.UnauthorizedError {
		t.Fatalf("expected unauthorized, got %v", err)
	}
}

func TestAuthService_LoginWithTelegramNewUser(t *testing.T) {
	svc := newAuthServiceWithVerifiers(t, nil, fakeTelegramVerifier{identity: auth.TelegramIdentity{
		Subject: "999001", Name: "Telegram User", PhotoURL: "https://example.com/avatar.jpg",
	}})
	user, token, err := svc.LoginWithTelegram(context.Background(), "init-data", "")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	if user.Name != "Telegram User" || user.Provider != auth.TelegramProvider() || token == "" {
		t.Fatalf("unexpected login result: %+v token=%q", user, token)
	}
	if user.Email != "999001@telegram.invalid" {
		t.Fatalf("expected telegram placeholder email, got %s", user.Email)
	}
}

func TestAuthService_LoginWithTelegramExistingUser(t *testing.T) {
	svc := newAuthServiceWithVerifiers(t, nil, fakeTelegramVerifier{identity: auth.TelegramIdentity{
		Subject: "999002", Name: "Returning Telegram User",
	}})
	ctx := context.Background()
	first, firstToken, err := svc.LoginWithTelegram(ctx, "init-data", "")
	if err != nil {
		t.Fatalf("first login: %v", err)
	}

	second, secondToken, err := svc.LoginWithTelegram(ctx, "init-data", "")
	if err != nil {
		t.Fatalf("second login: %v", err)
	}
	if second.ID != first.ID || secondToken == "" || firstToken == "" {
		t.Fatalf("unexpected repeat login: first=%+v second=%+v", first, second)
	}
}

func TestAuthService_LoginWithTelegramEnsuresStarterContent(t *testing.T) {
	app := testutil.SetupTestApp(t)
	users := repository.NewUserRepository(app.Pool())
	cloneRepo := repository.NewCloneRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", config.DefaultSessionTTL)
	telegram := fakeTelegramVerifier{identity: auth.TelegramIdentity{
		Subject: "999003", Name: "No Starter Telegram",
	}}
	svc := service.NewAuthService(users, cloneRepo, nil, telegram, tokenService, config.DefaultTemplateEmail)

	ctx := context.Background()
	user, err := users.CreateSSOUser(ctx, "tg-nostarter", "999003@telegram.invalid", auth.TelegramProvider(), "999003", "")
	if err != nil {
		t.Fatalf("create user: %v", err)
	}
	count, err := cloneRepo.CountGroups(ctx, user.ID)
	if err != nil || count != 0 {
		t.Fatalf("expected 0 groups before login, got %d err=%v", count, err)
	}

	_, _, err = svc.LoginWithTelegram(ctx, "init-data", "")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	count, err = cloneRepo.CountGroups(ctx, user.ID)
	if err != nil || count == 0 {
		t.Fatalf("expected starter groups after login, got %d err=%v", count, err)
	}
}

func TestAuthService_LoginEnsuresStarterContent(t *testing.T) {
	app := testutil.SetupTestApp(t)
	users := repository.NewUserRepository(app.Pool())
	cloneRepo := repository.NewCloneRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", config.DefaultSessionTTL)
	google := fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "no-groups-subject", Email: "nostarter@example.com", EmailVerified: true, Name: "No Starter",
	}}
	svc := service.NewAuthService(users, cloneRepo, google, nil, tokenService, config.DefaultTemplateEmail)

	ctx := context.Background()
	user, err := users.CreateSSOUser(ctx, "nostarter", "nostarter@example.com", "google", "no-groups-subject", "")
	if err != nil {
		t.Fatalf("create user: %v", err)
	}
	count, err := cloneRepo.CountGroups(ctx, user.ID)
	if err != nil || count != 0 {
		t.Fatalf("expected 0 groups before login, got %d err=%v", count, err)
	}

	_, _, err = svc.LoginWithGoogle(ctx, "token", "")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	count, err = cloneRepo.CountGroups(ctx, user.ID)
	if err != nil || count == 0 {
		t.Fatalf("expected starter groups after login, got %d err=%v", count, err)
	}
}

func TestAuthService_LoginWithGoogleNewUserRussianLocale(t *testing.T) {
	app := testutil.SetupTestApp(t)
	users := repository.NewUserRepository(app.Pool())
	cloneRepo := repository.NewCloneRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", config.DefaultSessionTTL)
	google := fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "ru-locale-subject", Email: "ruuser@example.com", EmailVerified: true, Name: "RU User",
	}}
	svc := service.NewAuthService(users, cloneRepo, google, nil, tokenService, config.DefaultTemplateEmail)

	_, _, err := svc.LoginWithGoogle(context.Background(), "token", "ru")
	if err != nil {
		t.Fatalf("login: %v", err)
	}

	user, err := users.GetByProviderSubject(context.Background(), "google", "ru-locale-subject")
	if err != nil {
		t.Fatalf("get user: %v", err)
	}
	groups, err := repository.NewGroupRepository(app.Pool()).GetGroupsByUserID(context.Background(), user.ID)
	if err != nil {
		t.Fatalf("list groups: %v", err)
	}
	if len(groups) != 1 || groups[0].Name != "Демо" {
		t.Fatalf("expected Russian demo group, got %+v", groups)
	}
}

func TestAuthService_LoginDoesNotRecloneExistingGroups(t *testing.T) {
	app := testutil.SetupTestApp(t)
	users := repository.NewUserRepository(app.Pool())
	cloneRepo := repository.NewCloneRepository(app.Pool())
	tokenService := auth.NewTokenService("test-jwt-secret", config.DefaultSessionTTL)
	google := fakeGoogleVerifier{identity: auth.GoogleIdentity{
		Subject: "has-groups-subject", Email: "hasgroups@example.com", EmailVerified: true, Name: "Has Groups",
	}}
	svc := service.NewAuthService(users, cloneRepo, google, nil, tokenService, config.DefaultTemplateEmail)

	ctx := context.Background()
	user, err := users.CreateSSOUser(ctx, "hasgroups", "hasgroups@example.com", "google", "has-groups-subject", "")
	if err != nil {
		t.Fatalf("create user: %v", err)
	}
	groupRepo := repository.NewGroupRepository(app.Pool())
	_, err = groupRepo.CreateGroup(ctx, dto.CreateGroup{Name: "Custom"}, user.ID)
	if err != nil {
		t.Fatalf("create group: %v", err)
	}

	_, _, err = svc.LoginWithGoogle(ctx, "token", "ru")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	groups, err := groupRepo.GetGroupsByUserID(ctx, user.ID)
	if err != nil {
		t.Fatalf("list groups: %v", err)
	}
	if len(groups) != 1 || groups[0].Name != "Custom" {
		t.Fatalf("expected existing group untouched, got %+v", groups)
	}
}

func TestAuthService_Me(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{})
	userID := testutil.GetUUID(1)
	dto, err := svc.Me(context.Background(), auth.UserContext{ID: userID})
	if err != nil {
		t.Fatalf("me: %v", err)
	}
	if dto.ID != userID {
		t.Fatalf("unexpected dto: %+v", dto)
	}
}

func TestAuthService_CompleteOnboarding(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{})
	userID := testutil.GetUUID(1)

	dto, err := svc.CompleteOnboarding(context.Background(), userID)
	if err != nil {
		t.Fatalf("complete onboarding: %v", err)
	}
	if !dto.OnboardingCompleted {
		t.Fatalf("expected onboarding completed, got %+v", dto)
	}
}

func TestAuthService_CompleteOnboardingNotFound(t *testing.T) {
	svc := newAuthService(t, fakeGoogleVerifier{})
	_, err := svc.CompleteOnboarding(context.Background(), testutil.GetUUID(404))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func setupGroupService(t *testing.T) (*service.GroupService, string) {
	t.Helper()
	app := testutil.SetupTestApp(t)
	groupRepo := repository.NewGroupRepository(app.Pool())
	cardRepo := repository.NewCardRepository(app.Pool())
	wordRepo := repository.NewWordRepository(app.Pool())
	return service.NewGroupService(app.Pool(), cardRepo, groupRepo, wordRepo), testutil.GetUUID(1)
}

func TestGroupService_GetGroupsByUserID(t *testing.T) {
	svc, userID := setupGroupService(t)
	groups, err := svc.GetGroupsByUserID(context.Background(), userID)
	if err != nil {
		t.Fatalf("get groups: %v", err)
	}
	if len(groups) != 3 {
		t.Fatalf("expected 3 groups, got %d", len(groups))
	}
}

func TestGroupService_CreateGroup(t *testing.T) {
	svc, userID := setupGroupService(t)
	group, err := svc.CreateGroup(context.Background(), dto.CreateGroup{Name: "New Group"}, userID)
	if err != nil {
		t.Fatalf("create group: %v", err)
	}
	if group.Name != "New Group" {
		t.Fatalf("expected New Group, got %s", group.Name)
	}
}

func TestGroupService_UpdateGroupNotFound(t *testing.T) {
	svc, userID := setupGroupService(t)
	_, err := svc.UpdateGroup(context.Background(), dto.UpdateGroup{ID: testutil.GetUUID(404), Name: "x"}, userID)
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.EntityNotFoundError {
		t.Fatalf("expected not found, got %v", err)
	}
}

func setupCardService(t *testing.T) *service.CardService {
	t.Helper()
	app := testutil.SetupTestApp(t)
	groupRepo := repository.NewGroupRepository(app.Pool())
	cardRepo := repository.NewCardRepository(app.Pool())
	wordRepo := repository.NewWordRepository(app.Pool())
	return service.NewCardService(app.Pool(), cardRepo, groupRepo, wordRepo)
}

func TestCardService_GetWriteCardsInvalidCount(t *testing.T) {
	svc := setupCardService(t)
	_, err := svc.GetWriteCards(context.Background(), dto.GetWriteCard{Count: "abc"}, testutil.GetUUID(1))
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.ValidationError {
		t.Fatalf("expected validation error, got %v", err)
	}
}

func TestCardService_GetWriteCards(t *testing.T) {
	svc := setupCardService(t)
	cards, err := svc.GetWriteCards(context.Background(), dto.GetWriteCard{Count: "2"}, testutil.GetUUID(1))
	if err != nil {
		t.Fatalf("get write cards: %v", err)
	}
	if len(cards) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(cards))
	}
}

func TestCardService_UpdateCardStats(t *testing.T) {
	svc := setupCardService(t)
	err := svc.UpdateCardStats(context.Background(), dto.UpdateCardStats{ID: testutil.GetUUID(1), Guessed: true}, testutil.GetUUID(1))
	if err != nil {
		t.Fatalf("update stats: %v", err)
	}
}

func setupWordService(t *testing.T) *service.WordService {
	t.Helper()
	app := testutil.SetupTestApp(t)
	return service.NewWordService(repository.NewWordRepository(app.Pool()))
}

func TestWordService_Search(t *testing.T) {
	svc := setupWordService(t)
	words, err := svc.Search(context.Background(), "один")
	if err != nil {
		t.Fatalf("search: %v", err)
	}
	if len(words) == 0 {
		t.Fatal("expected at least one word")
	}
}

func TestWordService_SearchEmpty(t *testing.T) {
	svc := setupWordService(t)
	words, err := svc.Search(context.Background(), "")
	if err != nil {
		t.Fatalf("search: %v", err)
	}
	if len(words) != 0 {
		t.Fatalf("expected empty result, got %d", len(words))
	}
}
