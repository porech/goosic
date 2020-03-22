import React from "react";
import { connect } from "react-redux";
import "./Nowplaying.css";
import { nextSong, playSong, pauseSong } from "../actions";
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
            <i
              onClick={() => {
                this.previous();
              }}
              className="backward icon"
            ></i>
          </div>
          <div className="action-icons-primary">
            <i
              onClick={() => {
                if (this.checkIsPlaying()) {
                  this.pause();
                } else {
                  this.play(
                    this.props.nowPlaying
                      ? this.props.nowPlaying.song
                      : this.getSongFromIndex(0)
                  );
                }
              }}
              className={`${
                this.checkIsPlaying() ? "pause" : "play"
              } circle icon`}
            ></i>
          </div>
          <div className="action-icons-secondary">
            <i
              onClick={() => {
                this.next();
              }}
              className="forward icon"
            ></i>
          </div>
        </div>
      </div>
    );
  }

  getSongFromIndex = index => {
    return this.props.queue[index] ? this.props.queue[index] : null;
  };
  next = () => {
    if (this.props.nowPlaying) {
      let nextIndex = this.props.queue.indexOf(this.props.nowPlaying.song) + 1;
      if (nextIndex > this.props.queue.length - 1) {
        nextIndex = 0;
      }
      let nextSong = this.getSongFromIndex(nextIndex);
      //console.log("nextSong:", nextSong, "nextIndex:", nextIndex);
      this.play(nextSong);
    } else {
      this.play(this.getSongFromIndex(0));
    }
  };
  previous = () => {
    if (this.props.nowPlaying) {
      let previousIndex =
        this.props.queue.indexOf(this.props.nowPlaying.song) - 1;
      if (previousIndex < 0) {
        previousIndex = this.props.queue.length - 1;
      }

      let previousSong = this.getSongFromIndex(previousIndex);
      //console.log("previousId:", previousSong, "previousIndex:", previousIndex);
      this.play(previousSong);
    } else {
      this.play(this.getSongFromIndex(0));
    }
  };

  play = song => {
    if (!song) {
      song = this.getSongFromIndex(0);
    }
    let previousPlayingId = this.audio.src.split("/song-stream/")[1];
    if (!this.props.nowPlaying || song.id.toString() !== previousPlayingId) {
      this.props.nextSong(song);
      this.audio.src = `/song-stream/${song.id}`;
    } else {
      this.props.playSong(song);
    }
    this.audio.play();
  };
  pause = () => {
    this.props.pauseSong();
    this.audio.pause();
  };
}

const mapStateToProps = state => {
  return { queue: state.songs, nowPlaying: state.nowPlaying };
};
export default connect(mapStateToProps, { nextSong, playSong, pauseSong })(
  NowPlaying
);
