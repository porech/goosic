import {GET_SONGS} from "../constants"

export const getSongs = state => state.songs

export const reducer = (songs = [], action) => {
  switch (action.type) {
    case GET_SONGS:
      return action.payload;
    default:
      return songs;
  }
};
