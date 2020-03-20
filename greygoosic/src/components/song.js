import React, { useState } from "react";
import "./song.css";
var getAudioState, setAudioState;

const Song = ({ id, title, artist }) => {
  [getAudioState, setAudioState] = useState({
    audio: new Audio(),
    clicked: false
  });
  return (
    <div onClick={() => playSong(id)} className="song">
      <div className="container">
        <img
          alt="avatar"
          src="https://www.mh-corp.com/img/icons/avatar.png"
          width="25"
          className="avatar"
        ></img>
        <div className="text">
          {artist} - {title}
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
};

const playSong = id => {
  let audio = getAudioState.audio;
  audio.src = `/song-stream/${id}`;
  setAudioState({ audio });
  audio.play();
};

export default Song;
