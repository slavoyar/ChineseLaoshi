package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestPinyin_RequiresAuth(t *testing.T) {
	app := testutil.SetupStrictAuthApp(t)
	body, _ := json.Marshal(dto.PinyinRequest{Text: "你好"})
	req, _ := http.NewRequest(http.MethodPost, app.Server.URL+"/api/pinyin", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://localhost:5173")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", res.StatusCode)
	}
}

func TestPinyin_Convert(t *testing.T) {
	app := testutil.SetupTestApp(t)
	body, _ := json.Marshal(dto.PinyinRequest{Text: "银行"})
	req := app.AuthenticatedRequest(t, http.MethodPost, app.Server.URL+"/api/pinyin", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var payload dto.PinyinResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if len(payload.Characters) != 2 {
		t.Fatalf("expected 2 characters, got %d", len(payload.Characters))
	}
	if payload.Transcription == "" {
		t.Fatal("expected transcription")
	}
}

func TestPinyin_MissingText(t *testing.T) {
	app := testutil.SetupTestApp(t)
	body, _ := json.Marshal(dto.PinyinRequest{Text: ""})
	req := app.AuthenticatedRequest(t, http.MethodPost, app.Server.URL+"/api/pinyin", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", res.StatusCode)
	}
}
