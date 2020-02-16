package metadata

import (
	"github.com/go-flac/go-flac"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
)

func EditMetadataFLAC(song *storage.Song, newMeta storage.Metadata) error {
	f, err := flac.ParseFile(song.File)
	if err != nil {
		return err
	}

	for _, meta := range f.Meta {
		log.Infof("%+v", *meta)
	}

	return nil
}
