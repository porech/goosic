package storage

import "gorm.io/gorm"

type Album struct {
	gorm.Model
	Title string
}
