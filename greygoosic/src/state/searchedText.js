export const SEARCH_SONG = "SEARCH_SONG";
export const FILTER_SONGS = "FILTER_SONGS";
export const getSearchedText = (state) => state.searchedText;
export const reducer = (search = "", action) => {
  if (action.type === SEARCH_SONG) {
    return action.payload;
  }
  return search;
};
