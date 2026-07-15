package dto

type Word struct {
	ID            string `json:"id"`
	Symbols       string `json:"symbols"`
	Transcription string `json:"transcription"`
	Translation   string `json:"translation"`
}

type CreateWord struct {
	Symbols       string `json:"symbols"`
	Transcription string `json:"transcription"`
	Translation   string `json:"translation"`
}
