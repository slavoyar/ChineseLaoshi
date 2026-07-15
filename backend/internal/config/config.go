package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port              string
	DBURL             string
	DataDir           string
	DefaultUserEmail  string
	NodeEnv           string
	EmbeddedPGPort    uint32
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "./data/pg"
	}

	email := os.Getenv("DEFAULT_USER_EMAIL")
	if email == "" {
		email = "slavoyar@mail.com"
	}

	embeddedPort := uint32(5433)
	if v := os.Getenv("EMBEDDED_PG_PORT"); v != "" {
		if p, err := strconv.ParseUint(v, 10, 32); err == nil {
			embeddedPort = uint32(p)
		}
	}

	return Config{
		Port:             port,
		DBURL:            os.Getenv("DB_URL"),
		DataDir:          dataDir,
		DefaultUserEmail: email,
		NodeEnv:          os.Getenv("NODE_ENV"),
		EmbeddedPGPort:   embeddedPort,
	}
}
