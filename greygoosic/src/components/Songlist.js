import React from "react";
import "./Songlist.css";
import Song from "./Song";
import { connect } from "react-redux";
import { getSongs } from "../actions";
class SongList extends React.Component {
  loading = true;
  searchResults = [];
  getFileNameFromPath(filePath) {
    return filePath ? filePath.split("/")[filePath.split("/").length - 1] : "";
  }
  componentDidMount() {
    this.props.getSongs();
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  renderSongs = () => {
    return (
      <div>
        {this.props.songs && this.props.songs.length === 0 ? (
          <div className="ui info icon message">
            <i className="info icon"></i>
            <div className="header">
              {this.loading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  No songs in list, please add music folder on Goosic :)
                </div>
              )}
            </div>
          </div>
        ) : (
          (this.searchResults = this.props.songs
            .filter(song => {
              if (this.props.searchedText === "") {
                return song;
              } else {
                let { title, artist } = song.metadata;
                let fileName = song.file_name;
                if (
                  (title &&
                    title
                      .toLowerCase()
                      .includes(this.props.searchedText.toLowerCase())) ||
                  (artist &&
                    artist
                      .toLowerCase()
                      .includes(this.props.searchedText.toLowerCase())) ||
                  (fileName &&
                    fileName
                      .toLowerCase()
                      .includes(this.props.searchedText.toLowerCase()))
                ) {
                  this.searchResults.push(song);
                  return song;
                } else {
                  return "";
                }
              }
            })
            .map(song => {
              return <Song key={song.id} song={song}></Song>;
            }))
        )}
        {this.searchResults.length === 0 && this.props.searchedText !== "" ? (
          <div>Nothing found!</div>
        ) : (
          ""
        )}
      </div>
    );
  };
  render() {
    return (
      <div
        className={
          this.props.searchedText ? "song-list song-list-longer" : "song-list"
        }
      >
        {this.renderSongs()}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { searchedText: state.searchedText, songs: state.songs };
};
export default connect(mapStateToProps, { getSongs })(SongList);
