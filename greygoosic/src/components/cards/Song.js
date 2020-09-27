import React from "react";
import "./Song.css";
import Star from '../Star';
import { useDispatch, useSelector } from "react-redux";
import { getStarredItems, STAR_ITEM, UNSTAR_ITEM } from "../../state/starred";
let Song = ({ nowPlaying, song, onClick }) => {
  //contenitore di avatar e informazioni song: title, artist, album
  //ha uno spazio per delle actions (attualmente la stella per lo starring)
  let { title, artist, album, avatar } = song.metadata;
  /* avatar =
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4bb82b72535211.5bead62fe26d5.jpg";*/
  let noMetadata = false;
  if (!title) {
    title = song.file_name;
    noMetadata = true;
  }
  const dispatch = useDispatch();
  let starred = useSelector(getStarredItems);
  let starring = starred.length > 0 && starred.filter(s => s.id === song.id).length > 0 ? true : false;
  if (!starring || starring.length === 0) {
      starring = false;
  } 
  return (
    <div
      className={`${ nowPlaying === true ? "nowPlaying": ""} container`}
      onClick={onClick}
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
        <div className="star-button" onClick={(e) => {
            e.stopPropagation();
            if (starring === true) {
                dispatch({type: UNSTAR_ITEM, payload: {id: song.id}})
            } else {
                dispatch({type: STAR_ITEM, payload: {id: song.id}})
            }
        }}><div className="star-icon">
          <Star starring={starring} id={song.id}></Star>
        </div>
      </div>
     {/*    <div className="star-button"><div className="star-icon">☆</div></div> */}
      </div>
    </div>
  );
};

export default Song;
