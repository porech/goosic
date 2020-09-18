import React from "react";
import "./SongList.css";
import Song from "./cards/Song";
import { useDispatch, useSelector } from "react-redux";
import { songFromView } from "../actions";
import { getSongs, getLoadingSongs, getSearchedSongs, getFilteredSongs } from "../state/songs";
import { getNowPlaying } from "../state/player";

const Warning = ({ children }) => (
  <div className="song-list">
    <div className="ui info icon message">
      <i className="info icon" />
      <div className="header">{children}</div>
    </div>
  </div>
);

const SongList = (props) => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector(getNowPlaying);
  const allSongs = useSelector(getSongs);
  var songs = useSelector(getSearchedSongs);
  var viewSongs = useSelector(getFilteredSongs);
  if(!viewSongs || viewSongs.length === 0) {
    viewSongs = songs;
  }
  const isLoading = useSelector(getLoadingSongs);

  //shows a loading message
  if (isLoading) {
    return <Warning>Loading...</Warning>;
  }

  //shows a message to inform the user that songs array in state is empty
  if (!allSongs || allSongs.length === 0) {
    return (
      <Warning>
        No songs in list, or backend unavailable. In case, please add music
        folder on Goosic to see it here :)
      </Warning>
    );
  }

  // no results in search
  if (songs.length === 0) {
    return <Warning>No results found</Warning>;
  }

  return (
    <div className={`${props.className} song-list`}>
      {viewSongs.map((song, index) => {
        return (
          <Song
            nowPlaying={!!(nowPlaying && nowPlaying.id === song.id)}
            tabIndex={index}
            key={song.id}
            song={song}
            onClick={() => dispatch(songFromView(songs, index))}
          />
        );
      })}
    </div>
  );
};
export default SongList;
