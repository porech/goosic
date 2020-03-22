import { combineReducers } from "redux";
import {
  SEARCH_SONG,
  GET_SONGS,
  EXPAND_COLLAPSE_SEARCH_BAR,
  PLAY_SONG,
  PAUSE_SONG,
  NEXT_SONG
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

const nowPlayingReducer = (nowPlayingInfo = null, action) => {
  switch (action.type) {
    case PLAY_SONG:
      return { song: action.payload, isPlaying: true };
    case PAUSE_SONG:
      return { ...nowPlayingInfo, isPlaying: false };
    case NEXT_SONG:
      return {
        song: action.payload,
        url: action.payload.id ? `/song-stream/${action.payload.id} ` : "",
        isPlaying: true
      };
    default:
      return nowPlayingInfo;
  }
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
  nowPlaying: nowPlayingReducer
});
