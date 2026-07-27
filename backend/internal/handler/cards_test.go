package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestCards_GetByGroup(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Get(app.Server.URL + "/api/cards/" + testutil.GetUUID(1))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var body []map[string]any
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if len(body) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(body))
	}
}

func TestCards_CreateWithNewWord(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]any{
		"groupId": testutil.GetUUID(1),
		"word": map[string]string{
			"symbols":       "三",
			"transcription": "san",
			"translation":   "three",
		},
	}
	body, _ := json.Marshal(payload)
	res, err := http.Post(app.Server.URL+"/api/cards", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}

func TestCards_CreateWithExistingWord(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]any{
		"groupId": testutil.GetUUID(1),
		"word":    map[string]string{"id": testutil.GetUUID(1)},
	}
	body, _ := json.Marshal(payload)
	res, err := http.Post(app.Server.URL+"/api/cards", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}

func TestCards_CreateEmptyBody(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Post(app.Server.URL+"/api/cards", "application/json", bytes.NewReader([]byte("{}")))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", res.StatusCode)
	}
}

func TestCards_Update(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]any{
		"id": testutil.GetUUID(1),
		"word": map[string]string{
			"id":            testutil.GetUUID(1),
			"symbols":       "一",
			"transcription": "yi",
			"translation":   "один",
		},
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPut, app.Server.URL+"/api/cards", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}

func TestCards_UpdateEmptyBody(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodPut, app.Server.URL+"/api/cards", bytes.NewReader([]byte("{}")))
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

func TestCards_UpdateWithoutWordID(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]any{
		"id": testutil.GetUUID(1),
		"word": map[string]string{
			"symbols":       "一",
			"transcription": "yi",
			"translation":   "один",
		},
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPut, app.Server.URL+"/api/cards", bytes.NewReader(body))
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

func TestCards_UpdateStats(t *testing.T) {
	app := testutil.SetupTestApp(t)
	for _, guessed := range []bool{true, false} {
		payload := map[string]any{"id": testutil.GetUUID(1), "guessed": guessed}
		body, _ := json.Marshal(payload)
		res, err := http.Post(app.Server.URL+"/api/cards/stats", "application/json", bytes.NewReader(body))
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		res.Body.Close()
		if res.StatusCode != http.StatusOK {
			t.Fatalf("expected 200, got %d", res.StatusCode)
		}
	}
}

func TestCards_UpdateStatsValidation(t *testing.T) {
	app := testutil.SetupTestApp(t)
	cases := []string{
		`{}`,
		`{"guessed":true}`,
		`{"id":"` + testutil.GetUUID(1) + `"}`,
	}
	for _, payload := range cases {
		res, err := http.Post(app.Server.URL+"/api/cards/stats", "application/json", bytes.NewReader([]byte(payload)))
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		res.Body.Close()
		if res.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 for %s, got %d", payload, res.StatusCode)
		}
	}
}

func TestCards_Delete(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodDelete, app.Server.URL+"/api/cards/"+testutil.GetUUID(1), nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}

func TestCards_DeleteNotFound(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodDelete, app.Server.URL+"/api/cards/"+testutil.GetUUID(404), nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", res.StatusCode)
	}
}

func TestCards_GetWriteCards(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]string{"count": "2"}
	body, _ := json.Marshal(payload)
	res, err := http.Post(app.Server.URL+"/api/cards/study/write", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var cards []map[string]any
	if err := json.NewDecoder(res.Body).Decode(&cards); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if len(cards) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(cards))
	}
}

func TestCards_GetWriteCardsWithGroup(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]string{"count": "5", "groupId": testutil.GetUUID(1)}
	body, _ := json.Marshal(payload)
	res, err := http.Post(app.Server.URL+"/api/cards/study/write", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var cards []map[string]any
	if err := json.NewDecoder(res.Body).Decode(&cards); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if len(cards) != 2 {
		t.Fatalf("expected 2 cards, got %d", len(cards))
	}
}

func TestCards_GetWriteCardsValidation(t *testing.T) {
	app := testutil.SetupTestApp(t)
	cases := []string{`{}`, `{"count":""}`, `{"count":"5","groupId":"bad"}`}
	for _, payload := range cases {
		res, err := http.Post(app.Server.URL+"/api/cards/study/write", "application/json", bytes.NewReader([]byte(payload)))
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		res.Body.Close()
		if res.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 for %s, got %d", payload, res.StatusCode)
		}
	}
}

func TestCards_CreateUnauthorized(t *testing.T) {
	app := testutil.SetupStrictAuthApp(t)
	payload := map[string]any{
		"groupId": testutil.GetUUID(1),
		"word": map[string]string{
			"symbols":       "三",
			"transcription": "san",
			"translation":   "three",
		},
	}
	body, _ := json.Marshal(payload)
	res, err := http.Post(app.Server.URL+"/api/cards", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", res.StatusCode)
	}
}
