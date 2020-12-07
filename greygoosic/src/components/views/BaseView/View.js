import React from "react";
import "./View.css";
import { getSearchedSongs } from "../../../state/songs";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_VIEW } from "../../../state/queue";
import Spacer from "../../utils/Spacer";
const View = ({ children }) => {
  const dispatch = useDispatch();
  let songs = useSelector(getSearchedSongs);
  dispatch({ type: UPDATE_VIEW, payload: songs });
  return (
    <div>
      <Spacer orientation="vertical" margin="15vh"></Spacer>
      <div className="view">{children}</div>
    </div>
  );
};
export default View;
