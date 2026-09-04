# CI/CD

Pipelines for the `production` branch. Pull requests target `production`; merge triggers deploy on push.

## Overview

```text
PR → production
  CI — Frontend / check     (lint + Vite build + Next web build)
  CI — Frontend / e2e       (Playwright; needs check)
  CI — Backend / test       (only if backend/** or generated types changed)
  CI — Backend / build      (needs test; same path filter)

Push → production
  … same CI jobs …
  Deploy — Production / deploy   (after CI — Frontend succeeds on push)

Manual
  Migrate — Manual / migrate     (workflow_dispatch only)
```

Production database migrations normally run **on server startup** (`backend/internal/db/db.go` → `runMigrations`). The migrate workflow is for manual/ops use against `DB_URL`.

## Workflows

| File | Name | When |
| --- | --- | --- |
| [`ci-frontend.yml`](workflows/ci-frontend.yml) | CI — Frontend | Every PR and push to `production` |
| [`ci-backend.yml`](workflows/ci-backend.yml) | CI — Backend | PR/push to `production` when `backend/**` or generated API types change |
| [`deploy.yml`](workflows/deploy.yml) | Deploy — Production | After **CI — Frontend** completes successfully on a **push** to `production` |
| [`migration.yml`](workflows/migration.yml) | Migrate — Manual | Manual trigger only |

### CI — Frontend

- **`check`** — `npm run lint`, `npm run build` in `frontend/` and `web/`
- **`e2e`** — Playwright tests (starts embedded backend + Vite `/app` + Next `:3001`)

### CI — Backend

- **`test`** — tygo generated-types check, `go test` with coverage gate
- **`build`** — `go build ./cmd/server` (compile-only)

### Deploy — Production

- Builds and pushes Docker image to GHCR
- Triggers Coolify webhook
- Checkouts the exact commit that passed Frontend CI (`workflow_run.head_sha`)

## Branch protection (production)

Update required status checks in **Settings → Branches → production**:

| Remove (legacy) | Add |
| --- | --- |
| `Lint, build and test frontend / lint-and-build` | `CI — Frontend / check` |
| (if configured) | `CI — Frontend / e2e` |
| `Lint, build and test backend / lint-build-and-test` | `CI — Backend / test` |
| — | `CI — Backend / build` |

**Do not** require `Deploy — Production` on PRs — it only runs after merge/push.

**Path-filtered backend checks:** When a PR touches only frontend files, Backend CI is skipped. GitHub treats skipped required checks as passing in most setups; if frontend-only PRs are blocked, mark backend checks as optional or adjust rulesets.

## Local parity

```bash
npm run lint
cd frontend && npm run build
cd ../web && npm run build
CI=1 JWT_SECRET=e2e-ci-jwt-secret GOOGLE_CLIENT_ID=e2e-google-client-id COOKIE_SECURE=false npm run test:e2e --workspace=@chinese-laoshi/frontend
cd backend && go test ./... -count=1 -p 1 && go build -o /dev/null ./cmd/server
```
