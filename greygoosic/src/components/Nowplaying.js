import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import "rc-slider/assets/index.css";
import "./Nowplaying.css";
import Slider from "rc-slider";
import {
  nextSong,
  playSong,
  pauseSong,
  updateDuration,
  updateCurrentTime,
  toggleRepeatSongs,
  toggleShuffleSongs
} from "../actions";

class NowPlaying extends React.Component {
  audio;
  previousSongList = [];
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
  getArtist = song => {
    return song.metadata.artist || "";
  };
  getTitle = song => {
    return song.metadata.title || song.file_name;
  };

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
  seekTo(time) {
    if (this.audio.currentTime < this.audio.duration) {
      this.audio.currentTime = time;
    } else {
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
              this.seekTo(event);
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
            <div
              className={`action-icons-extra-left ${
                this.props.options && this.props.options.repeat
                  ? "toggle-enabled"
                  : "toggle-disabled"
              } `}
            >
              <i
                onClick={() => {
                  this.props.toggleRepeatSongs(
                    this.props.options && this.props.options.repeat
                      ? this.props.options.repeat
                      : false
                  );
                }}
                className="action-icons-extra-left-icon retweet icon"
              ></i>
            </div>
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
            <div
              className={`action-icons-extra-right ${
                this.props.options && this.props.options.shuffle
                  ? "toggle-enabled"
                  : "toggle-disabled"
              } `}
            >
              <i
                onClick={() => {
                  this.props.toggleShuffleSongs(
                    this.props.options && this.props.options.shuffle
                      ? this.props.options.shuffle
                      : false
                  );
                }}
                className="action-icons-extra-right-icon random icon"
              ></i>
            </div>
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
      let nextIndex;
      //#TODO will be server-side
      if (this.props.options && this.props.options.shuffle) {
        nextIndex = Math.round(
          Math.random() * this.props.queue.length +
            Math.abs(
              Math.round(
                this.props.queue
                  .map(song => song.id)
                  .indexOf(this.props.nowPlaying.song.id) / 3
              )
            )
        );
      } else {
        let increment = 1;
        nextIndex =
          this.props.queue
            .map(song => song.id)
            .indexOf(this.props.nowPlaying.song.id) + increment;
      }
      if (nextIndex > this.props.queue.length - 1) {
        if (this.props.options && this.props.options.repeat) {
          nextIndex = 0;
        } else {
          nextIndex = this.props.queue.length - 1;
        }
      }
      if (nextIndex > this.props.queue.length - 1) {
        nextIndex = 0;
      }
      this.previousSongList.push(this.props.nowPlaying.song);

      let nextSong = this.getSongFromIndex(nextIndex);
      if (this.props.options && !this.props.options.repeat) {
        this.previousSongList = _.uniq(this.previousSongList);
        //console.log(nextSong.file_name);
        if (this.previousSongList.includes(nextSong)) {
          //console.log("found duplicate, skipping");
          nextSong = this.props.queue.find(
            el => !this.previousSongList.includes(el)
          );
          if (!nextSong) {
            return;
          }
          //console.log(nextSong.file_name);
        }
      }
      //console.log("nextSong:", nextSong, "nextIndex:", nextIndex);
      this.play(nextSong);
    } else {
      this.play(this.getSongFromIndex(0));
    }
  };
  previous = () => {
    if (this.props.nowPlaying) {
      let previousSong;
      if (this.props.options && this.props.options.shuffle) {
        previousSong = this.previousSongList.pop();
        if (!previousSong) {
          if (this.props.options.repeat) {
            let increment = Math.abs(
              Math.round(Math.random() * this.props.queue.length) - 3
            );
            previousSong = this.getSongFromIndex(
              this.props.queue.length - increment
            );
          } else {
            return;
          }
        }
      } else {
        let previousIndex =
          this.props.queue
            .map(song => song.id)
            .indexOf(this.props.nowPlaying.song.id) - 1;
        if (previousIndex < 0) {
          if (this.props.options && this.props.options.repeat) {
            previousIndex = this.props.queue.length - 1;
          } else {
            previousIndex = 0;
          }
        }
        previousSong = this.getSongFromIndex(previousIndex);
      }
      this.play(previousSong);
    } else {
      this.play(this.getSongFromIndex(0));
    }
  };
  updateMediaSessionPositionState = () => {
    /*    navigator.mediaSession.setPositionState({
      duration: this.audio.duration,
      playbackRate: this.audio.playbackRate,
      position: this.audio.currentTime
    }); */
  };
  play = song => {
    if (!song) {
      song =
        this.props.nowPlaying && this.props.nowPlaying.song
          ? this.props.nowPlaying.song
          : this.getSongFromIndex(0);
    }
    if (song) {
      let previousPlayingId = this.audio.src.split("/song-stream/")[1];
      if (!this.props.nowPlaying || song.id.toString() !== previousPlayingId) {
        this.props.nextSong(song);
        this.audio.src = `/song-stream/${song.id}`;
      } else {
        this.props.playSong(song);
      }
      if ("mediaSession" in navigator) {
        /* eslint-disable-next-line */
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.getTitle(song),
          artist: this.getArtist(song),
          artwork: [
            {
              src:
                "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2560&q=80",
              sizes: "128x128",
              type: "image/jpeg"
            }
          ]
        });

        navigator.mediaSession.setActionHandler("play", () => {
          navigator.mediaSession.playbackState = "playing";
          this.play();
          this.updateMediaSessionPositionState();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          navigator.mediaSession.playbackState = "paused";
          this.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          this.next();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          this.previous();
        });
        navigator.mediaSession.setActionHandler("seekto", details => {
          this.seekTo(details.seekTime);
          this.updateMediaSessionPositionState();
        });
      }
      this.audio.play();
      this.props.updateDuration(Math.round(this.audio.duration));
    }
  };
  pause = () => {
    this.props.pauseSong();
    this.audio.pause();
  };
}

const mapStateToProps = state => {
  return {
    queue: state.songs,
    nowPlaying: state.nowPlaying,
    options: state.options
  };
};
export default connect(mapStateToProps, {
  nextSong,
  playSong,
  pauseSong,
  updateDuration,
  updateCurrentTime,
  toggleShuffleSongs,
  toggleRepeatSongs
})(NowPlaying);
