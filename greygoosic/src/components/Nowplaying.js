import React, {useSelector} from "react";
import { connect } from "react-redux";
import _ from "lodash";
import "rc-slider/assets/index.css";
import "./Nowplaying.css";
import Time from "./Time";
import Slider from "rc-slider";
import {
  nextSong,
  playSong,
  pauseSong,
  updateDuration,
  updateCurrentTime
} from "../actions";
import { getCurrentTitle, getCurrentArtist, getCurrentFileName, getCurrentPosition, getDuration } from "../state/player";

let buildTitleString = (title, artist, fileName) => {
    if(!title) return fileName
    if(!artist) return title
    return `${artist} - ${title}`
} 

let seekTo = (time, song) => {
  if (this.audio.currentTime < this.audio.duration) {
    song.currentTime = time;
  } else {
    nextSong();
  }
} 
const NowPlaying = (nextSong) => {
    const title = useSelector(getCurrentTitle)
    const artist = useSelector(getCurrentArtist)
    const fileName = useSelector(getCurrentFileName)
    const position = useSelector(getCurrentPosition)
    const duration = useSelector(getDuration)
    const formattedTitle = buildTitleString(title, artist, fileName);
    return (
        <div className="panel">
          <Slider
            id="slider"
            min={0}
            max={duration || 0}
            value={
              position || 0
            }
            defaultValue={0}
            onChange={event => {
              //Dispatch SEEK_TO
              seekTo(event)
            }}
          ></Slider>

            <div
              className={
                formattedTitle.length > 50 ? "song-info sliding-text" : "song-info"
              }
            >
              {formattedTitle}
            </div>

          <div className="action-icons">
            <div
              //#TODO #FIXME selector to be exposed in the queue
              className={`action-icons-extra-left ${
                false
                  ? "toggle-enabled"
                  : "toggle-disabled"
              } `}
            >
              <i
                onClick={() => {
                    //TOGGLE REPEAT SONGS
                }}
                className="action-icons-extra-left-icon retweet icon"
              ></i>
            </div>
            {duration && (
              <div className="time-info">
                <Time>{position}</Time>
              </div>
            )}
            <div className="action-icons-secondary">
              <i
                onClick={() => {
                  nextSong();
                }}
                className="backward icon"
              ></i>
            </div>
            <div className="action-icons-primary">
              <i
                onClick={() => {
                 //#TODO
                }}                 
                //#TODO
                className={`${
                  false ? "pause" : "play"
                } circle icon`}
              ></i>
            </div>
            <div className="action-icons-secondary">
              <i
                onClick={() => {
                  nextSong();
                }}
                className="forward icon"
              ></i>
            </div>
              {duration && (
              <div className="duration-info">
                -
                  <Time>
                    {duration - position}
                  </Time>
                </div>
              )}
            <div
              //#TODO #FIXME selector to be exposed in the queue
              className={`action-icons-extra-right ${
                false
                  ? "toggle-enabled"
                  : "toggle-disabled"
              } `}
            >
              <i
                onClick={() => {
                  //TOGGLE SHUFFLE SONGS
                }}
                className="action-icons-extra-right-icon random icon"
              ></i>
            </div>
          </div>
        </div>
    )}


/*   onTimeUpdate() {
    this.props.updateCurrentTime(Math.round(this.audio.currentTime));
    if (this.audio.currentTime - this.audio.duration === 0) {
      this.next();
    }
  }
  */

export default connect(null, {
  nextSong,
  playSong,
  pauseSong,
  updateDuration,
  updateCurrentTime,
  /*
  toggleShuffleSongs,
  toggleRepeatSongs */
})(NowPlaying);
