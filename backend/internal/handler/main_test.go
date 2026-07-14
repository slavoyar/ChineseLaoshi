package handler_test

import (
	"os"
	"testing"

	"github.com/slavo/ChineseLaoshi/backend/internal/testutil"
)

func TestMain(m *testing.M) {
	app := testutil.MustInit()
	code := m.Run()
	app.Cleanup()
	os.Exit(code)
}
