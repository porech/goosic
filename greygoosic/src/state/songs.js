import goosic from "../goosic";
import { put, takeEvery } from "redux-saga/effects";
import { getSearchedText } from "./searchedText";
import { get, isEmpty } from "lodash";
import { createSelector } from "reselect";

export const GET_SONGS = "GET_SONGS";
export const GET_SONGS_LOADING = "GET_SONGS_LOADING";
export const GET_SONGS_SUCCESS = "GET_SONGS_SUCCESS";
export const GET_SONGS_ERROR = "GET_SONGS_ERROR";

// Still not used here, it's dispatched by the queue-next when it has no songs
export const GET_SONGS_RANDOM = "GET_SONGS_RANDOM"

export const getSongs = (state) => state.songs.songs;
export const getLoadingSongs = (state) => state.loading;
export const getSongView = (state) => {return state.queue.view};
export const getSongFilter = (state) => {return state.queue.filter};

export const getSearchedSongs = createSelector(
  [getSongs, getSearchedText],
  (songs, searched) => {
    if (isEmpty(searched)) return songs;

    return songs.filter((s) => {
      const title = get(s, "metadata.title", "").toLowerCase();
      const artist = get(s, "metadata.artist", "").toLowerCase();
      const filename = get(s, "file_name", "").toLowerCase();
      const searchedLower = searched.toLowerCase();
      return (
        title.includes(searchedLower) ||
        artist.includes(searchedLower) ||
        filename.includes(searchedLower)
      );
    });
  }
);
export const getFilteredSongs = createSelector(
  [getSongView, getSongFilter],
  (songs, searched) => {
    if (isEmpty(searched)) return songs;
    if (!songs) return;
    return songs.filter((s) => {
      const title = get(s, "metadata.title", "").toLowerCase();
      const artist = get(s, "metadata.artist", "").toLowerCase();
      const filename = get(s, "file_name", "").toLowerCase();
      const searchedLower = searched.toLowerCase();
      return (
        title.includes(searchedLower) ||
        artist.includes(searchedLower) ||
        filename.includes(searchedLower)
      );
    });
  }
);
const defaultState = {
  songs: [],
  loading: false,
  error: false,
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_SONGS_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_SONGS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_SONGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        songs: action.payload,
      };

    default:
      return state;
  }
};

function* getSongsFromGoosic() {
  yield put({
    type: GET_SONGS_LOADING,
  });
  try {
    const response = yield goosic.get("song-list");
    yield put({ type: GET_SONGS_SUCCESS, payload: response.data });
  } catch (err) {
    yield put({ type: GET_SONGS_ERROR, payload: err });
  }
}

export function* saga() {
  yield takeEvery(GET_SONGS, getSongsFromGoosic);
  //fetch songs for the first time
  yield put({ type: GET_SONGS });
}
