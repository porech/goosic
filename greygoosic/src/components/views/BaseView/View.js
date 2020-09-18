import React from "react";
import "./View.css";
import SearchBar from "../../Searchbar";
import { getSearchedSongs } from "../../../state/songs";
import { useSelector, useDispatch } from "react-redux";
import Spacer from "../../utils/Spacer";
import { UPDATE_VIEW } from "../../../state/queue";
const View = ({ children }) => {
  const dispatch = useDispatch();
  let songs = useSelector(getSearchedSongs);
  dispatch({type: UPDATE_VIEW, payload: songs})
  return (
  <div className="view">
    <SearchBar view={songs}></SearchBar>
    <Spacer></Spacer>
    {children}
  </div>
  )
};
export default View;
