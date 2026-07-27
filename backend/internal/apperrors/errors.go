package apperrors

import (
	"errors"
	"fmt"
)

type ErrorCode string

const (
	EntityNotFoundError ErrorCode = "entityNotFoundError"
	EntityCreateError   ErrorCode = "entityCreateError"
	EntityUpdateError   ErrorCode = "entityUpdateError"
	EntityDeleteError   ErrorCode = "entityDeleteError"
	ValidationError     ErrorCode = "validationError"
	UnauthorizedError   ErrorCode = "unauthorizedError"
	ForbiddenError      ErrorCode = "forbiddenError"
	InternalError       ErrorCode = "internalError"
)

var errorDefs = map[ErrorCode]struct {
	Message    string
	StatusCode int
}{
	EntityNotFoundError: {Message: "Requested entity is not found", StatusCode: 404},
	EntityCreateError:   {Message: "Could not create an entity", StatusCode: 500},
	EntityUpdateError:   {Message: "Could not update an entity", StatusCode: 500},
	EntityDeleteError:   {Message: "Could not delete an entity", StatusCode: 500},
	ValidationError:     {Message: "Validation error", StatusCode: 400},
	UnauthorizedError:   {Message: "Authentication required", StatusCode: 401},
	ForbiddenError:      {Message: "Forbidden", StatusCode: 403},
	InternalError:       {Message: "Internal server error", StatusCode: 500},
}

type ValidationDetail struct {
	InstancePath string `json:"instancePath"`
	Message      string `json:"message"`
	Keyword      string `json:"keyword"`
}

type AppError struct {
	Code       ErrorCode          `json:"code"`
	StatusCode int                `json:"statusCode"`
	Message    string             `json:"message"`
	Details    []ValidationDetail `json:"details,omitempty"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func New(code ErrorCode) *AppError {
	info := errorDefs[code]
	return &AppError{
		Code:       code,
		StatusCode: info.StatusCode,
		Message:    info.Message,
	}
}

func NewValidation(message string, details ...ValidationDetail) *AppError {
	err := New(ValidationError)
	err.Message = message
	if len(details) > 0 {
		err.Details = details
	}
	return err
}

func IsAppError(err error) (*AppError, bool) {
	var ae *AppError
	if errors.As(err, &ae) {
		return ae, true
	}
	return nil, false
}
