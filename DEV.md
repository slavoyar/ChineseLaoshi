# Local Development

This guide covers running the Go backend and the Next.js site (marketing + study) together for local testing.

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

### Terminal 2 — Web (marketing + study)

```bash
npm run dev:web
```

- Next.js runs at **http://localhost:3001**
- Marketing: `/`, `/about`, feature pages
- Study app: **http://localhost:3001/app** (React Router, FSD under `web/src/study`)
- In development, `/api/*` is rewritten to `http://localhost:3000`

Open **http://localhost:3001/app** for the study app and **http://localhost:3001** for marketing.

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
| `ALLOWED_ORIGINS` | non-prod: `http://localhost:3001`, `http://127.0.0.1:3001`; production: *(empty = reject all)* | Origins allowed for **all** `/api` requests (Origin/Referer). Always set explicitly in production. Local Google OAuth must also list `http://localhost:3001` as an authorized JavaScript origin. |
| `NODE_ENV` | *(empty)* | `production` enables secure cookies and disables localhost origin defaults. `test` disables request logging. |
| `TELEGRAM_BOT_TOKEN` | *(empty)* | Optional. BotFather token for admin ERROR notify. Empty = stderr-only logs (no Telegram). |
| `TELEGRAM_MINIAPP_BOT_TOKEN` | *(empty)* | Optional. Public Mini App bot token for Telegram `initData` HMAC verification. Separate from notify bot. |
| `TELEGRAM_CHAT_ID` | *(empty)* | Optional. Destination chat. Empty = no Telegram. |
| `TELEGRAM_RELAY_BASE` | *(empty)* | `https://` base of the Telegram Caddy relay. Required together with notify token and chat. HTTP is rejected. Do not call `api.telegram.org` from the app host. Telegram Bot API puts the token in the URL path; configure the relay so access logs do not record `/bot*` URLs. |

> **Security:** The Next `/api` rewrite must target the **local** backend only (`http://localhost:3000`). Do not proxy local frontend traffic to production — production rejects non-allowlisted origins (including localhost).

### Web

Create or edit `web/.env.development`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | *(required)* | Same Google Web Client ID as backend `GOOGLE_CLIENT_ID` |

> **Note:** Anonymous users read the demo template. Mutations require Google SSO. The session is an httpOnly cookie (`cl_session`) set by `POST /api/auth/google`.

## Regenerating API types

After changing Go DTOs in `backend/internal/dto/`:

```bash
npm run generate:types
```

This runs `tygo generate` and writes TypeScript interfaces to `web/src/study/shared/api/generated/index.ts`.

## Smoke test checklist

1. Open the study app at `/app` — groups list loads from the backend (empty on first run)
2. Create a group
3. Rename a group
4. Open a group — cards load
5. Add a word
6. Start a translation quiz
7. Marketing `/` and `/about` still render
