package dto

type PinyinRequest struct {
	Text string `json:"text"`
}

type PinyinChar struct {
	Char     string   `json:"char"`
	Readings []string `json:"readings"`
}

type PinyinResponse struct {
	Characters    []PinyinChar `json:"characters"`
	Transcription string       `json:"transcription"`
}
