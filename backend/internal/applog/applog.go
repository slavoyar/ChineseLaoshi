package applog

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const (
	maxTextLen     = 3500
	notifyInterval = 30 * time.Second
	notifyTimeout  = 5 * time.Second
)

var (
	urlRe   = regexp.MustCompile(`(?i)[a-z][a-z0-9+.-]*://[^\s]+`)
	queryRe = regexp.MustCompile(`\?[^\s]+`)
)

func redact(text string) string {
	text = urlRe.ReplaceAllStringFunc(text, redactURL)
	return queryRe.ReplaceAllString(text, "")
}

func redactURL(raw string) string {
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" {
		return raw
	}
	if u.User != nil {
		name := u.User.Username()
		if _, ok := u.User.Password(); ok {
			u.User = url.UserPassword(name, "***")
		}
	}
	u.RawQuery = ""
	u.Fragment = ""
	return u.String()
}

type Notifier interface {
	Send(ctx context.Context, text string) error
}

type TelegramNotifier struct {
	base   string
	token  string
	chat   string
	client *http.Client
}

func NewTelegram(base, token, chat string) *TelegramNotifier {
	base = strings.TrimRight(base, "/")
	if base == "" || token == "" || chat == "" {
		return nil
	}
	u, err := url.Parse(base)
	if err != nil || !strings.EqualFold(u.Scheme, "https") || u.Host == "" {
		fmt.Fprintln(os.Stderr, "telegram disabled: TELEGRAM_RELAY_BASE must be https")
		return nil
	}
	return &TelegramNotifier{
		base:  base,
		token: token,
		chat:  chat,
		client: &http.Client{
			Timeout: notifyTimeout,
			CheckRedirect: func(*http.Request, []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
	}
}

func (n *TelegramNotifier) Send(ctx context.Context, text string) error {
	if len(text) > maxTextLen {
		text = text[:maxTextLen]
	}
	body, err := json.Marshal(struct {
		ChatID string `json:"chat_id"`
		Text   string `json:"text"`
	}{ChatID: n.chat, Text: text})
	if err != nil {
		return err
	}
	// Telegram Bot API is /bot<token>/METHOD; the Caddy /bot* relay must not log URLs.
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.base+"/bot"+n.token+"/sendMessage", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := n.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return fmt.Errorf("telegram status %d", resp.StatusCode)
	}
	return nil
}

type errorWriter struct {
	stderr io.Writer
	n      Notifier
	mu     sync.Mutex
	last   int64
	wg     sync.WaitGroup
}

var installed atomic.Pointer[errorWriter]

func Install(stderr io.Writer, n *TelegramNotifier) {
	var note Notifier
	if n != nil {
		note = n
	}
	w := &errorWriter{stderr: stderr, n: note}
	installed.Store(w)
	log.SetOutput(w)
}

func Flush() {
	if w := installed.Load(); w != nil {
		w.flush()
	}
}

func Fatal(v ...any) {
	log.Print(v...)
	Flush()
	os.Exit(1)
}

func Fatalf(format string, args ...any) {
	log.Printf(format, args...)
	Flush()
	os.Exit(1)
}

func isErrorLog(p []byte) bool {
	msg := p
	if len(msg) >= 20 && msg[4] == '/' && msg[10] == ' ' {
		msg = msg[20:]
	}
	return bytes.HasPrefix(msg, []byte("ERROR"))
}

func (w *errorWriter) flush() {
	w.mu.Lock()
	w.mu.Unlock()
	done := make(chan struct{})
	go func() {
		w.wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(notifyTimeout):
	}
}

func (w *errorWriter) Write(p []byte) (int, error) {
	n, err := w.stderr.Write(p)
	if w.n == nil || !isErrorLog(p) {
		return n, err
	}
	w.mu.Lock()
	now := time.Now().Unix()
	if now-w.last < int64(notifyInterval.Seconds()) {
		w.mu.Unlock()
		return n, err
	}
	w.last = now
	w.wg.Add(1)
	w.mu.Unlock()
	msg := string(p)
	go func() {
		defer w.wg.Done()
		ctx, cancel := context.WithTimeout(context.Background(), notifyTimeout)
		defer cancel()
		if sendErr := w.n.Send(ctx, redact(msg)); sendErr != nil {
			fmt.Fprintln(w.stderr, "telegram notify failed")
		}
	}()
	return n, err
}
