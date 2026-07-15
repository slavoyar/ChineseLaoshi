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

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP listen port |
| `DB_URL` | *(empty)* | External Postgres connection string. Leave empty to use embedded Postgres. |
| `DATA_DIR` | `./data/pg` | Data directory for embedded Postgres |
| `EMBEDDED_PG_PORT` | `5433` | Port for embedded Postgres |
| `DEFAULT_USER_EMAIL` | `slavoyar@mail.com` | Email of the stub-authenticated user |
| `NODE_ENV` | *(empty)* | Set to `test` to disable request logging |

### Frontend

Create or edit `frontend/.env.development`:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_INITIAL_AUTH` | `demo` | Initial auth UI state: `demo` (unsigned in) or `authenticated` |

> **Note:** The backend uses stub authentication and always serves requests as `DEFAULT_USER_EMAIL`. The frontend auth UI (sign-in dialog, demo gate) is cosmetic only and does not affect API authorization.

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
