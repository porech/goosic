import React from "react";
import "./Searchbar.css";
import { GET_SONGS } from "../state/songs";
import { useDispatch } from "react-redux";
import { SEARCH_SONG, FILTER_SONGS } from "../state/searchedText";
import { UPDATE_VIEW } from "../state/queue";
const SearchBar = ({view}) => {
    let dispatch = useDispatch();
    return (
      <div
        className="searchpane"
        onClick={() => {
          document.querySelector("#search").focus();
        }}
      >
        <i aria-hidden="true" className="search icon search-icon"/>
        <input
          id="search"
          key="search"
          type="search"
          className="searchbar"
          autoComplete="off"
          placeholder={"Search here..."}
          onChange={event => {
            if (view) {
                dispatch({type: FILTER_SONGS, payload: { view: view, filter: event.target.value}});
            } else {
              dispatch({type: SEARCH_SONG, payload: event.target.value});
            }
          }}/>
        <i aria-hidden="true" id="refreshSongs" className={`redo icon refresh`} onClick={() => {dispatch({type: GET_SONGS})}}/>
      </div>
    );
  
}

export default SearchBar;
