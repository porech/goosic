import {
  SEARCH_SONG,
  GET_SONGS,
  EXPAND_COLLAPSE_SEARCH_BAR,
  PLAY_SONG,
  PAUSE_SONG
} from "../constants";
import goosic from "../goosic";
export const getSongs = () => async dispatch => {
  const response = await goosic.get("song-list");
  dispatch({ type: GET_SONGS, payload: response.data });
};
export const playSong = payload => {
  return { type: PLAY_SONG, payload };
};

export const pauseSong = payload => {
  return { type: PAUSE_SONG, payload };
};
export const search = payload => {
  return { type: SEARCH_SONG, payload };
};

export const expandCollapseSearchBar = payload => {
  return { type: EXPAND_COLLAPSE_SEARCH_BAR, payload };
};
