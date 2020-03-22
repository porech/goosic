import React from "react";
import { connect } from "react-redux";
import "./Nowplaying.css";
import { playSong, pauseSong } from "../actions";
class NowPlaying extends React.Component {
  audio;
  componentDidMount() {
    this.audio = document.getElementById("audioPlayer");
  }
  checkIsPlaying() {
    return this.props.nowPlaying && this.props.nowPlaying.isPlaying
      ? true
      : false;
  }
  render() {
    return (
      <div className="panel">
        <div className="action-icons">
          <div className="action-icons-secondary">
            <i onClick={() => {}} className="backward icon"></i>
          </div>
          <div className="action-icons-primary">
            <i
              onClick={() => {
                if (this.checkIsPlaying()) {
                  this.pause();
                } else {
                  this.play(
                    this.getSongIdFromIndex(
                      this.props.nowPlaying &&
                        this.props.nowPlaying.playingIndex
                        ? this.props.nowPlaying.playingIndex
                        : 0
                    )
                  );
                }
              }}
              className={`${
                this.checkIsPlaying() ? "pause" : "play"
              } circle icon`}
            ></i>
          </div>
          <div className="action-icons-secondary">
            <i onClick={() => {}} className="forward icon"></i>
          </div>
        </div>
      </div>
    );
  }
  getSongIdFromIndex = index => {
    return this.props.songs[index] ? this.props.songs[index].id : null;
  };
  play = id => {
    let nowPlaying = `/song-stream/${id}`;
    this.props.playSong({
      url: nowPlaying,
      playingIndex:
        this.props.nowPlaying && this.props.nowPlaying.playingIndex
          ? this.props.nowPlaying.playingIndex
          : 0
    });
    let previousPlayingId = this.audio.src.split("/song-stream/")[1];
    let previousPlaying = `/song-stream/${previousPlayingId}`;
    if (
      !this.props.nowPlaying ||
      previousPlaying !== this.props.nowPlaying.url
    ) {
      this.audio.src = nowPlaying;
      console.log(
        "src changed - before:",
        previousPlaying,
        "after:",
        this.audio.src
      );

      if (!id) {
        id = this.getSongIdFromIndex(
          this.props.nowPlaying && this.props.nowPlaying.playingIndex
            ? this.props.nowPlaying.playingIndex
            : 0
        );
      }
    }
    this.audio.play();
  };
  pause = () => {
    this.props.pauseSong();
    this.audio.pause();
  };
}

const mapStateToProps = state => {
  console.log(state);

  return { songs: state.songs, nowPlaying: state.nowPlaying };
};
export default connect(mapStateToProps, { playSong, pauseSong })(NowPlaying);
