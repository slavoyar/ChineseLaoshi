#!/bin/sh
set -e

mkdir -p "$DATA_DIR"
chown -R app:app /app/data /home/app

su-exec app ./server &
server_pid=$!

# Wait until the API accepts connections (embedded Postgres can take a few seconds).
# A 403 from the origin gate still means the process is up.
i=0
while [ "$i" -lt 90 ]; do
  out=$(wget -S -O /dev/null "http://127.0.0.1:${PORT:-3000}/api/groups" 2>&1 || true)
  if echo "$out" | grep -qE 'HTTP/1\.[01] (200|401|403|404)'; then
    break
  fi
  if ! kill -0 "$server_pid" 2>/dev/null; then
    echo "backend exited before becoming ready" >&2
    wait "$server_pid" || true
    exit 1
  fi
  i=$((i + 1))
  sleep 1
done

nginx -g 'daemon off;' &
nginx_pid=$!

term() {
  kill -TERM "$server_pid" "$nginx_pid" 2>/dev/null || true
  wait "$server_pid" "$nginx_pid" 2>/dev/null || true
}
trap term TERM INT

while kill -0 "$server_pid" 2>/dev/null && kill -0 "$nginx_pid" 2>/dev/null; do
  sleep 1
done

term
exit 1
