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

	store := storage.Storage{}

	index.StartIndex(config.MusicPath, &store)

	httpServer := server.HttpServer{&store}
	log.Fatal(httpServer.StartServer(config.HttpHost, config.HttpPort, config.CorsOrigin))
}
