import React from "react";
import "./Searchbar.css";
import { GET_SONGS, getSongView } from "../state/songs";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_SONG, FILTER_SONGS } from "../state/searchedText";
const SearchBar = () => {
  let dispatch = useDispatch();
  let view = useSelector(getSongView);
  return (
    <div
      className="searchpane"
      onClick={() => {
        document.querySelector("#search").focus();
      }}
    >
      <i aria-hidden="true" className="search icon search-icon" />
      <input
        id="search"
        key="search"
        type="search"
        className="searchbar"
        autoComplete="off"
        placeholder={"Search here..."}
        onChange={(event) => {
          if (view && view.length > 0) {
            dispatch({
              type: FILTER_SONGS,
              payload: { view: view, filter: event.target.value },
            });
          } else {
            dispatch({ type: SEARCH_SONG, payload: event.target.value });
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
