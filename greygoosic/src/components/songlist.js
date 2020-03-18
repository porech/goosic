import React from "react";
import "./songlist.css";
import Song from "./song";
import goosic from "../goosic";
class SongList extends React.Component {
  constructor() {
    super();
    this.state = { songs: [] };
  }
  async componentDidMount() {
    //ottengo la lista canzoni
    let songList = await goosic.get("/song-list");
    //setto lo state di conseguenza
    this.setState({
      songs: songList || [
        {
          id: 1,
          title: "Back Home",
          artist: "Ale&Ale'x",
          album: "The very best of Ale&Ale'x - Youth",
          filePath: "/Users/xela92/Music/back home.mp3"
        },
        {
          id: 2,
          title: "Bambino",
          artist: "Ale&Ale'x",
          album: "The very best of Ale&Ale'x - Youth",
          filePath: "/Users/xela92/Music/bambino.mp3"
        }
      ]
    });
  }
  getFileNameFromPath(filePath) {
    return filePath.split("/")[filePath.split("/").length - 1];
  }
  render() {
    return (
      <div className="song-list">
        {this.state.songs.map(song => {
          return (
            <Song
              key={song.id}
              title={
                song.title ||
                this.getFileNameFromPath(song.filePath) ||
                "Unknown"
              }
              artist={song.artist || "Unknown Artist"}
            ></Song>
          );
        })}
      </div>
    );
  }
}

export default SongList;
