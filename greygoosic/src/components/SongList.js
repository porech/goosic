import React from "react";
import "./SongList.css";
import Song from "./cards/Song";
import { connect } from "react-redux";
import { enqueueSongs } from "../actions";

class SongList extends React.Component {
  loading = false;
  searchResults = [];

  showSongsOrLoading = () => {
    this.loading = !this.loading;
    return this.loading === true ? (
      <div>Loading...</div>
    ) : (
      <div>
        No songs in list, or backend unavailable. In case, please add music
        folder on Goosic to see it here :)
      </div>
    );
  };
  renderSongs = () => {
    return (
      <div>
        {!this.props.songs || this.props.songs.length === 0 ? (
          <div className="ui info icon message">
            <i className="info icon" />
            <div className="header">{this.showSongsOrLoading()}</div>
          </div>
        ) : (
          (this.searchResults = this.props.songs
            .filter((song) => {
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
            .map((song, index) => {
              return <Song
                  nowPlaying={!!(this.props.nowPlaying && this.props.nowPlaying.id === song.id)}
                  tabIndex={index}
                  key={song.id}
                  song={song}
                  onClick={() => this.props.enqueueSongs(this.props.songs, index, true)}
              />
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
    return <div className="song-list">{this.renderSongs()}</div>;
  }
}
const mapStateToProps = (state) => {
  return { searchedText: state.searchedText, songs: state.songs.songs, nowPlaying: state.player.nowPlaying };
};
export default connect(mapStateToProps, { enqueueSongs })(SongList);
