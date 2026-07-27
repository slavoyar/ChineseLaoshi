#!/usr/bin/env bash
set -eu

THRESHOLD=80
PACKAGES=(
  "./internal/service/..."
  "./internal/auth/..."
  "./internal/repository/..."
)

failed=0
echo "Coverage summary (minimum ${THRESHOLD}%)"
echo "----------------------------------------"

for pkg in "${PACKAGES[@]}"; do
  go test "$pkg" -coverprofile=coverage.out -count=1
  pct=$(go tool cover -func=coverage.out | awk '/^total:/ {print $3}' | tr -d '%')
  pct_int=${pct%.*}
  status="OK"
  if (( pct_int < THRESHOLD )); then
    status="FAIL"
    failed=1
  fi
  printf "%-40s %6s%%  %s\n" "$pkg" "$pct" "$status"
done

echo "----------------------------------------"
if (( failed )); then
  echo "Coverage check failed: one or more packages below ${THRESHOLD}%"
  exit 1
fi
echo "Coverage check passed"
