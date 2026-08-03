package pinyin

import (
	"strings"
	"testing"
	"unicode"
)

func TestConvert_Empty(t *testing.T) {
	res := Convert("  ")
	if res.Transcription != "" {
		t.Fatalf("expected empty transcription, got %q", res.Transcription)
	}
	if len(res.Characters) != 0 {
		t.Fatalf("expected no characters, got %d", len(res.Characters))
	}
}

func TestConvert_Simple(t *testing.T) {
	res := Convert("中国")
	if len(res.Characters) != 2 {
		t.Fatalf("expected 2 characters, got %d", len(res.Characters))
	}
	if res.Characters[0].Char != "中" || len(res.Characters[0].Readings) == 0 {
		t.Fatalf("unexpected first char: %+v", res.Characters[0])
	}
	if res.Transcription == "" {
		t.Fatal("expected non-empty transcription")
	}
	if res.Transcription != res.Characters[0].Readings[0]+res.Characters[1].Readings[0] {
		t.Fatalf("transcription mismatch: %q", res.Transcription)
	}
}

func TestConvert_BabaNeutralDefault(t *testing.T) {
	res := Convert("爸爸")
	if len(res.Characters) != 2 {
		t.Fatalf("expected 2 characters, got %d", len(res.Characters))
	}
	first := res.Characters[0].Readings[0]
	second := res.Characters[1].Readings[0]
	if !hasToneMark(first) {
		t.Fatalf("expected first 爸 primary to be toned, got %q", first)
	}
	if hasToneMark(second) {
		t.Fatalf("expected second 爸 primary to be toneless, got %q", second)
	}
	if !containsReading(res.Characters[0].Readings, "ba") || !containsReading(res.Characters[0].Readings, "bà") {
		t.Fatalf("expected first 爸 to list toned and toneless options, got %v", res.Characters[0].Readings)
	}
	if !containsReading(res.Characters[1].Readings, "ba") || !containsReading(res.Characters[1].Readings, "bà") {
		t.Fatalf("expected second 爸 to list toned and toneless options, got %v", res.Characters[1].Readings)
	}
}

func TestConvert_Heteronym(t *testing.T) {
	res := Convert("行")
	if len(res.Characters) != 1 {
		t.Fatalf("expected 1 character, got %d", len(res.Characters))
	}
	if len(res.Characters[0].Readings) < 2 {
		t.Fatalf("expected multiple readings for 行, got %v", res.Characters[0].Readings)
	}
}

func TestConvert_NonHanzi(t *testing.T) {
	res := Convert("A你")
	if len(res.Characters) != 2 {
		t.Fatalf("expected 2 characters, got %d", len(res.Characters))
	}
	if res.Characters[0].Readings[0] != "A" {
		t.Fatalf("expected passthrough A, got %v", res.Characters[0].Readings)
	}
}

func containsReading(readings []string, want string) bool {
	for _, reading := range readings {
		if reading == want {
			return true
		}
	}
	return false
}

func hasToneMark(s string) bool {
	for _, r := range s {
		switch r {
		case 'ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì',
			'ō', 'ó', 'ǒ', 'ò', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ń', 'ň', 'ǹ', 'ḿ':
			return true
		}
		if unicode.In(r, unicode.Mn) {
			return true
		}
	}
	return strings.ContainsAny(s, "\u0304\u0301\u030C\u0300")
}
