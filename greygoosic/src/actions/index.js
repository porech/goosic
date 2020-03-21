import {
  SEARCH_SONG,
  GET_SONGS,
  EXPAND_COLLAPSE_SEARCH_BAR
} from "../constants";
import goosic from "../goosic";
export const getSongs = () => async dispatch => {
  const response = await goosic.get("song-list");
  dispatch({ type: GET_SONGS, payload: response.data });
};

export const search = payload => {
  return { type: SEARCH_SONG, payload };
};

export const expandCollapseSearchBar = payload => {
  return { type: EXPAND_COLLAPSE_SEARCH_BAR, payload };
};
