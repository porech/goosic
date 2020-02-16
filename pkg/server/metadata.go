package server

import (
	"github.com/gin-gonic/gin"
	"github.com/porech/goosic/v2/pkg/metadata"
	"net/http"
	"strconv"
)

func (s *HttpServer) editMetadata(c *gin.Context) {
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

	metadata.EditMetadata(song, song.Metadata)

	c.String(http.StatusOK, "ok")
}
