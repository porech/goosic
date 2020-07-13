import React from "react";
import "./SongList.css";
import Song from "./cards/Song";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSongs } from "../actions";
import { getSongs, getLoadingSongs, getFilteredSongs } from "../state/songs";
import { getNowPlaying } from "../state/player";
import { getSearchedText } from "../state/searchedText";

const SongList = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector(getNowPlaying);
  const allSongs = useSelector(getSongs);
  const songs = useSelector(getFilteredSongs);
  const isLoading = useSelector(getLoadingSongs);

  //shows a loading message
  if (isLoading) {
    return (
      <div className="ui info icon message">
        <i className="info icon" />
        <div className="header">Loading...</div>
      </div>
    );
  }

  //shows a message to inform the user that songs array in state is empty
  if (!allSongs || allSongs.length === 0) {
    return (
      <div className="ui info icon message">
        <i className="info icon" />
        <div className="header">
          No songs in list, or backend unavailable. In case, please add music
          folder on Goosic to see it here :)
        </div>
      </div>
    );
  }

  // no results in search
  if (songs.length === 0) {
    return (
      <div className="ui info icon message">
        <i className="info icon" />
        <div className="header">No results found</div>
      </div>
    );
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
            onClick={() => dispatch(enqueueSongs(songs, index, true))}
          />
        );
      })}
    </div>
  );
};
export default SongList;
