import { SEARCH_SONG } from "../constants";
export const getSearchedText = (state) => state.searchedText;
export const reducer = (search = "", action) => {
  if (action.type === SEARCH_SONG) {
    return action.payload;
  }
  return search;
};
