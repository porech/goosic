import goosic from "../goosic"
import { put, takeEvery } from 'redux-saga/effects'

export const GET_SONGS = "GET_SONGS"
export const GET_SONGS_LOADING = "GET_SONGS_LOADING"
export const GET_SONGS_SUCCESS = "GET_SONGS_SUCCESS"
export const GET_SONGS_ERROR = "GET_SONGS_ERROR"

export const getSongs = state => state.songs.songs

const defaultState = {
  songs: [],
  loading: false,
  error: false
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_SONGS_LOADING:
      return {
        ...state,
        loading: true
      }

    case GET_SONGS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    case GET_SONGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        songs: action.payload
      }

    default:
      return state;
  }
};

function* getSongsFromGoosic() {
  yield put({
    type: GET_SONGS_LOADING
  })
  try {
    const response = yield goosic.get("song-list");
    yield put({ type: GET_SONGS_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: GET_SONGS_ERROR, payload: err });
  }
}

export function* saga() {
  yield takeEvery(GET_SONGS, getSongsFromGoosic)
  yield put({ type: GET_SONGS })
}
