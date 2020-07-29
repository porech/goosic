import { put, select, takeEvery } from "redux-saga/effects";
import { shuffle } from "lodash";
import { PLAYER_PLAY_SONG, PLAYER_ENDED } from "./player";
import { getSongs } from "./songs";
import { NEXT_SONG } from "../constants";

export const REPEAT = {
  NONE: -1,
  ONE: 0,
  ALL: 1,
};
export const ADD_QUEUE = "ADD_QUEUE";
export const REMOVE_FIRST_QUEUE = "REMOVE_FIRST_QUEUE";
export const QUEUE_NEXT_SONG = "QUEUE_NEXT_SONG";
export const QUEUE_PREVIOUS_SONG = "QUEUE_PREVIOUS_SONG";
export const PLAY_LATEST_QUEUE = "PLAY_LATEST_QUEUE";
export const SONG_FROM_VIEW = "SONG_FROM_VIEW";
const NEXT_SONG_INDEX = "NEXT_SONG_INDEX";
const NEXT_QUEUE_INDEX = "NEXT_QUEUE_INDEX";
const QUEUE_PLAY_SONG = "QUEUE_PLAY_SONG";

const getQueuedSong = (state) => {
  const { queues, queueIndex, songIndex } = state.queue;
  return queues[queueIndex][songIndex];
};

//#TODO should return songs based on the context we're on; for instance, if the context is an artist view, should return songs made by this artist
const getContextSongs = (state) => {
  return state.songs.songs;
};

let defaultState = {
  //array of queue arrays
  queues: [[]],
  //current play index in the queue
  songIndex: -1,
  //current queue index
  queueIndex: -1,
  //current song view, from which we populate the queue
  view: [],
  viewIndex: -1,
  shuffle: false,
  repeat: REPEAT.NONE,
};
export const reducer = (state = defaultState, action) => {
  const { queueIndex, queues, songIndex, view, viewIndex } = state;

  switch (action.type) {
    case SONG_FROM_VIEW:
      //index in the view
      const queue = [view[viewIndex]];
      if (queueIndex === queues.length - 1) {
        queues.push(queue);
      } else {
        queues.splice(queueIndex, 0, queue);
      }
      //updating songIndex to 0 to be ready to play the next song
      return {
        ...state,
        view,
        queues,
        songIndex: 0,
        queueIndex: queueIndex + 1,
        viewIndex,
      };
    case NEXT_SONG_INDEX:
      return {
        ...state,
        songIndex: songIndex + 1,
      };
    case NEXT_QUEUE_INDEX:
      return {
        ...state,
        queueIndex: queueIndex + 1,
        songIndex: 0,
      };

    default:
      return state;
  }
};
function* nextSong() {
  //evaluates queue status and gets new songs if needed
  const { queues, queueIndex, songIndex } = yield select(
    (state) => state.queue
  );
  const currentQueue = queues[queueIndex];
  //if there are songs left in the queue
  if (currentQueue.length > songIndex + 1) {
    yield put({ type: NEXT_SONG_INDEX });
    yield put({ type: QUEUE_PLAY_SONG });
    return;
  }
  if (queues.length > queueIndex + 1) {
    yield put({ type: NEXT_QUEUE_INDEX });
    yield put({ type: QUEUE_PLAY_SONG });
    return;
  }
}
function* playSong() {
  const song = yield select(getQueuedSong);
  yield put({ type: PLAYER_PLAY_SONG, payload: song });
}

export function* saga() {
  yield takeEvery([SONG_FROM_VIEW, QUEUE_PLAY_SONG], playSong);
  yield takeEvery([QUEUE_NEXT_SONG, PLAYER_ENDED], nextSong);
}
