package storage

import (
	"github.com/dhowden/tag"
	"github.com/wtolson/go-taglib"
	"os"
	"time"
)

type Metadata struct {
	FileType    string `json:"file_type"`
	Title       string `json:"title"`
	Album       string `json:"album"`
	Artist      string `json:"artist"`
	AlbumArtist string `json:"album_artist"`
	Composer    string `json:"composer"`
	Genre       string `json:"genre"`
	Year        int    `json:"year"`

	Track       int `json:"track"`
	TotalTracks int `json:"total_tracks"`
	Disc        int `json:"disc"`
	TotalDiscs  int `json:"total_discs"`

	Lyrics  string `json:"lyrics"`
	Comment string `json:"comment"`

	Length     time.Duration `json:"duration"`
	Bitrate    int           `json:"bitrate"`
	Channels   int           `json:"channels"`
	SampleRate int           `json:"sample_rate"`
}

func ParseMetadata(filePath string, file *os.File) (*Metadata, error) {
	// First, get the metadata from TagLib, that returns less complete
	// metadata but supports more files
	tagLibMeta, err := taglib.Read(filePath)
	if err != nil {
		return nil, err
	}
	defer tagLibMeta.Close()
	metadata := parseTaglibMetadata(tagLibMeta)

	// Then, if the file is supported by dhowden, add his info
	dhowdenMeta, err := tag.ReadFrom(file)
	if err == nil {
		dhowdenTags := parseDhowdenMetadata(dhowdenMeta)
		metadata.FileType = dhowdenTags.FileType
		metadata.AlbumArtist = dhowdenTags.AlbumArtist
		metadata.Composer = dhowdenTags.Composer
		metadata.TotalTracks = dhowdenTags.TotalTracks
		metadata.Disc = dhowdenTags.Disc
		metadata.TotalDiscs = dhowdenTags.TotalDiscs
		metadata.Lyrics = dhowdenTags.Lyrics
	}

	return &metadata, nil
}

func parseTaglibMetadata(tagFile *taglib.File) Metadata {
	return Metadata{
		Title:      tagFile.Title(),
		Album:      tagFile.Album(),
		Artist:     tagFile.Artist(),
		Genre:      tagFile.Genre(),
		Year:       tagFile.Year(),
		Track:      tagFile.Track(),
		Comment:    tagFile.Comment(),
		Bitrate:    tagFile.Bitrate(),
		Channels:   tagFile.Channels(),
		Length:     tagFile.Length(),
		SampleRate: tagFile.Samplerate(),
	}
}

func parseDhowdenMetadata(meta tag.Metadata) Metadata {
	track, totalTracks := meta.Track()
	disc, totalDiscs := meta.Disc()

	return Metadata{
		FileType:    string(meta.FileType()),
		Title:       meta.Title(),
		Album:       meta.Album(),
		Artist:      meta.Artist(),
		AlbumArtist: meta.AlbumArtist(),
		Composer:    meta.Composer(),
		Genre:       meta.Genre(),
		Year:        meta.Year(),
		Track:       track,
		TotalTracks: totalTracks,
		Disc:        disc,
		TotalDiscs:  totalDiscs,
		Lyrics:      meta.Lyrics(),
		Comment:     meta.Comment(),
	}
}
