FROM golang:1.22-alpine

WORKDIR /app

# Kutubxonalarni yuklash
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Ilovani yig'ish
RUN go build -o main .

EXPOSE 3000

CMD ["./main"]

