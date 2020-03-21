import { SEARCH_SONG, GET_SONGS } from "../constants";
import goosic from "../goosic";
export const getSongs = () => async dispatch => {
  const response = await goosic.get("song-list");
  dispatch({ type: GET_SONGS, payload: response.data });
};

export const search = payload => {
  return { type: SEARCH_SONG, payload };
};
