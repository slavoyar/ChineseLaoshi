package service

import (
	"strings"
	"unicode"

	"github.com/mozillazg/go-pinyin"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

func pinyinArgs() pinyin.Args {
	return pinyin.Args{
		Style:     pinyin.Tone,
		Heteronym: true,
		Fallback: func(r rune, _ pinyin.Args) []string {
			return []string{string(r)}
		},
	}
}

// ConvertPinyin returns per-character readings (primary first) and a joined transcription.
func ConvertPinyin(text string) dto.PinyinResponse {
	text = strings.TrimSpace(text)
	if text == "" {
		return dto.PinyinResponse{
			Characters:    []dto.PinyinChar{},
			Transcription: "",
		}
	}

	args := pinyinArgs()
	chars := make([]dto.PinyinChar, 0, len([]rune(text)))
	var transcription strings.Builder

	for _, r := range text {
		char := string(r)
		readings := readingsForRune(r, args)
		chars = append(chars, dto.PinyinChar{
			Char:     char,
			Readings: readings,
		})
		transcription.WriteString(readings[0])
	}

	return dto.PinyinResponse{
		Characters:    chars,
		Transcription: transcription.String(),
	}
}

func readingsForRune(r rune, args pinyin.Args) []string {
	if !unicode.Is(unicode.Han, r) {
		return []string{string(r)}
	}

	raw := pinyin.SinglePinyin(r, args)
	if len(raw) == 0 {
		return []string{string(r)}
	}
	return raw
}
