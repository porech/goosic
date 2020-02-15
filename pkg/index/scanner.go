package index

import (
	"github.com/dhowden/tag"
	"github.com/fsnotify/fsnotify"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
	"os"
	"path/filepath"
)

func ScanFile(path string, store *storage.Storage) error {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return store.RemoveSong(path)
	}
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	metadata, err := tag.ReadFrom(f)
	if err != nil {
		return err
	}

	store.AddSong(&storage.Song{
		File: path,
		Metadata: storage.ParseMetadata(metadata),
	})

	return nil
}

func ScanDirectory(basePath string, store *storage.Storage) {
	err := filepath.Walk(basePath, func(path string, info os.FileInfo, err error) error {
		if path == basePath {
			return nil
		}
		if info.IsDir() {
			ScanDirectory(path, store)
			return nil
		}
		err = ScanFile(path, store)
		return err
	})
	if err != nil {
		log.Errorf("Cannot scan %s: %v", basePath, err)
	}
}

func StartWatcher(path string, store *storage.Storage) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Error(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				_ = ScanFile(event.Name, store)
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	err = watcher.Add(path)
	if err != nil {
		log.Error(err)
	}
	<-done
}

func StartIndex(path string, store *storage.Storage) {
	log.Info("Starting index")
	go ScanDirectory(path, store)
	go StartWatcher(path, store)
}
