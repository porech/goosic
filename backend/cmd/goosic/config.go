package main

import "fmt"
import "os"
import "github.com/spf13/viper"

type GoosicConf struct {
	HttpHost   string
	HttpPort   int
	MusicPath  string
	CorsOrigin string
}

func setDefaults() {
	home, _ := os.UserHomeDir()
	viper.AutomaticEnv()
	viper.SetDefault("HTTP_HOST", "127.0.0.1")
	viper.SetDefault("HTTP_PORT", 8080)
	viper.SetDefault("MUSIC_PATH", fmt.Sprintf("%s/Music", home))
}

func getConfig() *GoosicConf {
	setDefaults()
	return &GoosicConf{
		HttpHost:   viper.GetString("HTTP_HOST"),
		HttpPort:   viper.GetInt("HTTP_PORT"),
		MusicPath:  viper.GetString("MUSIC_PATH"),
		CorsOrigin: viper.GetString("CORS_ORIGIN"),
	}
}
