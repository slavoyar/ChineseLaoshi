package auth_test

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/auth"
)

func signInitData(botToken string, fields map[string]string) string {
	pairs := make([]string, 0, len(fields))
	for key, value := range fields {
		pairs = append(pairs, key+"="+value)
	}
	sort.Strings(pairs)
	dataCheckString := strings.Join(pairs, "\n")

	secretKey := hmac.New(sha256.New, []byte("WebAppData"))
	secretKey.Write([]byte(botToken))
	secret := secretKey.Sum(nil)

	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(dataCheckString))
	fields["hash"] = hex.EncodeToString(mac.Sum(nil))

	values := url.Values{}
	for key, value := range fields {
		values.Set(key, value)
	}
	return values.Encode()
}

func TestTelegramInitDataVerifier_VerifyInitData(t *testing.T) {
	botToken := "123456:ABC-DEF"
	userJSON, _ := json.Marshal(map[string]any{
		"id":         42,
		"first_name": "Test",
		"username":   "tester",
	})
	initData := signInitData(botToken, map[string]string{
		"auth_date": strconv.FormatInt(time.Now().Unix(), 10),
		"user":      string(userJSON),
	})

	verifier := auth.NewTelegramInitDataVerifier(botToken)
	identity, err := verifier.VerifyInitData(initData)
	if err != nil {
		t.Fatalf("verify: %v", err)
	}
	if identity.Subject != "42" || identity.Name != "Test" {
		t.Fatalf("unexpected identity: %+v", identity)
	}
}

func TestTelegramInitDataVerifier_InvalidHash(t *testing.T) {
	verifier := auth.NewTelegramInitDataVerifier("token")
	_, err := verifier.VerifyInitData("auth_date=1&user=%7B%7D&hash=deadbeef")
	ae, ok := apperrors.IsAppError(err)
	if !ok || ae.Code != apperrors.UnauthorizedError {
		t.Fatalf("expected unauthorized, got %v", err)
	}
}
