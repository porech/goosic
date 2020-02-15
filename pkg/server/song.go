package server

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func (s *HttpServer) songList(c *gin.Context) {
	c.JSON(http.StatusOK, s.Store.GetAllSongs())
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
