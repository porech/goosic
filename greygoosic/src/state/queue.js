import { put, select, takeEvery } from "redux-saga/effects"
import {PLAYER_ENDED, PLAYER_PLAY_SONG} from "./player"

const defaultState = {
  songs: [],
  currentIndex: -1,
}

const QUEUE_INTERNAL_ENQUEUE_SONGS = 'QUEUE_INTERNAL_ENQUEUE_SONGS'
const QUEUE_INTERNAL_NEXT_SONG = 'QUEUE_INTERNAL_NEXT_SONG'
const QUEUE_INTERNAL_PREVIOUS_SONG = 'QUEUE_INTERNAL_PREVIOUS_SONG'

export const QUEUE_ADD_SONGS = 'QUEUE_ADD_SONGS'
export const QUEUE_NEXT = 'QUEUE_NEXT'
export const QUEUE_PREVIOUS = 'QUEUE_PREVIOUS'

export const getCurrentSong = state => state.queue.songs[state.queue.currentIndex]

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
    case QUEUE_INTERNAL_NEXT_SONG:
      if(state.currentIndex +1 >= state.songs.length) {
        return state
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1
      }
    case QUEUE_INTERNAL_PREVIOUS_SONG:
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
  yield put({
    type: QUEUE_INTERNAL_ENQUEUE_SONGS,
    payload: action.payload.songs
  })
  if(action.payload.playNow) {
    yield put({
      type: QUEUE_NEXT
    })
  }
}

function* nextSong() {
  yield put({
    type: QUEUE_INTERNAL_NEXT_SONG
  })
  const song = yield select(getCurrentSong)
  yield put({
    type: PLAYER_PLAY_SONG,
    payload: song
  })
}

function* previousSong() {
  yield put({
    type: QUEUE_INTERNAL_PREVIOUS_SONG
  })
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
