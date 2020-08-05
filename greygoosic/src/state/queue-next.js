import { put, select, takeEvery } from "redux-saga/effects";
import { PLAYER_PLAY_SONG, PLAYER_ENDED } from "./player";
import { GET_SONGS_RANDOM } from "./songs";
import { sample, random } from "lodash";

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
export const ADD_TO_QUEUE = "ADD_TO_QUEUE";
const NEXT_SONG_INDEX = "NEXT_SONG_INDEX";
const NEXT_QUEUE_INDEX = "NEXT_QUEUE_INDEX";
const QUEUE_PLAY_SONG = "QUEUE_PLAY_SONG";
const SET_VIEW_PLAYED = "SET_VIEW_PLAYED";
const REPEAT_VIEW = "REPEAT_VIEW";
const SET_VIEW_INDEX = "SET_VIEW_INDEX";

const getQueuedSong = (state) => {
  const { queues, queueIndex, songIndex } = state.queue;
  return queues[queueIndex][songIndex];
};

const getRepeatStatus = (state) => state.repeat;
const getShuffleStatus = (state) => state.shuffle;

let defaultState = {
  //array of queue arrays
  queues: [],
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
  let { queues, queueIndex, songIndex, view } = state;

  switch (action.type) {
    case SONG_FROM_VIEW:
      const newView = action.payload.view;
      const { viewIndex } = action.payload;
      // push a new queue with a song index in the view
      const queue = [newView[viewIndex]];
      if (queueIndex === queues.length - 1) {
        queues.push(queue);
      } else {
        queues.splice(queueIndex, 0, queue);
      }
      queueIndex = queueIndex + 1;
      //updating songIndex to 0 to be ready to play the next song
      songIndex = 0;

      return {
        ...state,
        view: newView,
        queues,
        songIndex,
        queueIndex,
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
    case SET_VIEW_INDEX:
      return {
        ...state,
        viewIndex: action.payload,
      };
    case SET_VIEW_PLAYED:
      const index = action.payload;
      view[index].played = true;
      return {
        ...state,
        view,
      };
    case REPEAT_VIEW:
      return {
        ...state,
        view: view.map((i) => {
          i.played = false;
          return i;
        }),
      };
    case ADD_TO_QUEUE:
      const currentQueue = queues[queueIndex];
      if (songIndex === currentQueue.length - 1) {
        currentQueue.push(action.payload);
      } else {
        currentQueue.splice(songIndex, 0, action.payload);
      }
      queues[queueIndex] = currentQueue;
      return {
        ...state,
        queues,
      };
    default:
      return state;
  }
};
function* nextSong() {
  //evaluates queue status and gets new songs if needed
  const { queues, queueIndex, songIndex, view, viewIndex } = yield select(
    (state) => state.queue
  );
  const currentQueue = queues[queueIndex];
  //if there are songs left in the queue
  if (currentQueue.length > songIndex + 1 && currentQueue[songIndex + 1]) {
    yield put({ type: NEXT_SONG_INDEX });
    yield put({ type: QUEUE_PLAY_SONG });
    return;
  }
  //if there is a next queue available
  if (queues.length > queueIndex + 1 && queues[queueIndex + 1]) {
    yield put({ type: NEXT_QUEUE_INDEX });
    yield put({ type: QUEUE_PLAY_SONG });
    return;
  }

  //if I get here, the queue is ended and there's no next queue

  // If we have no items in view, we have nothing to play. Ask to enqueue random songs.
  if (view.length < 1) {
    yield put({ type: GET_SONGS_RANDOM });
    return;
  }

  // Set the just finished song as played
  yield put({ type: SET_VIEW_PLAYED, payload: viewIndex });

  // Get the new view
  const updatedView = yield select((state) => state.queue.view);

  // Add an index field to all the elements of the view
  const viewWithIndexes = updatedView.map((el, index) => {
    el.viewIndex = index;
    return el;
  });

  const shuffleStatus = yield select(getShuffleStatus);
  let nextSong = viewWithIndexes[viewIndex + 1];
  if (shuffleStatus) {
    nextSong = sample(viewWithIndexes.filter((s) => !s.played));
  }

  // If we played all the songs from the view
  if (!nextSong) {
    const repeatStatus = yield select(getRepeatStatus);
    // If we have repeat all enabled, repeat the current view, else ask for more songs
    if (repeatStatus === REPEAT.ALL) {
      yield put({ type: REPEAT_VIEW });
    } else {
      yield put({ type: GET_SONGS_RANDOM });
    }
    return;
  }

  yield put({ type: SET_VIEW_INDEX, payload: nextSong.viewIndex });
  yield put({ type: ADD_TO_QUEUE, payload: nextSong });
  yield put({ type: NEXT_SONG_INDEX });
  yield put({ type: QUEUE_PLAY_SONG });
}

function* repeatView() {
  // If shuffle is enabled, start with a random song from the view, else with index 0
  const { view } = yield select((state) => state.queue);
  const shuffleStatus = yield select(getShuffleStatus);
  let viewIndex = 0;
  if (shuffleStatus) {
    viewIndex = random(0, view.length - 1);
  }

  yield put({
    type: SONG_FROM_VIEW,
    payload: {
      view,
      viewIndex,
    },
  });
}

function* playSong() {
  const song = yield select(getQueuedSong);
  if (song) {
    yield put({ type: PLAYER_PLAY_SONG, payload: song });
  }
}

function* playerEnded() {
  const repeatStatus = yield select(getRepeatStatus);
  if (repeatStatus === REPEAT.ONE) {
    yield put({ type: QUEUE_PLAY_SONG });
  } else {
    yield put({ type: QUEUE_NEXT_SONG });
  }
}

export function* saga() {
  yield takeEvery([SONG_FROM_VIEW, QUEUE_PLAY_SONG], playSong);
  yield takeEvery(QUEUE_NEXT_SONG, nextSong);
  yield takeEvery(PLAYER_ENDED, playerEnded);
  yield takeEvery(REPEAT_VIEW, repeatView);
}
