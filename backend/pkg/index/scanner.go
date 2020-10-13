package index

import (
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
	"os"
	"path/filepath"
)

func ScanFile(path string, store *storage.Store) error {
	exists, err := store.SongExists(path)
	if err != nil {
		return fmt.Errorf("cannot check if song exists: %v", err)
	}
	if exists {
		return fmt.Errorf("song %s already exists", path)
	}

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// TODO: mark the song as not-existing?
		return fmt.Errorf("file %s was removed", path)
	}

	f, err := os.Open(path)
	if err != nil {
		// Ignore the error opening file, since it could be still in write process
		return nil
	}
	defer f.Close()

	metadata, err := storage.ParseMetadata(path, f)
	if err != nil {
		return fmt.Errorf("File %s was not recognized: %v", path, err)
	}

	return store.AddSong(&storage.Song{
		File:     path,
		FileName: filepath.Base(path),
		FileType: metadata.FileType,
		Title:    metadata.Title,
		Album: storage.Album{
			Title: metadata.Album,
		},
		Artist: storage.Artist{
			Name: metadata.Artist,
		},
		Genre:      metadata.Genre,
		Year:       metadata.Year,
		Track:      metadata.Track,
		Length:     metadata.Length,
		Bitrate:    metadata.Bitrate,
		Channels:   metadata.Channels,
		SampleRate: metadata.SampleRate,
	})
}

func ScanDirectory(basePath string, store *storage.Store) {
	err := filepath.Walk(basePath, func(path string, info os.FileInfo, err error) error {
		if path == basePath {
			return nil
		}
		if info.IsDir() {
			ScanDirectory(path, store)
			return nil
		}
		err = ScanFile(path, store)
		if err != nil {
			log.Warn(err)
		}
		return nil
	})
	if err != nil {
		log.Errorf("Cannot scan %s: %v", basePath, err)
	}
}

func StartWatcher(path string, store *storage.Store) {
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
				err = ScanFile(event.Name, store)
				if err != nil {
					log.Warn(err)
				}
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

func StartIndex(path string, store *storage.Store) {
	log.Info("Starting index")
	go ScanDirectory(path, store)
	go StartWatcher(path, store)
}
