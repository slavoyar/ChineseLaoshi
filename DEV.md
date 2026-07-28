# Local Development

This guide covers running the Go backend and React frontend together for local testing.

## Prerequisites

- **Go 1.24+**
- **Node.js 23+** and npm
- **tygo** (optional, for regenerating TypeScript types from Go DTOs):
  ```bash
  go install github.com/gzuidhof/tygo@latest
  ```

## Quick start

Use two terminals from the repository root.

### Terminal 1 — Backend

```bash
npm run dev:backend
```

- API listens on **http://localhost:3000**
- If `DB_URL` is not set, an embedded Postgres instance starts on port **5433**
- Database files are stored in `./data/pg` (relative to where you run the command)
- Migrations run automatically on startup

### Terminal 2 — Frontend

```bash
npm run dev:frontend
```

- Vite dev server runs at **http://localhost:5173** (default)
- All `/api/*` requests are proxied to `http://localhost:3000`

Open **http://localhost:5173** in your browser.

## Environment variables

### Backend

Copy `backend/.env.example` to `backend/.env` and fill in values. `npm run dev:backend` loads that file automatically (existing process env vars still win).

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP listen port |
| `DB_URL` | *(empty)* | External Postgres connection string. Leave empty to use embedded Postgres. |
| `DATA_DIR` | `./data/pg` | Data directory for embedded Postgres |
| `EMBEDDED_PG_PORT` | `5433` | Port for embedded Postgres |
| `TEMPLATE_USER_EMAIL` | `demo-template@chineselaoshi.local` | Demo template user (anonymous reads + clone source). `DEFAULT_USER_EMAIL` is still accepted as a fallback. |
| `GOOGLE_CLIENT_ID` | *(required)* | Google OAuth Web Client ID (audience for ID token verification) |
| `JWT_SECRET` | *(required)* | Secret used to sign the httpOnly session cookie JWT |
| `COOKIE_SECURE` | `true` when `NODE_ENV=production` | Set `false` for local http |
| `SESSION_TTL_HOURS` | `168` (7 days) | Session cookie lifetime |
| `ALLOWED_ORIGINS` | non-prod: `http://localhost:5173`, `http://127.0.0.1:5173`; production: *(empty = reject all)* | Origins allowed for **all** `/api` requests (Origin/Referer). Always set explicitly in production. |
| `NODE_ENV` | *(empty)* | `production` enables secure cookies and disables localhost origin defaults. `test` disables request logging. |

> **Security:** The Vite dev proxy must target the **local** backend only (`http://localhost:3000`). Do not proxy local frontend traffic to production — production rejects non-allowlisted origins (including localhost).

### Frontend

Create or edit `frontend/.env.development`:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | *(required)* | Same Google Web Client ID as backend `GOOGLE_CLIENT_ID` |

> **Note:** Anonymous users read the demo template. Mutations require Google SSO. The session is an httpOnly cookie (`cl_session`) set by `POST /api/auth/google`.

## Regenerating API types

After changing Go DTOs in `backend/internal/dto/`:

```bash
npm run generate:types
```

This runs `tygo generate` and writes TypeScript interfaces to `frontend/src/shared/api/generated/index.ts`.

## Smoke test checklist

1. Open the frontend — groups list loads from the backend (empty on first run)
2. Create a group
3. Rename a group
4. Open a group — cards load
5. Add a word card
6. Start a write-practice session
7. Delete a card
8. Delete a group

## Troubleshooting

**Backend fails to start (port in use)**  
Change `PORT` or stop the process using port 3000.

**Embedded Postgres issues**  
Delete `./data/pg` and restart the backend to reset the local database.

**Frontend shows network errors**  
Ensure the backend is running on port 3000 before starting the frontend.

**Empty groups after restart**  
Expected with a fresh embedded database. Create groups and cards through the UI.

## Other commands

```bash
# Lint frontend
npm run lint

# Build frontend for production
cd frontend && npm run build

# Run backend tests
cd backend && go test ./...
```

