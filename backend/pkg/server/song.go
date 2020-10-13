package server

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/porech/goosic/v2/pkg/storage"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

func (s *HttpServer) songList(c *gin.Context) {
	limitStr := c.Query("limit")
	afterStr := c.Query("after")
	limit := 0
	after := -1
	var err error
	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			log.Warnf("Cannot parse limit: %v", err)
			c.String(http.StatusBadRequest, "cannot parse limit")
			return
		}
	}
	if afterStr != "" {
		after, err = strconv.Atoi(afterStr)
		if err != nil {
			log.Warnf("Cannot parse after: %v", err)
			c.String(http.StatusBadRequest, "cannot parse after")
			return
		}
	}
	var list []*storage.Song

	if limit == 0 && after == -1 {
		list, err = s.Store.GetAllSongs()
	} else {
		list, err = s.Store.GetSongs(after, limit)
	}
	if err != nil {
		log.Errorf("cannot get songs: %v", err)
		c.AbortWithStatus(500)
		return
	}

	c.JSON(http.StatusOK, list)
}

func (s *HttpServer) songSearch(c *gin.Context) {
	limitStr := c.Query("limit")
	afterStr := c.Query("after")
	query := c.Param("query")
	limit := 0
	after := -1
	var err error
	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			log.Warnf("Cannot parse limit: %v", err)
			c.String(http.StatusBadRequest, "cannot parse limit")
			return
		}
	}
	if afterStr != "" {
		after, err = strconv.Atoi(afterStr)
		if err != nil {
			log.Warnf("Cannot parse after: %v", err)
			c.String(http.StatusBadRequest, "cannot parse after")
			return
		}
	}

	songs, err := s.Store.SearchSongs(query, after, limit)
	if err != nil {
		log.Errorf("cannot get songs from db: %v", err)
		c.AbortWithStatus(500)
		return
	}

	c.JSON(http.StatusOK, songs)
}

func (s *HttpServer) song(c *gin.Context) {
	songIdStr := c.Param("id")
	songId, err := strconv.Atoi(songIdStr)
	if err != nil {
		c.String(http.StatusBadRequest, "cannot parse index")
		return
	}

	song, err := s.Store.GetSongById(songId)
	if err != nil {
		fmt.Errorf("cannot get song from db: %v", err)
		c.AbortWithStatus(500)
		return
	}
	if song == nil {
		c.String(http.StatusNotFound, "song not found")
		return
	}

	c.JSON(http.StatusOK, song)
}

func (s *HttpServer) streamSong(c *gin.Context) {
	songIdStr := c.Param("id")
	songId, err := strconv.Atoi(songIdStr)
	if err != nil {
		c.String(http.StatusBadRequest, "cannot parse index")
		return
	}

	song, err := s.Store.GetSongById(songId)
	if err != nil {
		fmt.Errorf("cannot get song from db: %v", err)
		c.AbortWithStatus(500)
		return
	}
	if song == nil {
		c.String(http.StatusNotFound, "song not found")
		return
	}

	c.File(song.File)
}
