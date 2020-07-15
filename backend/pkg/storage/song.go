package storage

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"path/filepath"
	"strings"
	"sync"
)

type Storage struct {
	SongList      []*Song
	SongListMutex sync.RWMutex
	Index         int
}

type Song struct {
	Id       int      `json:"id"`
	File     string   `json:"-"`
	FileName string   `json:"file_name"`
	Metadata Metadata `json:"metadata"`
}

func (s *Storage) GetSongById(id int) *Song {
	s.SongListMutex.RLock()
	defer s.SongListMutex.RUnlock()
	for _, song := range s.SongList {
		if song.Id == id {
			return song
		}
	}
	return nil
}

func (s *Storage) getSongIndex(path string) int {
	s.SongListMutex.RLock()
	defer s.SongListMutex.RUnlock()
	for index, song := range s.SongList {
		if song.File == path {
			return index
		}
	}
	return -1
}

func (s *Storage) GetSongByFile(file string) *Song {
	s.SongListMutex.RLock()
	defer s.SongListMutex.RUnlock()
	for _, song := range s.SongList {
		if song.File == file {
			return song
		}
	}
	return nil
}

func (s *Storage) UpdateSongMetadata(id int, metadata Metadata) error {
	song := s.GetSongById(id)
	if song == nil {
		return fmt.Errorf("song %d not found", id)
	}
	song.Metadata = metadata
	log.Infof("Updated metadata of song %s (%s - %s). There are %d songs.", song.File, song.Metadata.Artist, song.Metadata.Title, len(s.SongList))

	return nil
}

func (s *Storage) AddSong(song *Song) {
	existingSong := s.GetSongByFile(song.File)
	if existingSong != nil {
		log.Warnf("Song %s already exists!", song.File)
		return

	}
	song.Id = s.Index
	song.FileName = filepath.Base(song.File)
	s.SongListMutex.Lock()
	s.SongList = append(s.SongList, song)
	s.SongListMutex.Unlock()
	s.Index++
	log.Infof("Added song %s (%s - %s). There are %d songs.", song.File, song.Metadata.Artist, song.Metadata.Title, len(s.SongList))
}

func (s *Storage) RemoveSong(path string) error {
	index := s.getSongIndex(path)
	if index < 0 {
		return fmt.Errorf("song not found")
	}
	s.SongListMutex.Lock()
	s.SongList = append(s.SongList[:index], s.SongList[index+1:]...)
	s.SongListMutex.Unlock()
	log.Infof("Removed song %s. There are %d songs.", path, len(s.SongList))
	return nil
}

func (s *Storage) GetAllSongs() []*Song {
	s.SongListMutex.RLock()
	defer s.SongListMutex.RUnlock()
	return s.SongList
}

func (s *Storage) GetSongs(after, limit int) []*Song {
	var result []*Song
	s.SongListMutex.RLock()
	defer s.SongListMutex.RUnlock()
	for _, song := range s.SongList {
		if song.Id > after {
			result = append(result, song)
			if limit > 0 && len(result) >= limit {
				return result
			}
		}
	}
	return result
}

func stringContains(str string, query string) bool {
	return strings.Contains(strings.ToLower(str), strings.ToLower(query))
}

func search(song *Song, query string) bool {
	return stringContains(song.Metadata.Artist, query) ||
		stringContains(song.Metadata.Title, query) ||
		stringContains(song.FileName, query)
}

func (s *Storage) SearchSongs(query string, after, limit int) []*Song {
	var result []*Song
	s.SongListMutex.RLock()
	defer s.SongListMutex.RUnlock()
	for _, song := range s.SongList {
		if song.Id > after && search(song, query) {
			result = append(result, song)
			if limit > 0 && len(result) >= limit {
				return result
			}
		}
	}
	return result
}
