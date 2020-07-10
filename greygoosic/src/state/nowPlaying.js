import {NEXT_SONG, PAUSE_SONG, PLAY_SONG, UPDATE_CURRENT_TIME, UPDATE_DURATION} from "../constants"

export const reducer = (nowPlayingInfo = null, action) => {
  switch (action.type) {
      //#TODO verificare se utile
    case PLAY_SONG:
      return { song: action.payload, isPlaying: true };
    case PAUSE_SONG:
      return { ...nowPlayingInfo, isPlaying: false };
    case NEXT_SONG:
      return {
        ...nowPlayingInfo,
        song: action.payload,
        url: action.payload.id ? `/song-stream/${action.payload.id} ` : "",
        isPlaying: true
      };

    case UPDATE_CURRENT_TIME:
      return {
        ...nowPlayingInfo,
        currentTime: action.payload
      };
    case UPDATE_DURATION:
      return {
        ...nowPlayingInfo,
        duration: action.payload
      };

    default:
      return nowPlayingInfo;
  }
};
