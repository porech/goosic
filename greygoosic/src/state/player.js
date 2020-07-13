import { eventChannel } from "redux-saga";
import { put, takeEvery } from "redux-saga/effects";
import { get } from "lodash";

export const PLAYER_PLAY_SONG = "PLAYER_PLAY_SONG";
export const PLAYER_PLAYBACK_STARTED = "PLAYER_PLAYBACK_STARTED";
export const PLAYER_PLAYBACK_ERROR = "PLAYER_PLAYBACK_ERROR";
export const PLAYER_PAUSE = "PLAYER_PAUSE";
export const PLAYER_RESUME = "PLAYER_RESUME";
export const PLAYER_POS_CHANGE = "PLAYER_POS_CHANGE";
export const PLAYER_DURATION_CHANGE = "PLAYER_DURATION_CHANGE";
export const PLAYER_ENDED = "PLAYER_ENDED";
export const PLAYER_SEEK = "PLAYER_SEEK";

const defaultState = {
  isPlaying: false,
  error: null,
  nowPlaying: null,
  currentPosition: 0,
  duration: 0,
};
export const getCurrentTitle = (state) =>
  get(state.player.nowPlaying, "metadata.title");
export const getCurrentArtist = (state) =>
  get(state.player.nowPlaying, "metadata.artist");
export const getCurrentFileName = (state) =>
  get(state.player.nowPlaying, "file_name");
export const getCurrentPosition = (state) => state.player.currentPosition;
export const getIsPlaying = (state) => state.player.isPlaying;
export const getNowPlaying = (state) => state.player.nowPlaying;

export const getDuration = (state) => state.player.duration;

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case PLAYER_PLAY_SONG:
      return {
        ...state,
        nowPlaying: action.payload,
      };

    case PLAYER_PLAYBACK_STARTED:
      return {
        ...state,
        isPlaying: true,
      };

    case PLAYER_PLAYBACK_ERROR:
      return {
        ...state,
        isPlaying: false,
        error: action.payload.toString(),
      };

    case PLAYER_PAUSE:
      return {
        ...state,
        isPlaying: false,
      };

    case PLAYER_RESUME:
      if (!state.nowPlaying) return state;
      return {
        ...state,
        isPlaying: true,
      };

    case PLAYER_POS_CHANGE:
      return {
        ...state,
        currentPosition: action.payload || 0,
      };

    case PLAYER_DURATION_CHANGE:
      return {
        ...state,
        duration: action.payload || 0,
      };

    case PLAYER_ENDED:
      return {
        ...state,
        isPlaying: false,
      };

    default:
      return state;
  }
};

const playerObj = new Audio();

const playerPosChannel = eventChannel((emitter) => {
  const onTimeUpdate = () => emitter(playerObj.currentTime);
  playerObj.addEventListener("timeupdate", onTimeUpdate);
  return () => {
    playerObj.removeEventListener("timeupdate", onTimeUpdate);
  };
});

const playerDurationChannel = eventChannel((emitter) => {
  const onDurationUpdate = () => emitter(playerObj.duration);
  playerObj.addEventListener("durationchange", onDurationUpdate);
  return () => {
    playerObj.removeEventListener("durationchange", onDurationUpdate);
  };
});

const playerEndedChannel = eventChannel((emitter) => {
  const onEnded = () => emitter({});
  playerObj.addEventListener("ended", onEnded);
  return () => {
    playerObj.removeEventListener("ended", onEnded);
  };
});

function* playSong(action) {
  const song = action.payload;
  playerObj.src = `/song-stream/${song.id}`;
  try {
    yield playerObj.play();
    yield put({ type: PLAYER_PLAYBACK_STARTED });
  } catch (e) {
    yield put({ type: PLAYER_PLAYBACK_ERROR, payload: e });
  }
}

function* pause() {
  yield playerObj.pause();
}

function* resume() {
  if (playerObj.src) {
    yield playerObj.play();
  }
}

function* posUpdated(pos) {
  yield put({ type: PLAYER_POS_CHANGE, payload: pos });
}

function* durationUpdated(duration) {
  yield put({ type: PLAYER_DURATION_CHANGE, payload: duration });
}

function* playEnded() {
  yield put({ type: PLAYER_ENDED });
}

function* seek(action) {
  if (playerObj.duration < action.payload) {
    return;
  }
  yield (playerObj.currentTime = action.payload);
}

export function* saga() {
  yield takeEvery(playerPosChannel, posUpdated);
  yield takeEvery(playerDurationChannel, durationUpdated);
  yield takeEvery(playerEndedChannel, playEnded);
  yield takeEvery(PLAYER_PLAY_SONG, playSong);
  yield takeEvery(PLAYER_PAUSE, pause);
  yield takeEvery(PLAYER_RESUME, resume);
  yield takeEvery(PLAYER_SEEK, seek);
}
