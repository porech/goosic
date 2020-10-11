import { get } from "lodash";

export const UPDATE_ARTIST_COVER = "UPDATE_ARTIST_COVER";
const defaultState = {};
export const reducer = (state = defaultState, action) => {
  if (action.type === UPDATE_ARTIST_COVER) {
    //console.log("payload", action.payload);
    return {
      ...state,
      artistCover: action.payload,
    };
  }

  return state;
};
export const getCurrentCover = (state) => get(state.artist, "artistCover");
