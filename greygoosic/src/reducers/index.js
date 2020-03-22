import { combineReducers } from "redux";
import {
  SEARCH_SONG,
  GET_SONGS,
  EXPAND_COLLAPSE_SEARCH_BAR,
  PLAY_SONG,
  PAUSE_SONG
} from "../constants";
const songsReducer = (songs = [], action) => {
  switch (action.type) {
    case GET_SONGS:
      return action.payload;
    default:
      return songs;
  }
};
const searchSongReducer = (search = "", action) => {
  if (action.type === SEARCH_SONG) {
    return action.payload;
  }
  return search;
};

const playSongReducer = (song = null, action) => {
  if (action.type === PLAY_SONG) {
    return { ...action.payload, isPlaying: true };
  } else if (action.type === PAUSE_SONG) {
    return { ...song, ...action.payload, isPlaying: false };
  }
  return song;
};
const searchbarStatusReducer = (
  expandCollapseSearchBar = "collapse",
  action
) => {
  if (action.type === EXPAND_COLLAPSE_SEARCH_BAR) {
    return action.payload;
  }
  return expandCollapseSearchBar;
};

export default combineReducers({
  songs: songsReducer,
  searchedText: searchSongReducer,
  searchbarStatus: searchbarStatusReducer,
  nowPlaying: playSongReducer
});
