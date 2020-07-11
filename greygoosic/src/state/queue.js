import { put, select, takeEvery } from "redux-saga/effects"
import {PLAYER_ENDED, PLAYER_PLAY_SONG} from "./player"
import {getSongs} from "./songs"

const defaultState = {
  songs: [],
  currentIndex: -1,
}

const QUEUE_INTERNAL_ENQUEUE_SONGS = 'QUEUE_INTERNAL_ENQUEUE_SONGS'
const QUEUE_INTERNAL_SET_INDEX = 'QUEUE_INTERNAL_SET_INDEX'

export const QUEUE_ADD_SONGS = 'QUEUE_ADD_SONGS'
export const QUEUE_NEXT = 'QUEUE_NEXT'
export const QUEUE_PREVIOUS = 'QUEUE_PREVIOUS'

export const getCurrentSong = state => state.queue.songs[state.queue.currentIndex]
export const getCurrentIndex = state => state.queue.currentIndex
export const getQueueLength = state => state.queue.songs.length

export const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case QUEUE_INTERNAL_ENQUEUE_SONGS:
      return {
        ...state,
        songs: [
            ...state.songs.slice(0, state.currentIndex + 1),
            ...action.payload
        ]
      }
    case QUEUE_INTERNAL_SET_INDEX:
      return {
        ...state,
        currentIndex: action.payload
      }
    case QUEUE_NEXT:
      if(state.currentIndex +1 >= state.songs.length) {
        return state
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1
      }
    case QUEUE_PREVIOUS:
      if(state.currentIndex === 0) {
        return state
      }
      return {
        ...state,
        currentIndex: state.currentIndex - 1
      }
    default:
      return state
  }
}

function* addSongs(action) {
  // If the queue is empty, pre-populate with the entire received list
  const queueLength = yield select(getQueueLength)
  if(queueLength === 0) {
    yield put({
      type: QUEUE_INTERNAL_ENQUEUE_SONGS,
      payload: action.payload.songs.slice(0, action.payload.index)
    })
    yield put({
      type: QUEUE_INTERNAL_SET_INDEX,
      payload: action.payload.index - 1
    })
  }

  // Put the actual new songs
  yield put({
    type: QUEUE_INTERNAL_ENQUEUE_SONGS,
    payload: action.payload.songs.slice(action.payload.index)
  })

  // If playNow, go to the next
  if(action.payload.playNow) {
    yield put({
      type: QUEUE_NEXT
    })
  }
}

function* nextSong() {
  const song = yield select(getCurrentSong)
  yield put({
    type: PLAYER_PLAY_SONG,
    payload: song
  })

  // If the queue reached the end, enqueue all the songs again
  const currentIndex = yield select(getCurrentIndex)
  const queueLength = yield select(getQueueLength)
  if(currentIndex >= queueLength - 1) {
    const songs = yield select(getSongs)
    yield put({
      type: QUEUE_ADD_SONGS,
      payload: {
        songs,
        index: 0
      }
    })
  }
}

function* previousSong() {
  const song = yield select(getCurrentSong)
  yield put({
    type: PLAYER_PLAY_SONG,
    payload: song
  })
}

export function* saga() {
  yield takeEvery(QUEUE_ADD_SONGS, addSongs)
  yield takeEvery([QUEUE_NEXT, PLAYER_ENDED], nextSong)
  yield takeEvery(QUEUE_PREVIOUS, previousSong)
}
