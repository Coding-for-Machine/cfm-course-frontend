package main

import (
	"log"
	websocket "runner/internal/websoket"
)

type MessageType struct {
	Type    string //
	payload interface{}
}

func WebSocketHandler(conn *websocket.Conn) {
	defer conn.Close()

	slug := conn.Params("slug")

	claims := conn.Locals("user").(*UserClaims)

	room := GetRoom(slug)

	client := &Client{
		Conn:   conn,
		UserID: claims.TelegramID,
		Room:   room,
	}

	room.AddClient(client)
	defer room.RemoveClient(client)

	log.Println("User joined:", claims.Username, "Room:", slug)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// Broadcast to room
		log.Println(message)
		room.Broadcast(message)
	}

	log.Println("User left:", claims.Username)
}
