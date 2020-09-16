import { get } from "lodash";
export const STAR_ITEM = "STAR_ITEM";
export const getStarredItems = (state) =>
  get(state.starred, "starred");
let defaultState = {
    starred: []
}
export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case STAR_ITEM:
        let alreadyStarring;
        state.starred.forEach(e => {
            console.log(e,action.payload)
            if (e.id === action.payload.id) {
                alreadyStarring = [...state.starred]
                alreadyStarring.splice(action.payload)
            }
        });
        if (alreadyStarring) {
            return {starred: [...alreadyStarring]}
        } else {
            return {starred: [...state.starred, action.payload]};
        }
    default:
      return state;
  }
};

/* export function* saga() {
   
  } */