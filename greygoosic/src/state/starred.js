import { get } from "lodash";
export const STAR_ITEM = "STAR_ITEM";
export const UNSTAR_ITEM = "UNSTAR_ITEM";
export const getStarredItems = (state) => get(state.starred, "starred");
let defaultState = {
  starred: [],
};
export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case STAR_ITEM:
      return { starred: [...state.starred, action.payload] };
    case UNSTAR_ITEM:
      let nowStarred = [...state.starred];
      let toBeUnstarred = nowStarred.find((s) => s.id === action.payload.id);
      nowStarred.splice(nowStarred.indexOf(toBeUnstarred), 1);
      return { starred: nowStarred };
    default:
      return state;
  }
};

/* export function* saga() {
   
  } */
