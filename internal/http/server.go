package http

import (
	"github.com/gin-gonic/gin"
)

func Run() error {
	router := gin.Default()
	InitializeRoutes(router)

	return router.Run()
}
