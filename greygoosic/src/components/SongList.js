import React from "react";
import "./SongList.css";
import Song from "./cards/Song";
import { useDispatch, useSelector } from "react-redux";
import { addSongToQueue } from "../actions";
import { getSongs, getLoadingSongs, getFilteredSongs } from "../state/songs";
import { getNowPlaying } from "../state/player";

const Warning = ({ children }) => (
  <div className="song-list">
    <div className="ui info icon message">
      <i className="info icon" />
      <div className="header">{children}</div>
    </div>
  </div>
);

const SongList = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector(getNowPlaying);
  const allSongs = useSelector(getSongs);
  const songs = useSelector(getFilteredSongs);
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
    <div className="song-list">
      {songs.map((song, index) => {
        return (
          <Song
            nowPlaying={!!(nowPlaying && nowPlaying.id === song.id)}
            tabIndex={index}
            key={song.id}
            song={song}
            onClick={() => dispatch(addSongToQueue(song))}
          />
        );
      })}
    </div>
  );
};
export default SongList;
