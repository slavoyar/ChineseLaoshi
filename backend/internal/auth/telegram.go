package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
)

const telegramProvider = "telegram"

func TelegramProvider() string {
	return telegramProvider
}

type TelegramIdentity struct {
	Subject  string
	Name     string
	Username string
	PhotoURL string
}

type TelegramInitDataVerifier interface {
	VerifyInitData(initData string) (TelegramIdentity, error)
}

type telegramInitDataVerifier struct {
	botToken string
	maxAge   time.Duration
}

func NewTelegramInitDataVerifier(botToken string) TelegramInitDataVerifier {
	return &telegramInitDataVerifier{
		botToken: botToken,
		maxAge:   24 * time.Hour,
	}
}

type telegramUserPayload struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	PhotoURL  string `json:"photo_url"`
}

func (v *telegramInitDataVerifier) VerifyInitData(initData string) (TelegramIdentity, error) {
	if v.botToken == "" {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}
	if strings.TrimSpace(initData) == "" {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	values, err := url.ParseQuery(initData)
	if err != nil {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	receivedHash := values.Get("hash")
	if receivedHash == "" {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	pairs := make([]string, 0, len(values))
	for key, vals := range values {
		if key == "hash" || len(vals) == 0 {
			continue
		}
		pairs = append(pairs, key+"="+vals[0])
	}
	sort.Strings(pairs)
	dataCheckString := strings.Join(pairs, "\n")

	secretKey := hmacSHA256([]byte("WebAppData"), []byte(v.botToken))
	expected := hmacSHA256(secretKey, []byte(dataCheckString))
	if !hmac.Equal([]byte(receivedHash), []byte(hex.EncodeToString(expected))) {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	authDateRaw := values.Get("auth_date")
	if authDateRaw == "" {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}
	authUnix, err := strconv.ParseInt(authDateRaw, 10, 64)
	if err != nil {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}
	authTime := time.Unix(authUnix, 0)
	if time.Since(authTime) > v.maxAge {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	userRaw := values.Get("user")
	if userRaw == "" {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	var payload telegramUserPayload
	if err := json.Unmarshal([]byte(userRaw), &payload); err != nil || payload.ID == 0 {
		return TelegramIdentity{}, apperrors.New(apperrors.UnauthorizedError)
	}

	name := strings.TrimSpace(strings.TrimSpace(payload.FirstName + " " + payload.LastName))
	if name == "" && payload.Username != "" {
		name = payload.Username
	}
	if name == "" {
		name = fmt.Sprintf("tg-%d", payload.ID)
	}

	return TelegramIdentity{
		Subject:  strconv.FormatInt(payload.ID, 10),
		Name:     name,
		Username: payload.Username,
		PhotoURL: payload.PhotoURL,
	}, nil
}

func hmacSHA256(key, data []byte) []byte {
	mac := hmac.New(sha256.New, key)
	_, _ = mac.Write(data)
	return mac.Sum(nil)
}
