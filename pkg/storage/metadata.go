package storage

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
}
