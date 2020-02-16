package server

import (
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
		list = s.Store.GetAllSongs()
	} else {
		list = s.Store.GetSongs(after, limit)
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

	c.JSON(http.StatusOK, s.Store.SearchSongs(query, after, limit))
}

func (s *HttpServer) song(c *gin.Context) {
	songIdStr := c.Param("id")
	songId, err := strconv.Atoi(songIdStr)
	if err != nil {
		c.String(http.StatusBadRequest, "cannot parse index")
		return
	}

	song := s.Store.GetSongById(songId)
	if song == nil {
		c.String(http.StatusNotFound, "song not found")
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

	song := s.Store.GetSongById(songId)
	if song == nil {
		c.String(http.StatusNotFound, "song not found")
	}

	c.File(song.File)
}
