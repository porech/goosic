import { put, select, takeEvery } from "redux-saga/effects";
import { shuffle } from "lodash";
import { PLAYER_PLAY_SONG, PLAYER_ENDED } from "./player";
import { getSongs } from "./songs";
import { NEXT_SONG } from "../constants";
import  _ from 'lodash'

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
  const { queues } = state;
  let { queueIndex, songIndex } = state

  switch (action.type) {
    case SONG_FROM_VIEW:
      console.log(action)
      const { view, viewIndex } = action.payload
      // if I changed view, I should push a new queue with a song
      if (! _.isEqual(view, state.view)) {
          //index in the view
        const queue = [view[viewIndex]];
        if (queueIndex === queues.length - 1) {
          queues.push(queue);
        } else {
          queues.splice(queueIndex, 0, queue);
        }
        queueIndex = queueIndex+1;
        //updating songIndex to 0 to be ready to play the next song
        songIndex = 0;
      } else {
        //instead, if the view is the same, I should push the song at the end of the current queue and the change the songIndex
        queues[queueIndex].push(view[viewIndex])
        songIndex = songIndex+1;
      }

      
      return {
        ...state,
        view,
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
  if (currentQueue.length > songIndex + 1 && currentQueue[songIndex+1]) {
    yield put({ type: NEXT_SONG_INDEX });
    yield put({ type: QUEUE_PLAY_SONG });
    return;
  }
  //if there is a next queue available
  if (queues.length > queueIndex + 1 && queues[queueIndex+1]) {
    yield put({ type: NEXT_QUEUE_INDEX });
    yield put({ type: QUEUE_PLAY_SONG });
    return;
  }

  //if I have nothing in queue, I refer to the view 
 if (view && view[viewIndex+1]) {

  yield put({type: SONG_FROM_VIEW, 
    payload: {
      view: view,
      viewIndex: viewIndex+1
    }
  })
  return;
} else {
  //do nothing, you ended up the available songs from the queue and the view.
} 

}
function* playSong() {
  const song = yield select(getQueuedSong);
  console.log("songToPlay", song)
  if (song) {
  yield put({ type: PLAYER_PLAY_SONG, payload: song });
  }
}

export function* saga() {
  yield takeEvery([SONG_FROM_VIEW, QUEUE_PLAY_SONG], playSong);
  yield takeEvery([QUEUE_NEXT_SONG, PLAYER_ENDED], nextSong);
}
