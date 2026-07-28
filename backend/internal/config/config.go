package config

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

const (
	TemplateProvider        = "system"
	TemplateProviderSubject = "template"
	DefaultTemplateEmail    = "demo-template@chineselaoshi.local"
	DefaultSessionTTL       = 7 * 24 * time.Hour
)

type Config struct {
	Port             string
	DBURL            string
	DataDir          string
	TemplateEmail    string
	NodeEnv          string
	EmbeddedPGPort   uint32
	GoogleClientID   string
	JWTSecret        string
	CookieSecure     bool
	SessionTTL       time.Duration
	AllowedOrigins   []string
}

func Load() Config {
	// Load backend/.env when present (e.g. npm run dev:backend). Existing env wins.
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "./data/pg"
	}

	templateEmail := os.Getenv("TEMPLATE_USER_EMAIL")
	if templateEmail == "" {
		// Backward-compatible fallback for existing deploys.
		templateEmail = os.Getenv("DEFAULT_USER_EMAIL")
	}
	if templateEmail == "" {
		templateEmail = DefaultTemplateEmail
	}

	embeddedPort := uint32(5433)
	if v := os.Getenv("EMBEDDED_PG_PORT"); v != "" {
		if p, err := strconv.ParseUint(v, 10, 32); err == nil {
			embeddedPort = uint32(p)
		}
	}

	nodeEnv := os.Getenv("NODE_ENV")
	cookieSecure := nodeEnv == "production"
	if v := os.Getenv("COOKIE_SECURE"); v != "" {
		cookieSecure = v == "true" || v == "1"
	}

	sessionTTL := DefaultSessionTTL
	if v := os.Getenv("SESSION_TTL_HOURS"); v != "" {
		if hours, err := strconv.Atoi(v); err == nil && hours > 0 {
			sessionTTL = time.Duration(hours) * time.Hour
		}
	}

	var allowedOrigins []string
	if v := os.Getenv("ALLOWED_ORIGINS"); v != "" {
		parts := strings.Split(v, ",")
		allowedOrigins = make([]string, 0, len(parts))
		for _, part := range parts {
			part = strings.TrimSpace(part)
			if part != "" {
				allowedOrigins = append(allowedOrigins, part)
			}
		}
	} else if nodeEnv != "production" {
		// Local/dev defaults only — production requires an explicit allowlist.
		allowedOrigins = []string{"http://localhost:5173", "http://127.0.0.1:5173"}
	}

	return Config{
		Port:           port,
		DBURL:          os.Getenv("DB_URL"),
		DataDir:        dataDir,
		TemplateEmail:  templateEmail,
		NodeEnv:        nodeEnv,
		EmbeddedPGPort: embeddedPort,
		GoogleClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		JWTSecret:      os.Getenv("JWT_SECRET"),
		CookieSecure:   cookieSecure,
		SessionTTL:     sessionTTL,
		AllowedOrigins: allowedOrigins,
	}
}
