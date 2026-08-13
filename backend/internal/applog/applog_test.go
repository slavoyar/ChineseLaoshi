package applog

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
	"testing"
)

type stubNotifier struct {
	mu  sync.Mutex
	got []string
}

func (s *stubNotifier) Send(_ context.Context, text string) error {
	s.mu.Lock()
	s.got = append(s.got, text)
	s.mu.Unlock()
	return nil
}

func (s *stubNotifier) texts() []string {
	s.mu.Lock()
	defer s.mu.Unlock()
	out := make([]string, len(s.got))
	copy(out, s.got)
	return out
}

func TestWriterERRORNotifies(t *testing.T) {
	stub := &stubNotifier{}
	var buf bytes.Buffer
	w := &errorWriter{stderr: &buf, n: stub}
	if _, err := w.Write([]byte("2026/08/14 00:00:00 ERROR boom\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	if !strings.Contains(buf.String(), "ERROR boom") {
		t.Fatalf("stderr missing line: %q", buf.String())
	}
	if got := stub.texts(); len(got) != 1 || !strings.Contains(got[0], "ERROR boom") {
		t.Fatalf("notify = %#v", got)
	}
}

func TestWriterINFODoesNotNotify(t *testing.T) {
	stub := &stubNotifier{}
	w := &errorWriter{stderr: io.Discard, n: stub}
	if _, err := w.Write([]byte("INFO ok\n")); err != nil {
		t.Fatal(err)
	}
	if _, err := w.Write([]byte("INFO req=GET /search?q=ERROR 200\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	if got := stub.texts(); len(got) != 0 {
		t.Fatalf("unexpected notify: %#v", got)
	}
}

func TestWriterNilNotifier(t *testing.T) {
	var buf bytes.Buffer
	w := &errorWriter{stderr: &buf}
	if _, err := w.Write([]byte("ERROR boom\n")); err != nil {
		t.Fatal(err)
	}
	if buf.String() != "ERROR boom\n" {
		t.Fatalf("got %q", buf.String())
	}
}

func TestWriterRateLimit(t *testing.T) {
	stub := &stubNotifier{}
	w := &errorWriter{stderr: io.Discard, n: stub}
	if _, err := w.Write([]byte("ERROR one\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	if _, err := w.Write([]byte("ERROR two\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	if got := stub.texts(); len(got) != 1 {
		t.Fatalf("notify count = %#v", got)
	}
}

type failNotifier struct{}

func (failNotifier) Send(context.Context, string) error { return errors.New("nope") }

func TestWriterFailedNotifyOmitsErrorText(t *testing.T) {
	var buf bytes.Buffer
	w := &errorWriter{stderr: &buf, n: failNotifier{}}
	if _, err := w.Write([]byte("ERROR one\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	if strings.Contains(buf.String(), "nope") {
		t.Fatalf("stderr leaked send error: %q", buf.String())
	}
	if !strings.Contains(buf.String(), "telegram notify failed") {
		t.Fatalf("stderr missing notify failure: %q", buf.String())
	}
}

func TestWriterFailedNotifyStillRateLimits(t *testing.T) {
	stub := &stubNotifier{}
	w := &errorWriter{stderr: io.Discard, n: failNotifier{}}
	if _, err := w.Write([]byte("ERROR one\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	w.n = stub
	if _, err := w.Write([]byte("ERROR two\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	if got := stub.texts(); len(got) != 0 {
		t.Fatalf("failed send should still rate-limit, got %#v", got)
	}
}

func TestWriterRedactsNotify(t *testing.T) {
	stub := &stubNotifier{}
	w := &errorWriter{stderr: io.Discard, n: stub}
	if _, err := w.Write([]byte("ERROR postgres://u:s3cret@db.example/app?x=1\n")); err != nil {
		t.Fatal(err)
	}
	w.flush()
	got := stub.texts()
	if len(got) != 1 || strings.Contains(got[0], "s3cret") || strings.Contains(got[0], "?x=1") {
		t.Fatalf("notify = %#v", got)
	}
}

func TestRedact(t *testing.T) {
	in := "ERROR database bootstrap failed: postgres://u:s3cret%40x@db.example:5432/app?sslmode=disable"
	got := redact(in)
	if strings.Contains(got, "s3cret") || strings.Contains(got, "sslmode") {
		t.Fatalf("got %q", got)
	}
}

func TestInstallNilNotifier(t *testing.T) {
	var buf bytes.Buffer
	Install(&buf, nil)
	t.Cleanup(func() { log.SetOutput(os.Stderr) })
	log.Print("ERROR boom")
	if !strings.Contains(buf.String(), "ERROR boom") {
		t.Fatalf("got %q", buf.String())
	}
}

func TestNewTelegramEmpty(t *testing.T) {
	if NewTelegram("https://relay.example", "", "1") != nil {
		t.Fatal("expected nil without token")
	}
	if NewTelegram("https://relay.example", "tok", "") != nil {
		t.Fatal("expected nil without chat")
	}
	if NewTelegram("", "tok", "1") != nil {
		t.Fatal("expected nil without relay base")
	}
	if NewTelegram("http://relay.example", "tok", "1") != nil {
		t.Fatal("expected nil for http relay")
	}
}

func TestTelegramSend(t *testing.T) {
	var gotPath, gotBody string
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(r.Body)
		gotPath = r.URL.Path
		gotBody = string(b)
		w.WriteHeader(http.StatusOK)
	}))
	t.Cleanup(srv.Close)

	n := NewTelegram(srv.URL, "tok", "chat1")
	if n == nil {
		t.Fatal("expected notifier")
	}
	n.client.Transport = srv.Client().Transport
	if err := n.Send(context.Background(), "hello"); err != nil {
		t.Fatal(err)
	}
	if gotPath != "/bottok/sendMessage" {
		t.Fatalf("path = %q", gotPath)
	}
	var payload struct {
		ChatID string `json:"chat_id"`
		Text   string `json:"text"`
	}
	if err := json.Unmarshal([]byte(gotBody), &payload); err != nil {
		t.Fatal(err)
	}
	if payload.ChatID != "chat1" || payload.Text != "hello" {
		t.Fatalf("payload = %#v", payload)
	}
}

func TestNotifySends(t *testing.T) {
	var gotBody string
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(r.Body)
		gotBody = string(b)
		w.WriteHeader(http.StatusOK)
	}))
	t.Cleanup(srv.Close)

	n := NewTelegram(srv.URL, "tok", "chat1")
	if n == nil {
		t.Fatal("expected notifier")
	}
	n.client.Transport = srv.Client().Transport
	Install(io.Discard, n)
	t.Cleanup(func() { log.SetOutput(os.Stderr) })

	Notify("server started")
	Flush()

	var payload struct {
		Text string `json:"text"`
	}
	if err := json.Unmarshal([]byte(gotBody), &payload); err != nil {
		t.Fatal(err)
	}
	if payload.Text != "server started" {
		t.Fatalf("payload = %#v", payload)
	}
}

func TestNotifyNilNoPanic(t *testing.T) {
	Install(io.Discard, nil)
	t.Cleanup(func() { log.SetOutput(os.Stderr) })
	Notify("server started")
	Flush()
}
