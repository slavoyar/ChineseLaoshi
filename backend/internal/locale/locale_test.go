package locale_test

import (
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/locale"
)

func TestNormalize(t *testing.T) {
	tests := []struct {
		in, want string
	}{
		{"", "en"},
		{"en", "en"},
		{"en-US", "en"},
		{"ru", "ru"},
		{"ru-RU", "ru"},
		{"ru-UA", "ru"},
		{" RU ", "ru"},
		{"de", "en"},
		{"zh", "en"},
	}
	for _, tc := range tests {
		if got := locale.Normalize(tc.in); got != tc.want {
			t.Fatalf("Normalize(%q) = %q, want %q", tc.in, got, tc.want)
		}
	}
}
