package handler_test

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestWords_SearchEmpty(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Get(app.Server.URL + "/api/words")
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
	if len(body) != 0 {
		t.Fatalf("expected empty array, got %d", len(body))
	}
}

func TestWords_SearchExisting(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Get(app.Server.URL + "/api/words?search=y")
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
	if len(body) == 0 {
		t.Fatal("expected at least one word")
	}
}

func TestWords_SearchNotFound(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Get(app.Server.URL + "/api/words?search=wrong")
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
	if len(body) != 0 {
		t.Fatalf("expected empty array, got %d", len(body))
	}
}
