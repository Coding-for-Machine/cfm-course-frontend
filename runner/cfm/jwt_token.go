package main

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	SessionID   int    `json:"session_id"`
	TelegramID  int64  `json:"telegram_id"`
	PhoneNumber string `json:"phone_number"`
	Username    string `json:"username"`
	FullName    string `json:"full_name"`
	jwt.RegisteredClaims
}

func ValidateToken(tokenString string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&UserClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		},
	)

	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(*UserClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}

	return claims, nil
}
