package pinyin

import (
	"strings"
	"unicode"

	"github.com/mozillazg/go-pinyin"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
	pinyinpro "github.com/yngpiu/pinyin-pro-go"
)

func toneArgs() pinyin.Args {
	return pinyin.Args{
		Style:     pinyin.Tone,
		Heteronym: true,
		Fallback: func(r rune, _ pinyin.Args) []string {
			return []string{string(r)}
		},
	}
}

func normalArgs() pinyin.Args {
	return pinyin.Args{
		Style:     pinyin.Normal,
		Heteronym: true,
		Fallback: func(r rune, _ pinyin.Args) []string {
			return []string{string(r)}
		},
	}
}

// Convert returns per-character readings (phrase-aware primary first) and a joined transcription.
func Convert(text string) dto.PinyinResponse {
	text = strings.TrimSpace(text)
	if text == "" {
		return dto.PinyinResponse{
			Characters:    []dto.PinyinChar{},
			Transcription: "",
		}
	}

	runes := []rune(text)
	primaries := phrasePrimaries(text, len(runes))
	tone := toneArgs()
	normal := normalArgs()

	chars := make([]dto.PinyinChar, 0, len(runes))
	var transcription strings.Builder

	for i, r := range runes {
		char := string(r)
		primary := ""
		if i < len(primaries) {
			primary = primaries[i]
		}
		readings := mergeReadings(r, primary, tone, normal)
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

func phrasePrimaries(text string, runeCount int) []string {
	raw := pinyinpro.Pinyin(text, pinyinpro.Options{
		Type:       "array",
		ToneType:   pinyinpro.ToneTypeSymbol,
		ToneSandhi: true,
	})
	list, ok := raw.([]string)
	if !ok || len(list) != runeCount {
		return nil
	}
	return list
}

func mergeReadings(r rune, primary string, tone, normal pinyin.Args) []string {
	if !unicode.Is(unicode.Han, r) {
		if primary != "" {
			return []string{primary}
		}
		return []string{string(r)}
	}

	out := make([]string, 0, 8)
	seen := make(map[string]struct{}, 8)

	appendUnique := func(s string) {
		if s == "" {
			return
		}
		if _, ok := seen[s]; ok {
			return
		}
		seen[s] = struct{}{}
		out = append(out, s)
	}

	appendUnique(primary)
	for _, reading := range pinyin.SinglePinyin(r, tone) {
		appendUnique(reading)
	}
	for _, reading := range pinyin.SinglePinyin(r, normal) {
		appendUnique(reading)
	}

	if len(out) == 0 {
		return []string{string(r)}
	}
	return out
}
