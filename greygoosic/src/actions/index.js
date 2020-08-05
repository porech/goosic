import { SEARCH_SONG } from "../constants";
import { PLAYER_PAUSE, PLAYER_RESUME, PLAYER_SEEK } from "../state/player";
import { QUEUE_NEXT_SONG, QUEUE_SONG_FROM_VIEW } from "../state/queue";
export const nextSong = () => {
  return { type: QUEUE_NEXT_SONG };
};

export const previousSong = () => {
  return { type: "QUEUE_PREVIOUS_SONG" };
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

export const songFromView = (view, viewIndex) => ({
  type: QUEUE_SONG_FROM_VIEW,
  payload: {
    view,
    viewIndex,
  },
});

export const toggleShuffle = () => {
  return { type: "QUEUE_TOGGLE_SHUFFLE" };
};

export const toggleRepeat = () => {
  return { type: "QUEUE_TOGGLE_REPEAT" };
};
