package db

import (
	"os"
	"path/filepath"
)

func MigrationsPath() string {
	if wd, err := os.Getwd(); err == nil {
		dir := wd
		for i := 0; i < 8; i++ {
			for _, candidate := range []string{
				filepath.Join(dir, "migrations"),
				filepath.Join(dir, "backend", "migrations"),
			} {
				if info, statErr := os.Stat(candidate); statErr == nil && info.IsDir() {
					return candidate
				}
			}
			parent := filepath.Dir(dir)
			if parent == dir {
				break
			}
			dir = parent
		}
	}
	return "migrations"
}
