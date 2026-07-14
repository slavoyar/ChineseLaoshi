package apperrors

import "fmt"

type ErrorCode string

const (
	EntityNotFoundError ErrorCode = "entityNotFoundError"
	EntityCreateError   ErrorCode = "entityCreateError"
	EntityUpdateError   ErrorCode = "entityUpdateError"
	EntityDeleteError   ErrorCode = "entityDeleteError"
	ValidationError     ErrorCode = "validationError"
)

var errors = map[ErrorCode]struct {
	Message    string
	StatusCode int
}{
	EntityNotFoundError: {Message: "Requested entity is not found", StatusCode: 404},
	EntityCreateError:   {Message: "Could not create an entity", StatusCode: 500},
	EntityUpdateError:   {Message: "Could not update an entity", StatusCode: 500},
	EntityDeleteError:   {Message: "Could not delete an entity", StatusCode: 500},
	ValidationError:     {Message: "Validation error", StatusCode: 500},
}

type AppError struct {
	Code       ErrorCode `json:"code"`
	StatusCode int       `json:"statusCode"`
	Message    string    `json:"message"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func New(code ErrorCode) *AppError {
	info := errors[code]
	return &AppError{
		Code:       code,
		StatusCode: info.StatusCode,
		Message:    info.Message,
	}
}

func IsAppError(err error) (*AppError, bool) {
	if err == nil {
		return nil, false
	}
	if ae, ok := err.(*AppError); ok {
		return ae, true
	}
	return nil, false
}
