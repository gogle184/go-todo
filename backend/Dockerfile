FROM golang:1.24.0-alpine

WORKDIR /app

COPY . .

RUN go mod download
RUN go install github.com/air-verse/air@latest
RUN go install github.com/swaggo/swag/cmd/swag@latest

COPY .air.toml .

CMD ["air"]
