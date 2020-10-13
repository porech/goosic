import { get } from "lodash";
import { REPEAT_SONGS, SHUFFLE_SONGS } from "../constants";
export const getAnimationStatus = (state) => get(state.options, "animations");
export const getOptions = (state) => get(state, "options");

export const reducer = (options = [], action) => {
  switch (action.type) {
    case SHUFFLE_SONGS:
      return {
        ...options,
        shuffle: !action.payload,
      };
    case REPEAT_SONGS:
      return {
        ...options,
        repeat: !action.payload,
      };
    default:
      return options;
  }
};
