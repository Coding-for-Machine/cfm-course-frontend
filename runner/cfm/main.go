package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	websocket "runner/internal/websoket"
	"runtime"
	"sync"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

// =========================
// JWT SECRET
// =========================
var jwtSecret = []byte("asadbek20020107asdfghjkl")

// =========================
// CLIENT
// =========================
type Client struct {
	Conn   *websocket.Conn
	UserID int64
	Room   *Room
}

// =========================
// ROOM
// =========================
type Room struct {
	Slug    string
	Clients map[*Client]bool
	Mutex   sync.RWMutex
}

func NewRoom(slug string) *Room {
	return &Room{
		Slug:    slug,
		Clients: make(map[*Client]bool),
	}
}

func (r *Room) Broadcast(message []byte) {
	r.Mutex.RLock()
	defer r.Mutex.RUnlock()

	for client := range r.Clients {
		err := client.Conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			client.Conn.Close()
			r.RemoveClient(client)
		}
	}
}

func (r *Room) AddClient(c *Client) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	r.Clients[c] = true
}

func (r *Room) RemoveClient(c *Client) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	delete(r.Clients, c)
}

// =========================
// ROOM MANAGER
// =========================
var (
	rooms = make(map[string]*Room)
	roomM sync.RWMutex
)

func GetRoom(slug string) *Room {
	roomM.Lock()
	defer roomM.Unlock()

	if room, ok := rooms[slug]; ok {
		return room
	}

	room := NewRoom(slug)
	rooms[slug] = room
	return room
}

// =========================
// MIDDLEWARE
// =========================
func WebSocketAuthMiddleware(c fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		tokenString := c.Query("token")
		if tokenString == "" {
			return fiber.ErrUnauthorized
		}

		userID, err := ValidateToken(tokenString)
		if err != nil {
			return fiber.ErrUnauthorized
		}

		c.Locals("user", userID)
	}

	return c.Next()
}

// =========================
// MAIN
// =========================
func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin, Content-Type, Accept"},
		AllowMethods: []string{"GET, POST, PUT, DELETE"},
	}))

	// Middleware faqat /ws route uchun ishlaydi
	app.Get("/ws/:slug",
		WebSocketAuthMiddleware,
		websocket.New(WebSocketHandler, websocket.Config{
			HandshakeTimeout:  5 * time.Second,
			ReadBufferSize:    4 * 1024,
			WriteBufferSize:   4 * 1024,
			EnableCompression: false,
		}),
	)

	// Graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Fatal(app.Listen(":3000"))
	}()

	<-ctx.Done()
	log.Println("Graceful shutdown...")

	// Close all clients in all rooms
	roomM.Lock()
	for _, room := range rooms {
		room.Mutex.Lock()
		for client := range room.Clients {
			client.Conn.WriteMessage(websocket.TextMessage, []byte("Server shutting down"))
			client.Conn.Close()
		}
		room.Mutex.Unlock()
	}
	roomM.Unlock()

	app.Shutdown()
}
