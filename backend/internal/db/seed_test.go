package db

import (
	"testing"
	"unicode/utf8"
)

func TestStarterGroupsShape(t *testing.T) {
	n := len(starterGroups)
	if n < 7 || n > 10 {
		t.Fatalf("expected 7-10 starter groups, got %d", n)
	}

	seen := make(map[string]struct{}, n)
	for _, g := range starterGroups {
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

	for _, required := range []string{"Numbers", "Pronouns", "Family", "Days & Time"} {
		if _, ok := seen[required]; !ok {
			t.Fatalf("missing required starter group %q", required)
		}
	}
}
