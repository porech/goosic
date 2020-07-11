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
import {PLAYER_PAUSE, PLAYER_PLAY_SONG, PLAYER_RESUME, PLAYER_SEEK} from "../state/player"
import {
  QUEUE_ADD_SONGS,
  QUEUE_NEXT,
  QUEUE_PREVIOUS,
  QUEUE_TOGGLE_REPEAT_SONG,
  QUEUE_TOGGLE_SHUFFLE
} from "../state/queue"
export const getSongs = () => async dispatch => {
  try {
    const response = await goosic.get("song-list");
    dispatch({ type: GET_SONGS, payload: response.data });
  } catch (err) {
    console.log("Error fetching songs", err);
    dispatch({ type: GET_SONGS, payload: null });
  }
};

export const nextSong = () => {
  return { type: QUEUE_NEXT };
};

export const previousSong = () => {
  return { type: QUEUE_PREVIOUS };
}

export const pauseSong = () => {
  return { type: PLAYER_PAUSE };
};

export const resumeSong = () => ({
  type: PLAYER_RESUME
})

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

export const seekTo = position => ({
  type: PLAYER_SEEK,
  payload: position
})

export const enqueueSongs = (songs, index, playNow) => ({
  type: QUEUE_ADD_SONGS,
  payload: {
    songs,
    index,
    playNow
  }
})

export const toggleShuffle = () => {
  return { type: QUEUE_TOGGLE_SHUFFLE };
};

export const toggleRepeatSong = () => {
  return { type: QUEUE_TOGGLE_REPEAT_SONG };
};
