package storage

import "gorm.io/gorm"

type Artist struct {
	gorm.Model
	Name string
}
