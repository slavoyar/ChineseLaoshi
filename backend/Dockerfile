# Build stage
FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /src

COPY backend ./backend

WORKDIR /src/backend

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# Runtime stage
FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /server ./server
COPY backend/migrations ./migrations

ENV DATA_DIR=/app/data/pg
ENV PORT=3000

EXPOSE 3000

CMD ["./server"]
