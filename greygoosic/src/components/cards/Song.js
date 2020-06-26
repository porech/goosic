import React, {useState }  from "react";
import { connect } from "react-redux";

import { nextSong } from "../../actions";
import "./Song.css";
let Song = ({ nowPlaying, tabIndex, song, nextSong }) => {
  //contenitore di avatar e informazioni song: title, artist, album
  //ha uno spazio per delle actions (attualmente la stella per lo starring)
  let { title, artist, album, avatar } = song.metadata;
  let [clicked, setClicked] = useState(false);
  /* avatar =
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4bb82b72535211.5bead62fe26d5.jpg";*/
  let noMetadata = false;
  if (!title) {
    title = song.file_name;
    noMetadata = true;
  }
  return (
    <div
      className={`${ nowPlaying == true ? "nowPlaying": ""} container`}
      onClick={() => {
        setClicked(!clicked);
        nextSong(song);
      }}
    >
      <div className="avatar">
        {/* mostro un'icona generica se non è disponibile un avatar */}
        {!avatar ? (
          <i className="music icon"></i>
        ) : (
          <img alt="avatar" src={avatar} width="80" />
        )}
      </div>
      {/* dispongo e mostro le informazioni della canzone */}
      <div className="info">
        <p className={noMetadata ? "title-large" : "title"}>{title}</p>
        <p className="artist">{artist}</p>
        {album && (
          <p className="album">
            <i className="bullseye icon"></i>
            {album}
          </p>
        )}
      </div>
      <div className="actions">
        <div className="star-button"><div className="star-icon">☆</div></div>
      </div>
    </div>
  );
};

export default connect(null, { nextSong })(Song);
