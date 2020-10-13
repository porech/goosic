package storage

import (
	"gorm.io/gorm"
	"time"
)

type Song struct {
	gorm.Model
	File       string        `json:"-"`
	FileName   string        `json:"file_name"`
	FileType   string        `json:"file_type"`
	Title      string        `json:"title"`
	AlbumID    int           `json:"-"`
	Album      Album         `json:"album"`
	ArtistID   int           `json:"-"`
	Artist     Artist        `json:"artist"`
	Genre      string        `json:"genre"`
	Year       int           `json:"year"`
	Track      int           `json:"track"`
	Length     time.Duration `json:"duration"`
	Bitrate    int           `json:"bitrate"`
	Channels   int           `json:"channels"`
	SampleRate int           `json:"sample_rate"`
}
