import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "rc-slider/assets/index.css";
import "./Nowplaying.css";
import Time from "./Time";
import Slider from "rc-slider";
import RepeatOne from '../assets/svg/RepeatOne.svg'
import RepeatOff from '../assets/svg/RepeatOff.svg'
import RepeatAll from '../assets/svg/RepeatAll.svg'

import {
  pauseSong,
  seekTo,
  resumeSong,
  previousSong,
  nextSong,
  toggleShuffle,
  toggleRepeat,
} from "../actions";
import {
  getCurrentTitle,
  getCurrentArtist,
  getCurrentFileName,
  getCurrentPosition,
  getDuration,
  getIsPlaying,
} from "../state/player";
import { getRepeatStatus, getShuffleStatus, REPEAT } from "../state/queue";

let buildTitleString = (title, artist, fileName) => {
  if (!title) return fileName || "";
  if (!artist) return title;
  return `${artist} - ${title}`;
};

const NowPlaying = () => {
  const title = useSelector(getCurrentTitle);
  const artist = useSelector(getCurrentArtist);
  const fileName = useSelector(getCurrentFileName);
  const position = useSelector(getCurrentPosition);
  const duration = useSelector(getDuration);
  const isPlaying = useSelector(getIsPlaying);
  const shuffleStatus = useSelector(getShuffleStatus);
  const repeatStatus = useSelector(getRepeatStatus);

  const dispatch = useDispatch();

  const togglePlay = () => dispatch(isPlaying ? pauseSong() : resumeSong());

  const onSliderSeek = (event) => dispatch(seekTo(event / 100));

  const formattedTitle = buildTitleString(title, artist, fileName);
  return (
    <div className="panel">
      <Slider
        id="slider"
        min={0}
        max={duration * 100 || 0}
        value={position * 100 || 0}
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
            repeatStatus === REPEAT.NONE ? "toggle-disabled" : "toggle-enabled"
          }`}
        >
          <img
            src={repeatStatus !== REPEAT.NONE &&
              (repeatStatus === REPEAT.ALL ? RepeatAll : RepeatOne) || RepeatOff}
            width="30px"
            onClick={() => {
              dispatch(toggleRepeat());
            }}
            className={`action-icons-extra-left-icon`}
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
            className={`${isPlaying ? "pause" : "play"} circle icon`}
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
            -<Time>{Math.round(duration) - Math.round(position)}</Time>
          </div>
        )}
        <div
          //#TODO #FIXME selector to be exposed in the queue
          className={`action-icons-extra-right ${
            shuffleStatus ? "toggle-enabled" : "toggle-disabled"
          } `}
        >
          <i
            onClick={() => {
              dispatch(toggleShuffle());
            }}
            className="action-icons-extra-right-icon random icon"
          />
        </div>
      </div>
    </div>
  );
};
export default NowPlaying;
