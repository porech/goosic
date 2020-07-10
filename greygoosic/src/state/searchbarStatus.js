import {EXPAND_COLLAPSE_SEARCH_BAR} from "../constants"

export const reducer = (
    expandCollapseSearchBar = "collapse",
    action
) => {
  if (action.type === EXPAND_COLLAPSE_SEARCH_BAR) {
    return action.payload;
  }
  return expandCollapseSearchBar;
};
