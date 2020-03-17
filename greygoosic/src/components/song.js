import React from "react";

import "./song.css";
const Song = ({ title, artist }) => {
  return (
    <div className="song">
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
      <div class="divider"></div>
    </div>
  );
};

export default Song;
