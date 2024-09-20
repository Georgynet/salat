package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(router *gin.Engine) {
	router.GET("/api/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, "pong")
	})
}
