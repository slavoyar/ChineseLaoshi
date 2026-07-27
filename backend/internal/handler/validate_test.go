package handler

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

func TestValidateCreateGroup(t *testing.T) {
	w := httptest.NewRecorder()
	if validateCreateGroup(w, &dto.CreateGroup{Name: "ok"}) != true {
		t.Fatal("expected valid create group")
	}

	w = httptest.NewRecorder()
	if validateCreateGroup(w, &dto.CreateGroup{Name: ""}) != false || w.Code != 400 {
		t.Fatal("expected invalid empty name")
	}
	var body apperrors.AppError
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Code != apperrors.ValidationError || body.Message != "name is required" {
		t.Fatalf("expected validation envelope, got %+v", body)
	}
	if len(body.Details) != 1 || body.Details[0].Message != "name is required" {
		t.Fatalf("expected details, got %+v", body.Details)
	}
}

func TestValidateUpdateGroup(t *testing.T) {
	validID := "00000000-0000-0000-0000-000000000001"
	w := httptest.NewRecorder()
	if validateUpdateGroup(w, &dto.UpdateGroup{ID: validID, Name: "ok"}) != true {
		t.Fatal("expected valid update group")
	}

	w = httptest.NewRecorder()
	if validateUpdateGroup(w, &dto.UpdateGroup{ID: "bad", Name: "ok"}) != false {
		t.Fatal("expected invalid id")
	}

	w = httptest.NewRecorder()
	if validateUpdateGroup(w, &dto.UpdateGroup{ID: validID, Name: ""}) != false {
		t.Fatal("expected invalid empty name")
	}
}

func TestValidateCreateCard(t *testing.T) {
	validID := "00000000-0000-0000-0000-000000000001"
	symbols, transcription, translation := "一", "yi", "one"
	wordID := validID

	w := httptest.NewRecorder()
	if validateCreateCard(w, &dto.CreateCard{
		GroupID: validID,
		Word:    dto.CreateCardWord{Symbols: &symbols, Transcription: &transcription, Translation: &translation},
	}) != true {
		t.Fatal("expected valid new word card")
	}

	w = httptest.NewRecorder()
	if validateCreateCard(w, &dto.CreateCard{GroupID: validID, Word: dto.CreateCardWord{ID: &wordID}}) != true {
		t.Fatal("expected valid existing word card")
	}

	w = httptest.NewRecorder()
	if validateCreateCard(w, &dto.CreateCard{GroupID: "bad", Word: dto.CreateCardWord{ID: &wordID}}) != false {
		t.Fatal("expected invalid group id")
	}

	w = httptest.NewRecorder()
	if validateCreateCard(w, &dto.CreateCard{GroupID: validID, Word: dto.CreateCardWord{}}) != false {
		t.Fatal("expected invalid word")
	}
}

func TestValidateUpdateCardWord(t *testing.T) {
	validID := "00000000-0000-0000-0000-000000000001"
	w := httptest.NewRecorder()
	if validateUpdateCardWord(w, &dto.UpdateCardWord{
		ID: validID,
		Word: dto.Word{ID: validID, Symbols: "一", Transcription: "yi", Translation: "one"},
	}) != true {
		t.Fatal("expected valid update card word")
	}

	w = httptest.NewRecorder()
	if validateUpdateCardWord(w, &dto.UpdateCardWord{ID: "bad", Word: dto.Word{ID: validID}}) != false {
		t.Fatal("expected invalid card id")
	}
}

func TestValidateUpdateCardStats(t *testing.T) {
	validID := "00000000-0000-0000-0000-000000000001"
	w := httptest.NewRecorder()
	if validateUpdateCardStats(w, &dto.UpdateCardStats{ID: validID, Guessed: true}) != true {
		t.Fatal("expected valid stats update")
	}

	w = httptest.NewRecorder()
	if validateUpdateCardStats(w, &dto.UpdateCardStats{ID: "bad", Guessed: true}) != false {
		t.Fatal("expected invalid id")
	}
}

func TestValidateGetWriteCard(t *testing.T) {
	validID := "00000000-0000-0000-0000-000000000001"
	w := httptest.NewRecorder()
	if validateGetWriteCard(w, &dto.GetWriteCard{Count: "5"}) != true {
		t.Fatal("expected valid write card request")
	}

	w = httptest.NewRecorder()
	groupID := validID
	if validateGetWriteCard(w, &dto.GetWriteCard{Count: "5", GroupID: &groupID}) != true {
		t.Fatal("expected valid write card with group")
	}

	w = httptest.NewRecorder()
	if validateGetWriteCard(w, &dto.GetWriteCard{Count: ""}) != false {
		t.Fatal("expected invalid empty count")
	}

	w = httptest.NewRecorder()
	bad := "bad"
	if validateGetWriteCard(w, &dto.GetWriteCard{Count: "5", GroupID: &bad}) != false {
		t.Fatal("expected invalid group id")
	}
}

func TestIsUUID(t *testing.T) {
	if !isUUID("00000000-0000-0000-0000-000000000001") {
		t.Fatal("expected valid uuid")
	}
	if isUUID("not-a-uuid") {
		t.Fatal("expected invalid uuid")
	}
}
