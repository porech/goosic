import React from "react";
import { useDispatch, useSelector} from "react-redux";
import "rc-slider/assets/index.css";
import "./Nowplaying.css";
import Time from "./Time";
import Slider from "rc-slider";
import {
  pauseSong, seekTo, resumeSong, previousSong, nextSong
} from "../actions";
import {
  getCurrentTitle,
  getCurrentArtist,
  getCurrentFileName,
  getCurrentPosition,
  getDuration,
  getIsPlaying
} from "../state/player";

let buildTitleString = (title, artist, fileName) => {
    if(!title) return fileName || ""
    if(!artist) return title
    return `${artist} - ${title}`
}

const NowPlaying = () => {
    const title = useSelector(getCurrentTitle)
    const artist = useSelector(getCurrentArtist)
    const fileName = useSelector(getCurrentFileName)
    const position = useSelector(getCurrentPosition)
    const duration = useSelector(getDuration)
    const isPlaying = useSelector(getIsPlaying)

    const dispatch = useDispatch()

    const togglePlay = () => dispatch(isPlaying ? pauseSong() : resumeSong())

    const onSliderSeek = (event) => dispatch(seekTo(event))

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
            onChange={onSliderSeek}
          />

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
              />
            </div>
            {duration > 0 && (
              <div className="time-info">
                <Time>{Math.round(position)}</Time>
              </div>
            )}
            <div className="action-icons-secondary">
              <i
                onClick={() => {
                  dispatch(previousSong());
                }}
                className="backward icon"
              />
            </div>
            <div className="action-icons-primary">
              <i
                onClick={togglePlay}
                className={`${
                  isPlaying ? "pause" : "play"
                } circle icon`}
              />
            </div>
            <div className="action-icons-secondary">
              <i
                onClick={() => {
                  dispatch(nextSong());
                }}
                className="forward icon"
              />
            </div>
              {duration > 0 && (
              <div className="duration-info">
                -
                  <Time>
                    {Math.round(duration) - Math.round(position)}
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
              />
            </div>
          </div>
        </div>
    )}

export default NowPlaying
