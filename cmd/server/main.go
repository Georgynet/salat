package main

import (
	"log"

	"github.com/DevPulseLab/salat/internal/http"
)

func main() {
	if err := http.Run(); err != nil {
		log.Fatalln(err)
	}
}
