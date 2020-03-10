package server

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gobuffalo/packr/v2"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
)

type HttpServer struct {
	Store *storage.Storage
}

func PackrMiddleware(urlPrefix string, box *packr.Box) gin.HandlerFunc {
	fs := http.FileServer(box)
	return func(c *gin.Context) {
		if c.Request.URL.Path == "/" {
			index, err := box.Find("index.html")
			if err != nil {
				fs.ServeHTTP(c.Writer, c.Request)
				return
			}
			c.Writer.WriteHeader(200)
			c.Writer.Write(index)
			return
		}
		fs.ServeHTTP(c.Writer, c.Request)
	}
}

func (s *HttpServer) StartServer(host string, port int, corsOrigin string) error {
	r := gin.Default()

	if corsOrigin != "" {
		config := cors.DefaultConfig()
		config.AllowOrigins = []string{corsOrigin}
		r.Use(cors.New(config))
	}

	// Create the box for the frontend page
	box := packr.New("GreyGoosic", "../../greygoosic/build")

	r.Use(PackrMiddleware("/", box))
	r.GET("/song-list", s.songList)
	r.GET("/song/:id", s.song)
	r.GET("/song-stream/:id", s.streamSong)
	r.GET("/song-search/:query", s.songSearch)

	listenAddr := fmt.Sprintf("%s:%d", host, port)
	log.Infof("Listening on %s", listenAddr)
	return r.Run(listenAddr)
}
