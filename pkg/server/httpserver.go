package server

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
)

type HttpServer struct {
	Store *storage.Storage
}

func (s *HttpServer) StartServer(host string, port int, corsOrigin string) error {
	r := gin.Default()

	if corsOrigin != "" {
		config := cors.DefaultConfig()
		config.AllowOrigins = []string{corsOrigin}
		r.Use(cors.New(config))
	}

	r.GET("/song-list", s.songList)
	r.GET("/song/:id", s.song)
	r.GET("/song-stream/:id", s.streamSong)
	r.GET("/song-search/:query", s.songSearch)

	listenAddr := fmt.Sprintf("%s:%d", host, port)
	log.Infof("Listening on %s", listenAddr)
	return r.Run(listenAddr)
}
