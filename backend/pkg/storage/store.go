package storage

import (
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Store struct {
	db *gorm.DB
}

func NewStore(dbPath string) (*Store, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Migrate the schema
	err = db.AutoMigrate(&Artist{})
	if err != nil {
		return nil, err
	}
	err = db.AutoMigrate(&Album{})
	if err != nil {
		return nil, err
	}
	err = db.AutoMigrate(&Song{})
	if err != nil {
		return nil, err
	}

	return &Store{
		db: db,
	}, nil
}

func (s *Store) SongExists(file string) (bool, error) {
	res := s.db.Where("file = ?", file).Find(&Song{})
	if res.Error != nil {
		return false, res.Error
	}
	return res.RowsAffected > 0, nil
}

func (s *Store) AddSong(song *Song) error {
	res := s.db.Create(song)
	if res.Error != nil {
		return res.Error
	}

	log.Infof("Added song %s", song.File)
	return nil
}

func (s *Store) GetAllSongs() ([]*Song, error) {
	var songs []*Song
	res := s.db.Find(&songs)
	return songs, res.Error
}

func (s *Store) GetSongs(after, limit int) ([]*Song, error) {
	var songs []*Song
	res := s.db.Offset(after).Limit(limit).Find(&songs)
	return songs, res.Error
}

func (s *Store) SearchSongs(query string, after, limit int) ([]*Song, error) {
	var songs []*Song
	res := s.db.Where("artist.name LIKE %?%", query).Or("album.title LIKE %?%", query).Offset(after).Limit(limit).Find(&songs)
	return songs, res.Error
}

func (s *Store) GetSongById(id int) (*Song, error) {
	var song *Song
	res := s.db.Find(&song, id)
	return song, res.Error
}
