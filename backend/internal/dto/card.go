package dto

type Card struct {
	ID        string  `json:"id"`
	GroupID   string  `json:"groupId"`
	Progress  float64 `json:"progress"`
	Word      Word    `json:"word"`
	ShowCount int     `json:"showCount"`
}

type CreateCardWord struct {
	ID            *string `json:"id,omitempty"`
	Symbols       *string `json:"symbols,omitempty"`
	Transcription *string `json:"transcription,omitempty"`
	Translation   *string `json:"translation,omitempty"`
}

type CreateCard struct {
	Word    CreateCardWord `json:"word"`
	GroupID string         `json:"groupId"`
}

type UpdateCardWord struct {
	ID   string `json:"id"`
	Word Word   `json:"word"`
}

type UpdateCardStats struct {
	ID      string `json:"id"`
	Guessed bool   `json:"guessed"`
}

type GetWriteCard struct {
	Count   string  `json:"count"`
	GroupID *string `json:"groupId,omitempty"`
}
