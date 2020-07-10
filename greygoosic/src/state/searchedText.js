import {SEARCH_SONG} from "../constants"

export const reducer = (search = "", action) => {
  if (action.type === SEARCH_SONG) {
    return action.payload;
  }
  return search;
};