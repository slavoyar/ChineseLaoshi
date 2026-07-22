package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"regexp"

	"github.com/slavo/ChineseLaoshi/backend/internal/apperrors"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

var uuidRegex = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)

type validationIssue struct {
	InstancePath string `json:"instancePath"`
	Message      string `json:"message"`
	Keyword      string `json:"keyword"`
}

func decodeJSON(w http.ResponseWriter, r *http.Request, dest any) bool {
	if r.Body == nil {
		writeValidationError(w, "body required")
		return false
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeValidationError(w, "invalid body")
		return false
	}
	if len(body) == 0 {
		writeValidationError(w, "body required")
		return false
	}
	if err := json.Unmarshal(body, dest); err != nil {
		writeValidationError(w, err.Error())
		return false
	}
	return true
}

func writeValidationError(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	_ = json.NewEncoder(w).Encode([]validationIssue{{
		InstancePath: "",
		Message:      message,
		Keyword:      "required",
	}})
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if body != nil {
		_ = json.NewEncoder(w).Encode(body)
	}
}

func isUUID(value string) bool {
	return uuidRegex.MatchString(value)
}

func validateCreateGroup(w http.ResponseWriter, data *dto.CreateGroup) bool {
	if data.Name == "" {
		writeValidationError(w, "name is required")
		return false
	}
	return true
}

func validateUpdateGroup(w http.ResponseWriter, data *dto.UpdateGroup) bool {
	if data.ID == "" || !isUUID(data.ID) {
		writeValidationError(w, "id is required")
		return false
	}
	if data.Name == "" {
		writeValidationError(w, "name is required")
		return false
	}
	return true
}

func validateCreateCard(w http.ResponseWriter, data *dto.CreateCard) bool {
	if data.GroupID == "" || !isUUID(data.GroupID) {
		writeValidationError(w, "groupId is required")
		return false
	}
	if isCreateWordFields(data.Word) {
		return true
	}
	if data.Word.ID != nil && isUUID(*data.Word.ID) {
		return true
	}
	writeValidationError(w, "word is required")
	return false
}

func isCreateWordFields(word dto.CreateCardWord) bool {
	return word.Symbols != nil && word.Transcription != nil && word.Translation != nil &&
		*word.Symbols != "" && *word.Transcription != "" && *word.Translation != ""
}

func validateUpdateCardWord(w http.ResponseWriter, data *dto.UpdateCardWord) bool {
	if data.ID == "" || !isUUID(data.ID) {
		writeValidationError(w, "id is required")
		return false
	}
	if data.Word.ID == "" || !isUUID(data.Word.ID) {
		writeValidationError(w, "word.id is required")
		return false
	}
	if data.Word.Symbols == "" || data.Word.Transcription == "" || data.Word.Translation == "" {
		writeValidationError(w, "word fields are required")
		return false
	}
	return true
}

func validateUpdateCardStats(w http.ResponseWriter, data *dto.UpdateCardStats) bool {
	if data.ID == "" || !isUUID(data.ID) {
		writeValidationError(w, "id is required")
		return false
	}
	// guessed is bool, always present after JSON unmarshal
	return true
}

func validateGetWriteCard(w http.ResponseWriter, data *dto.GetWriteCard) bool {
	if data.Count == "" {
		writeValidationError(w, "count is required")
		return false
	}
	if data.GroupID != nil && *data.GroupID != "" && !isUUID(*data.GroupID) {
		writeValidationError(w, "groupId must be uuid")
		return false
	}
	return true
}

func mapHandlerError(w http.ResponseWriter, err error) {
	if ae, ok := apperrors.IsAppError(err); ok {
		writeJSON(w, ae.StatusCode, ae)
		return
	}
	log.Printf("handler error: %v", err)
	writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Internal server error"})
}
