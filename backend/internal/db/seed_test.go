package db

import (
	"testing"
	"unicode/utf8"
)

func assertStarterPackShape(t *testing.T, groups []seedGroupDef, requiredNames []string) {
	t.Helper()
	n := len(groups)
	if n < 7 || n > 10 {
		t.Fatalf("expected 7-10 starter groups, got %d", n)
	}

	seen := make(map[string]struct{}, n)
	for _, g := range groups {
		if g.name == "" {
			t.Fatal("group name must not be empty")
		}
		if _, dup := seen[g.name]; dup {
			t.Fatalf("duplicate group name %q", g.name)
		}
		seen[g.name] = struct{}{}

		wc := len(g.words)
		if wc < 5 || wc > 20 {
			t.Fatalf("group %q: expected 5-20 words, got %d", g.name, wc)
		}
		for i, w := range g.words {
			if w.symbols == "" || w.transcription == "" || w.translation == "" {
				t.Fatalf("group %q word %d: empty field", g.name, i)
			}
			if utf8.RuneCountInString(w.symbols) == 0 {
				t.Fatalf("group %q word %d: empty symbols", g.name, i)
			}
		}
	}

	for _, required := range requiredNames {
		if _, ok := seen[required]; !ok {
			t.Fatalf("missing required starter group %q", required)
		}
	}
}

func TestStarterGroupsShapeEN(t *testing.T) {
	assertStarterPackShape(t, starterGroupsEN, []string{"Numbers", "Pronouns", "Family", "Days & Time"})
}

func TestStarterGroupsShapeRU(t *testing.T) {
	assertStarterPackShape(t, starterGroupsRU, []string{"Числа", "Местоимения", "Семья", "Дни и время"})
}

func TestStarterGroupsENAndRUSameStructure(t *testing.T) {
	if len(starterGroupsEN) != len(starterGroupsRU) {
		t.Fatalf("group count mismatch: en=%d ru=%d", len(starterGroupsEN), len(starterGroupsRU))
	}
	for i := range starterGroupsEN {
		enGroup := starterGroupsEN[i]
		ruGroup := starterGroupsRU[i]
		if len(enGroup.words) != len(ruGroup.words) {
			t.Fatalf("group %d word count mismatch: en=%d ru=%d", i, len(enGroup.words), len(ruGroup.words))
		}
		for j := range enGroup.words {
			enWord := enGroup.words[j]
			ruWord := ruGroup.words[j]
			if enWord.symbols != ruWord.symbols || enWord.transcription != ruWord.transcription {
				t.Fatalf("group %d word %d: symbols/pinyin mismatch", i, j)
			}
		}
	}
}
