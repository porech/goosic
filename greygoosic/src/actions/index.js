import {
  SEARCH_SONG,
  GET_SONGS,
  EXPAND_COLLAPSE_SEARCH_BAR,
  PLAY_SONG,
  PAUSE_SONG,
  NEXT_SONG,
  UPDATE_DURATION,
  UPDATE_CURRENT_TIME,
  SHUFFLE_SONGS,
  REPEAT_SONGS
} from "../constants";
import goosic from "../goosic";
export const getSongs = () => async dispatch => {
  try {
    const response = await goosic.get("song-list");
    console.log(response);
    dispatch({ type: GET_SONGS, payload: response.data });
  } catch (err) {
    console.log("Error fetching songs", err);
    dispatch({ type: GET_SONGS, payload: null });
  }
};

export const nextSong = payload => {
  return { type: NEXT_SONG, payload };
};
export const playSong = payload => {
  return { type: PLAY_SONG, payload };
};

export const pauseSong = () => {
  return { type: PAUSE_SONG };
};
export const search = payload => {
  return { type: SEARCH_SONG, payload };
};

export const toggleShuffleSongs = payload => {
  return { type: SHUFFLE_SONGS, payload };
};
export const toggleRepeatSongs = payload => {
  return { type: REPEAT_SONGS, payload };
};
export const updateDuration = payload => {
  return { type: UPDATE_DURATION, payload };
};

export const updateCurrentTime = payload => {
  return { type: UPDATE_CURRENT_TIME, payload };
};

export const expandCollapseSearchBar = payload => {
  return { type: EXPAND_COLLAPSE_SEARCH_BAR, payload };
};
