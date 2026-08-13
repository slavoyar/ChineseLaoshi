package config

import (
	"testing"
)

func TestLoadAllowedOriginsDefaults(t *testing.T) {
	t.Setenv("JWT_SECRET", "x")
	t.Setenv("GOOGLE_CLIENT_ID", "x")
	t.Setenv("ALLOWED_ORIGINS", "")
	t.Setenv("NODE_ENV", "")

	cfg := Load()
	if len(cfg.AllowedOrigins) != 2 {
		t.Fatalf("expected localhost defaults, got %#v", cfg.AllowedOrigins)
	}
}

func TestLoadAllowedOriginsProductionEmpty(t *testing.T) {
	t.Setenv("JWT_SECRET", "x")
	t.Setenv("GOOGLE_CLIENT_ID", "x")
	t.Setenv("ALLOWED_ORIGINS", "")
	t.Setenv("NODE_ENV", "production")

	cfg := Load()
	if len(cfg.AllowedOrigins) != 0 {
		t.Fatalf("expected empty allowlist in production, got %#v", cfg.AllowedOrigins)
	}
}

func TestLoadAllowedOriginsExplicit(t *testing.T) {
	t.Setenv("JWT_SECRET", "x")
	t.Setenv("GOOGLE_CLIENT_ID", "x")
	t.Setenv("NODE_ENV", "production")
	t.Setenv("ALLOWED_ORIGINS", "https://chineselaoshi.slavoyar.tech, https://other.example")

	cfg := Load()
	if len(cfg.AllowedOrigins) != 2 {
		t.Fatalf("expected 2 origins, got %#v", cfg.AllowedOrigins)
	}
	if cfg.AllowedOrigins[0] != "https://chineselaoshi.slavoyar.tech" {
		t.Fatalf("unexpected first origin: %q", cfg.AllowedOrigins[0])
	}
}

func TestLoadTelegramRelay(t *testing.T) {
	t.Setenv("TELEGRAM_BOT_TOKEN", "")
	t.Setenv("TELEGRAM_CHAT_ID", "")
	t.Setenv("TELEGRAM_RELAY_BASE", "")
	cfg := Load()
	if cfg.TelegramRelayBase != "" {
		t.Fatalf("empty relay = %q", cfg.TelegramRelayBase)
	}

	t.Setenv("TELEGRAM_RELAY_BASE", "https://relay.example/")
	t.Setenv("TELEGRAM_BOT_TOKEN", "tok")
	t.Setenv("TELEGRAM_CHAT_ID", "123")
	cfg = Load()
	if cfg.TelegramRelayBase != "https://relay.example" {
		t.Fatalf("trimmed relay = %q", cfg.TelegramRelayBase)
	}
	if cfg.TelegramBotToken != "tok" || cfg.TelegramChatID != "123" {
		t.Fatalf("token/chat = %q %q", cfg.TelegramBotToken, cfg.TelegramChatID)
	}
}
