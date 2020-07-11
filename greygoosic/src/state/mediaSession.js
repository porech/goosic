import { takeEvery, put } from "redux-saga/effects"
import { PLAYER_PLAY_SONG } from "./player"
import { eventChannel } from "redux-saga"
import {nextSong, pauseSong, previousSong, resumeSong, seekTo} from "../actions"

const setMetadata = (action) => {
  const song = action.payload
  /* eslint-disable-next-line */
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.metadata.title || song.file_name,
    artist: song.metadata.artist || "",
    artwork: [
      {
        src:
            "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2560&q=80",
        sizes: "128x128",
        type: "image/jpeg"
      }
    ]
  });
}

function* onPlay() {
  yield put(resumeSong())
}

function* onPause() {
  yield put(pauseSong())
}

function* onSeek(time) {
  yield put(seekTo(time))
}

function* onPrevious() {
  yield put(previousSong())
}

function* onNext() {
  yield put(nextSong())
}

export function* saga() {
  if(!("mediaSession" in navigator)) {
    return
  }

  const playChannel = eventChannel(emitter => {
    navigator.mediaSession.setActionHandler("play", () => emitter({}));
    return () => { navigator.mediaSession.setActionHandler("play", null) }
  })

  const pauseChannel = eventChannel(emitter => {
    navigator.mediaSession.setActionHandler("pause", () => emitter({}));
    return () => { navigator.mediaSession.setActionHandler("pause", null) }
  })

  const nextTrackChannel = eventChannel(emitter => {
    navigator.mediaSession.setActionHandler("nexttrack", () => emitter({}));
    return () => { navigator.mediaSession.setActionHandler("nexttrack", null) }
  })

  const previousTrackChannel = eventChannel(emitter => {
    navigator.mediaSession.setActionHandler("previoustrack", () => emitter({}));
    return () => { navigator.mediaSession.setActionHandler("previoustrack", null) }
  })

  const seekToChannel = eventChannel(emitter => {
    navigator.mediaSession.setActionHandler("seekto", (details) => emitter(details.seekTime));
    return () => { navigator.mediaSession.setActionHandler("seekto", null) }
  })

  yield takeEvery(PLAYER_PLAY_SONG, setMetadata)
  yield takeEvery(playChannel, onPlay)
  yield takeEvery(pauseChannel, onPause)
  yield takeEvery(seekToChannel, onSeek)
  yield takeEvery(previousTrackChannel, onPrevious)
  yield takeEvery(nextTrackChannel, onNext)
}
