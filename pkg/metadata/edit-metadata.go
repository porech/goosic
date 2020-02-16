package metadata

import (
	"fmt"
	"github.com/porech/goosic/v2/pkg/storage"
)

func EditMetadata(song *storage.Song, newMeta storage.Metadata) error {
	switch song.Metadata.FileType {
	case "FLAC":
		return EditMetadataFLAC(song, newMeta)
	default:
		return fmt.Errorf("metadata editing not supported for %s format", song.Metadata.FileType)
	}
}
