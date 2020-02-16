package main

import "github.com/spf13/viper"

type GoosicConf struct {
	HttpHost   string
	HttpPort   int
	MusicPath  string
	CorsOrigin string
}

func setDefaults() {
	viper.AutomaticEnv()
	viper.SetDefault("HTTP_HOST", "127.0.0.1")
	viper.SetDefault("HTTP_PORT", 8080)
	viper.SetDefault("MUSIC_PATH", "/mnt/c/Temp/TestMusic")
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
