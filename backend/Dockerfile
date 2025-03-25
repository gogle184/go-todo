FROM golang:1.24.0-alpine

WORKDIR /backend

COPY . .

RUN go mod download
RUN go install github.com/air-verse/air@latest
RUN go install github.com/swaggo/swag/cmd/swag@latest

COPY .air.toml .

CMD ["air"]
