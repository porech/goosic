import { put, select, takeEvery } from "redux-saga/effects"
import {PLAYER_ENDED, PLAYER_PLAY_SONG} from "./player"
import {getSongs} from "./songs"
import { shuffle } from "lodash"

const defaultState = {
  songs: [],
  shuffledSongs: [],
  currentIndex: -1,
  shuffle: false,
  repeatSong: false,
}

const QUEUE_INTERNAL_ENQUEUE_SONGS = 'QUEUE_INTERNAL_ENQUEUE_SONGS'
const QUEUE_INTERNAL_SET_INDEX = 'QUEUE_INTERNAL_SET_INDEX'

export const QUEUE_ADD_SONGS = 'QUEUE_ADD_SONGS'
export const QUEUE_NEXT = 'QUEUE_NEXT'
export const QUEUE_PREVIOUS = 'QUEUE_PREVIOUS'
export const QUEUE_TOGGLE_SHUFFLE = 'QUEUE_TOGGLE_SHUFFLE'
export const QUEUE_TOGGLE_REPEAT_SONG = 'QUEUE_TOGGLE_REPEAT_SONG'

const getQueuedSong = state => {
  const index = state.queue.currentIndex
  return state.queue.shuffle ? state.queue.shuffledSongs[index] : state.queue.songs[index]
}
export const getCurrentIndex = state => state.queue.currentIndex
export const getQueueLength = state => state.queue.songs.length
export const getShuffleEnabled = state => state.queue.shuffle
export const getRepeatSongEnabled = state => state.queue.repeatSong

export const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case QUEUE_INTERNAL_ENQUEUE_SONGS:
      const songs = [
        ...state.songs.slice(0, state.currentIndex + 1),
        ...action.payload.songs
      ];

      let shuffledSongs = state.shuffledSongs.slice(0, state.currentIndex + 1);
      switch(true) {
        // If we want to shuffle all the songs, including the first, just shuffle all the new songs
        case action.payload.shuffleFirst:
          shuffledSongs = [
              ...shuffledSongs,
              ...shuffle(action.payload.songs)
          ]
          break

        // If there is just one song, keep it in the same position
        case action.payload.songs.length < 2:
          shuffledSongs = [
            ...shuffledSongs,
            ...action.payload.songs
          ]
          break

        // Keep the first song in its position and shuffle all the other ones
        default:
          shuffledSongs = [
            ...shuffledSongs,
            action.payload.songs[0],
            ...shuffle(action.payload.songs.slice(1))
          ]
      }

      return {
        ...state,
        songs,
        shuffledSongs
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
    case QUEUE_TOGGLE_SHUFFLE:
      return {
        ...state,
        shuffle: !state.shuffle
      }
    case QUEUE_TOGGLE_REPEAT_SONG:
      return {
        ...state,
        repeatSong: !state.repeatSong
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
      payload: {
        songs: action.payload.songs.slice(0, action.payload.index),
      }
    })
    yield put({
      type: QUEUE_INTERNAL_SET_INDEX,
      payload: action.payload.index - 1
    })
  }

  // Put the actual new songs
  yield put({
    type: QUEUE_INTERNAL_ENQUEUE_SONGS,
    payload: {
      songs: action.payload.songs.slice(action.payload.index),
    }
  })

  // If playNow, go to the next
  if(action.payload.playNow) {
    yield put({
      type: QUEUE_NEXT
    })
  }
}

function* nextSong() {
  const song = yield select(getQueuedSong)
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
      type: QUEUE_INTERNAL_ENQUEUE_SONGS,
      payload: {
        songs,
        shuffleFirst: true
      }
    })
  }
}

function* previousSong() {
  const song = yield select(getQueuedSong)
  yield put({
    type: PLAYER_PLAY_SONG,
    payload: song
  })
}

function* playerEnded() {
  const repeatSong = yield select(getRepeatSongEnabled)
  if(repeatSong) {
    const song = yield select(getQueuedSong)
    yield put({
      type: PLAYER_PLAY_SONG,
      payload: song
    })
  } else {
    yield put({
      type: QUEUE_NEXT
    })
  }
}

export function* saga() {
  yield takeEvery(QUEUE_ADD_SONGS, addSongs)
  yield takeEvery(QUEUE_NEXT, nextSong)
  yield takeEvery(PLAYER_ENDED, playerEnded)
  yield takeEvery(QUEUE_PREVIOUS, previousSong)
}
