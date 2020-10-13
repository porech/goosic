package main

import (
	"github.com/porech/goosic/v2/pkg/index"
	"github.com/porech/goosic/v2/pkg/server"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
)

func main() {
	// Version is passed by the compiler
	var Version = "dev-build"

	log.Infof("goosic ver. %s is starting", Version)
	config := getConfig()

	store, err := storage.NewStore("test.db")
	if err != nil {
		log.Fatalf("cannot init store: %v", err)
	}

	log.Infof("Watching folder %s", config.MusicPath)
	log.Info("Please set the MUSIC_PATH environment variable to change the music path.")

	index.StartIndex(config.MusicPath, store)

	httpServer := server.HttpServer{store}
	log.Fatal(httpServer.StartServer(config.HttpHost, config.HttpPort, config.CorsOrigin))
}
