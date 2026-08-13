# Chinese Laoshi

## Overview
Chinese Laoshi is a comprehensive Chinese language learning application designed to help users master Mandarin through interactive flashcards. The app is equipped with two regimes: Handwriting and Translation Guessing. Users can create custom cards, review new words, and learn through engaging exercises. The application is built using React and Go, and is available on phone, tablet, and desktop browsers.

## Features
- **Handwriting Regime**: Practice writing Chinese characters using touch or mouse input.
- **Translation Guessing Regime**: Test your knowledge by guessing the correct translation of Chinese words.
- **Custom Card Creation**: Create your own flashcards by providing transcription, selecting the appropriate Chinese character, and adding the translation.
- **Review System**: New words must be reviewed and approved before they are added to the learning cards database.
- **Multi-Platform Support**: Accessible on phones, tablets, and desktop browsers.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Backend**: Go, PostgreSQL

## Development

See [DEV.md](DEV.md) for instructions on running the backend and frontend locally.

## Production

Live URL: **https://chineselaoshi.slavoyar.tech**

### Deploy

- **Pull request** to `production`: lint + frontend build only (no image push).
- **Push** to `production` (or manual run on that branch): lint + frontend build, then push `ghcr.io/<owner>/chineselaoshi:latest` and `:sha-<commit>`, then Coolify webhook.

Required GitHub Actions secrets: `COOLIFY_WEBHOOK`, `COOLIFY_TOKEN`, `GOOGLE_CLIENT_ID`. Configure application runtime environment in Coolify (not in this workflow). For ERROR log Telegram notifies, set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `TELEGRAM_RELAY_BASE`. If Coolify should always pull, include `force=true` in the webhook URL secret.

## Contact
For questions or suggestions, please reach out to slavoyarmc@gmail.com.
