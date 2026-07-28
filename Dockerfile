# Build frontend
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# Build backend
FROM golang:1.25-alpine AS backend
RUN apk add --no-cache git ca-certificates
WORKDIR /src
COPY backend ./backend
WORKDIR /src/backend
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# Runtime: nginx (SPA + /api proxy) + Go API
FROM nginx:1.27-alpine
RUN apk add --no-cache ca-certificates tzdata su-exec \
  && adduser -D -u 1000 -h /home/app app \
  && mkdir -p /app/data /home/app \
  && chown -R app:app /app /home/app

WORKDIR /app

COPY --from=backend /server ./server
COPY backend/migrations ./migrations
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
  && chown -R app:app /app/server /app/migrations

ENV DATA_DIR=/app/data/pg
ENV PORT=3000
ENV NODE_ENV=production
ENV HOME=/home/app

EXPOSE 80
VOLUME ["/app/data"]

ENTRYPOINT ["/entrypoint.sh"]
