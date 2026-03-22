package main

import (
    "log"

    "github.com/gofiber/fiber/v3"
)

func main() {
    // Initialize a new Fiber app
    app := fiber.New(fiber.Config{
        ErrorHandler: func(c fiber.Ctx, err error) error {
            code := fiber.StatusInternalServerError
            if e, ok := err.(*fiber.Error); ok {
                code = e.Code
            }
            return c.Status(code).JSON(fiber.Map{
                "status":  "error",
                "message": err.Error(),
            })
        },
    })
	 // 1. Middleware (Production uchun shart)
    app.Use(logger.New())  // Har bir request logini chiqaradi
    app.Use(recover.New()) // Server crash bo'lishini oldini oladi


    // Define a route for the GET method on the root path '/'
    app.Get("/", func(c fiber.Ctx) error {
        // Send a string response to the client
        return c.SendString("Hello, World 👋!")
    })

    go func() {
        if err := app.Listen(":3000"); err != nil {
            log.Panic(err)
        }
    }()
    c := make(chan os.Signal, 1)
    signal.Notify(c, os.Interrupt, syscall.SIGTERM)
    <-c // Signal kelganda to'xtaydi

    log.Println("Server to'xtatilmoqda...")
    _ = app.Shutdown() // Hamma so'rovlar tugashini kutadi
}


	
// Response body
/*
[
  {
    "title": "Matematika",
    "slug": "matematika",
    "image": "http://localhost:9000/cfm/media/course/images/cfm.jpg",
    "is_enrolled": false
  },
  {
    "title": "python",
    "slug": "python",
    "image": "http://localhost:9000/cfm/media/course/images/photo_2026-03-16_13-09-34.jpg",
    "is_enrolled": false
  }
]
*/
type Courses struct {
	title string `json:"title"`,
	slug string	`json:"slug"`,
	image string `json:"image"`
	is_enrolled bool `json:"is_enrolled"`
}
func GetCourses(c fiber.Ctx) error {
	return 
}