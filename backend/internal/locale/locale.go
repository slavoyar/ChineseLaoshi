package locale

import "strings"

// Normalize maps a raw client locale to a supported starter-pack language.
// ru / ru-RU / ru-* → "ru"; everything else (including empty) → "en".
func Normalize(raw string) string {
	raw = strings.TrimSpace(strings.ToLower(raw))
	if raw == "ru" || strings.HasPrefix(raw, "ru-") {
		return "ru"
	}
	return "en"
}
