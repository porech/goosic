import { SEARCH_SONG } from "../constants";
import { PLAYER_PAUSE, PLAYER_RESUME, PLAYER_SEEK } from "../state/player";
import {
  QUEUE_ADD_SONGS,
  QUEUE_NEXT,
  QUEUE_PREVIOUS,
  QUEUE_TOGGLE_REPEAT_SONG,
  QUEUE_TOGGLE_SHUFFLE,
} from "../state/queue";

export const nextSong = () => {
  return { type: QUEUE_NEXT };
};

export const previousSong = () => {
  return { type: QUEUE_PREVIOUS };
};

export const pauseSong = () => {
  return { type: PLAYER_PAUSE };
};

export const resumeSong = () => ({
  type: PLAYER_RESUME,
});

export const search = (payload) => {
  return { type: SEARCH_SONG, payload };
};

export const seekTo = (position) => ({
  type: PLAYER_SEEK,
  payload: position,
});

export const enqueueSongs = (songs, index, playNow) => ({
  type: QUEUE_ADD_SONGS,
  payload: {
    songs,
    index,
    playNow,
  },
});

export const toggleShuffle = () => {
  return { type: QUEUE_TOGGLE_SHUFFLE };
};

export const toggleRepeatSong = () => {
  return { type: QUEUE_TOGGLE_REPEAT_SONG };
};
