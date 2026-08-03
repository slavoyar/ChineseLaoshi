package service

import (
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	"github.com/slavo/ChineseLaoshi/backend/internal/pinyin"
)

// ConvertPinyin returns per-character readings (phrase-aware primary first) and a joined transcription.
func ConvertPinyin(text string) dto.PinyinResponse {
	return pinyin.Convert(text)
}
