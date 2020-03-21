import { combineReducers } from "redux";
import {
  SEARCH_SONG,
  SELECT_SONG,
  GET_SONGS,
  EXPAND_COLLAPSE_SEARCH_BAR
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
const selectedSongReducer = (selectedSong = null, action) => {
  if (action.type === SELECT_SONG) {
    return action.payload;
  }
  return selectedSong;
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
  selectedSong: selectedSongReducer,
  searchedText: searchSongReducer,
  searchbarStatus: searchbarStatusReducer
});
