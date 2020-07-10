import { eventChannel, END } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'

export const PLAYER_PLAY_SONG = 'PLAYER_PLAY_SONG'
export const PLAYER_PLAYBACK_STARTED = 'PLAYER_PLAYBACK_STARTED'
export const PLAYER_PLAYBACK_ERROR = 'PLAYER_PLAYBACK_ERROR'
export const PLAYER_PAUSE = 'PLAYER_PAUSE'
export const PLAYER_RESUME = 'PLAYER_RESUME'
export const PLAYER_POS_CHANGE = 'PLAYER_POS_CHANGE'
export const PLAYER_DURATION_CHANGE = 'PLAYER_DURATION_CHANGE'

const defaultState = {
  isPlaying: false,
  error: null,
  nowPlaying: null,
  currentPosition: 0,
  duration: 0,
}

export const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case PLAYER_PLAY_SONG:
      return {
        ...state,
        nowPlaying: action.payload,
      }

    case PLAYER_PLAYBACK_STARTED:
      return {
        ...state,
        isPlaying: true
      }

    case PLAYER_PLAYBACK_ERROR:
      return {
        ...state,
        isPlaying: false,
        error: action.payload.toString()
      }

    case PLAYER_PAUSE:
      return {
        ...state,
        isPlaying: false
      }

    case PLAYER_RESUME:
      if(!state.nowPlaying) return state
      return {
        ...state,
        isPlaying: true
      }

    case PLAYER_POS_CHANGE:
      return {
        ...state,
        currentPosition: action.payload || 0
      }

    case PLAYER_DURATION_CHANGE:
      return {
        ...state,
        duration: action.payload || 0
      }

    default:
      return state
  }
}

const playerObj = new Audio()

const playerPosChannel = eventChannel(emitter => {
  const onTimeUpdate = () => emitter(playerObj.currentTime)
  playerObj.addEventListener("timeupdate", onTimeUpdate);
  return () => { playerObj.removeEventListener("timeupdate", onTimeUpdate) }
})

const playerDurationChannel = eventChannel(emitter => {
  const onDurationUpdate = () => emitter(playerObj.duration)
  playerObj.addEventListener("durationchange", onDurationUpdate);
  return () => { playerObj.removeEventListener("durationchange", onDurationUpdate) }
})

function* playSong(action) {
  const song = action.payload
  playerObj.src = `/song-stream/${song.id}`
  try {
    yield playerObj.play()
    yield put({type: PLAYER_PLAYBACK_STARTED})
  } catch(e) {
    yield put({type: PLAYER_PLAYBACK_ERROR, payload: e})
  }
}

function* pause() {
  yield playerObj.pause()
}

function* resume() {
  if(playerObj.src) {
    yield playerObj.play()
  }
}

function* posUpdated(pos) {
  yield put({type: PLAYER_POS_CHANGE, payload: pos})
}

function* durationUpdated(duration) {
  yield put({type: PLAYER_DURATION_CHANGE, payload: duration})
}

export function* saga() {
  yield takeEvery(playerPosChannel, posUpdated)
  yield takeEvery(playerDurationChannel, durationUpdated)
  yield takeEvery(PLAYER_PLAY_SONG, playSong)
  yield takeEvery(PLAYER_PAUSE, pause)
  yield takeEvery(PLAYER_RESUME, resume)
}
