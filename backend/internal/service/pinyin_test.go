package service

import (
	"testing"
)

func TestConvertPinyin_Empty(t *testing.T) {
	res := ConvertPinyin("  ")
	if res.Transcription != "" {
		t.Fatalf("expected empty transcription, got %q", res.Transcription)
	}
	if len(res.Characters) != 0 {
		t.Fatalf("expected no characters, got %d", len(res.Characters))
	}
}

func TestConvertPinyin_Simple(t *testing.T) {
	res := ConvertPinyin("中国")
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

func TestConvertPinyin_Heteronym(t *testing.T) {
	res := ConvertPinyin("行")
	if len(res.Characters) != 1 {
		t.Fatalf("expected 1 character, got %d", len(res.Characters))
	}
	if len(res.Characters[0].Readings) < 2 {
		t.Fatalf("expected multiple readings for 行, got %v", res.Characters[0].Readings)
	}
}

func TestConvertPinyin_NonHanzi(t *testing.T) {
	res := ConvertPinyin("A你")
	if len(res.Characters) != 2 {
		t.Fatalf("expected 2 characters, got %d", len(res.Characters))
	}
	if res.Characters[0].Readings[0] != "A" {
		t.Fatalf("expected passthrough A, got %v", res.Characters[0].Readings)
	}
}
