import React from "react";
import { connect } from "react-redux";
import "rc-slider/assets/index.css";
import "./Nowplaying.css";
import Slider from "rc-slider";
import {
  nextSong,
  playSong,
  pauseSong,
  updateDuration,
  updateCurrentTime
} from "../actions";

class NowPlaying extends React.Component {
  audio;
  componentDidMount() {
    this.audio = document.getElementById("audioPlayer");
  }

  componentDidUpdate() {
    if (this.audio && this.audio.src) {
      let previousPlayingId = this.audio.src.split("/song-stream/")[1];
      if (
        this.props.nowPlaying &&
        this.props.nowPlaying.song &&
        previousPlayingId !== this.props.nowPlaying.song.id.toString()
      ) {
        this.play(this.props.nowPlaying.song);
      }
    } else if (
      this.audio &&
      this.props.nowPlaying &&
      this.props.nowPlaying.song
    ) {
      this.play(this.props.nowPlaying.song);
    }
  }
  buildTitleString() {
    if (this.props.nowPlaying && this.props.nowPlaying.song) {
      let { song } = this.props.nowPlaying;
      let title = "";
      if (song.metadata.artist) {
        title = title.concat(song.metadata.artist).concat(" - ");
      }
      if (song.metadata.title) {
        title = title.concat(song.metadata.title);
      } else if (song.file_name) {
        title = title.concat(song.file_name);
      } else {
        title = title.concat("Unknown Song");
      }
      return title;
    } else {
      return "";
    }
  }
  checkIsPlaying() {
    return this.props.nowPlaying && this.props.nowPlaying.isPlaying
      ? true
      : false;
  }
  parseTimeToString(time) {
    let minutes = Math.trunc(time / 60);
    let seconds = time - 60 * minutes;
    let trailingZeroForMinutes = minutes < 10 ? true : false;
    let trailingZeroForSeconds = seconds < 10 ? true : false;
    return `${
      time
        ? (trailingZeroForMinutes ? "0" : "") +
          minutes +
          ":" +
          (trailingZeroForSeconds ? "0" : "") +
          seconds
        : "--:--"
    }`;
  }
  onTimeUpdate() {
    this.props.updateCurrentTime(Math.round(this.audio.currentTime));
    if (this.audio.currentTime - this.audio.duration === 0) {
      this.next();
    }
  }
  render() {
    let title = this.buildTitleString();
    return (
      <div>
        <audio
          id="audioPlayer"
          onTimeUpdate={() => {
            this.onTimeUpdate();
          }}
          onDurationChange={() => {
            this.props.updateDuration(Math.round(this.audio.duration));
          }}
        ></audio>

        <div className="panel">
          <Slider
            id="slider"
            min={0}
            max={this.props.nowPlaying ? this.props.nowPlaying.duration : 0}
            value={
              this.props.nowPlaying ? this.props.nowPlaying.currentTime : 0
            }
            defaultValue={0}
            onChange={event => {
              if (this.audio.currentTime < this.audio.duration) {
                this.audio.currentTime = event;
              } else {
                this.next();
              }
            }}
          ></Slider>
          {this.props.nowPlaying ? (
            <div
              className={
                title.length > 50 ? "song-info sliding-text" : "song-info"
              }
            >
              {title}
            </div>
          ) : (
            ""
          )}
          <div className="action-icons">
            {this.props.nowPlaying ? (
              <div className="time-info">
                {this.parseTimeToString(this.props.nowPlaying.currentTime)}
              </div>
            ) : (
              ""
            )}
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
            {this.props.nowPlaying ? (
              <div className="duration-info">
                -
                {this.parseTimeToString(
                  this.props.nowPlaying.duration -
                    this.props.nowPlaying.currentTime
                )}
              </div>
            ) : (
              ""
            )}
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
      let nextIndex =
        this.props.queue
          .map(song => song.id)
          .indexOf(this.props.nowPlaying.song.id) + 1;
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
        this.props.queue
          .map(song => song.id)
          .indexOf(this.props.nowPlaying.song.id) - 1;
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
    if (song) {
      let previousPlayingId = this.audio.src.split("/song-stream/")[1];
      if (!this.props.nowPlaying || song.id.toString() !== previousPlayingId) {
        this.props.nextSong(song);
        this.audio.src = `/song-stream/${song.id}`;
      } else {
        this.props.playSong(song);
      }
      this.audio.play();
      this.props.updateDuration(Math.round(this.audio.duration));
    } else {
      console.log("ERR_NO_SONG");
    }
  };
  pause = () => {
    this.props.pauseSong();
    this.audio.pause();
  };
}

const mapStateToProps = state => {
  //console.log(state);
  return { queue: state.songs, nowPlaying: state.nowPlaying };
};
export default connect(mapStateToProps, {
  nextSong,
  playSong,
  pauseSong,
  updateDuration,
  updateCurrentTime
})(NowPlaying);
