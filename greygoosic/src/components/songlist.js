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
    let result = await goosic.get("/song-list");
    let songList = result.data;
    //setto lo state di conseguenza
    this.setState({
      songs: songList
    });
  }
  getFileNameFromPath(filePath) {
    return filePath ? filePath.split("/")[filePath.split("/").length - 1] : "";
  }

  render() {
    return (
      <div className="song-list">
        {this.state.songs.map(song => {
          return (
            <Song
              key={song.id}
              id={song.id}
              title={
                song.metadata.title ||
                this.getFileNameFromPath(song.file_name) ||
                "Unknown"
              }
              artist={song.metadata.artist || "Unknown Artist"}
            ></Song>
          );
        })}
      </div>
    );
  }
}

export default SongList;
