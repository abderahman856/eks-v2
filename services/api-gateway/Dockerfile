FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o api-gateway .

FROM alpine:3.22 AS user

RUN addgroup -S appgroup

RUN adduser -S appuser -G appgroup

FROM gcr.io/distroless/static-debian12

WORKDIR /app

COPY --from=user /etc/passwd /etc/passwd
COPY --from=user /etc/group /etc/group

COPY --from=builder /app/api-gateway .

USER appuser:appgroup

EXPOSE 8080

ENTRYPOINT ["/app/api-gateway"]