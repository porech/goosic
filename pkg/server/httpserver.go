package server

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
)

type HttpServer struct {
	Store *storage.Storage
}

func (s *HttpServer) StartServer(host string, port int) error {
	r := gin.Default()

	r.GET("/song-list", s.songList)
	r.GET("/song/:id", s.song)
	r.GET("/song-stream/:id", s.streamSong)

	listenAddr := fmt.Sprintf("%s:%d", host, port)
	log.Infof("Listening on %s", listenAddr)
	return r.Run(listenAddr)
}
