package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestGroups_List(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Get(app.Server.URL + "/api/groups")
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
	if len(body) != 1 {
		t.Fatalf("expected 1 English template group, got %d", len(body))
	}
	if body[0]["name"] != "Demo" {
		t.Fatalf("expected Demo group, got %v", body[0]["name"])
	}
}

func TestGroups_ListRussianLocale(t *testing.T) {
	app := testutil.SetupTestApp(t)
	res, err := http.Get(app.Server.URL + "/api/groups?locale=ru")
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
	if len(body) != 1 {
		t.Fatalf("expected 1 Russian template group, got %d", len(body))
	}
	if body[0]["name"] != "Демо" {
		t.Fatalf("expected Демо group, got %v", body[0]["name"])
	}
}

func TestGroups_Create(t *testing.T) {
	app := testutil.SetupTestApp(t)
	body, _ := json.Marshal(map[string]string{"name": "test"})
	res, err := http.Post(app.Server.URL+"/api/groups", "application/json", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var group map[string]any
	if err := json.NewDecoder(res.Body).Decode(&group); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if group["name"] != "test" {
		t.Fatalf("expected name test, got %v", group["name"])
	}
}

func TestGroups_CreateValidation(t *testing.T) {
	app := testutil.SetupTestApp(t)
	for _, payload := range []string{`{"name":""}`, `{}`} {
		res, err := http.Post(app.Server.URL+"/api/groups", "application/json", bytes.NewReader([]byte(payload)))
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		res.Body.Close()
		if res.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 for %s, got %d", payload, res.StatusCode)
		}
	}
}

func TestGroups_Update(t *testing.T) {
	app := testutil.SetupTestApp(t)
	payload := map[string]string{"id": testutil.GetUUID(1), "name": "new name"}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPut, app.Server.URL+"/api/groups", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var group map[string]any
	if err := json.NewDecoder(res.Body).Decode(&group); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if group["name"] != "new name" {
		t.Fatalf("expected new name, got %v", group["name"])
	}
}

func TestGroups_UpdateValidation(t *testing.T) {
	app := testutil.SetupTestApp(t)
	for _, payload := range []string{
		`{"id":"` + testutil.GetUUID(1) + `","name":""}`,
		`{}`,
	} {
		req, _ := http.NewRequest(http.MethodPut, app.Server.URL+"/api/groups", bytes.NewReader([]byte(payload)))
		req.Header.Set("Content-Type", "application/json")
		res, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		res.Body.Close()
		if res.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 for %s, got %d", payload, res.StatusCode)
		}
	}
}

func TestGroups_Delete(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodDelete, app.Server.URL+"/api/groups/"+testutil.GetUUID(1), nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}

func TestGroups_DeleteNotFound(t *testing.T) {
	app := testutil.SetupTestApp(t)
	req, _ := http.NewRequest(http.MethodDelete, app.Server.URL+"/api/groups/"+testutil.GetUUID(404), nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", res.StatusCode)
	}
}
