import React from "react";
import "./Searchbar.css";
import { GET_SONGS } from "../state/songs";
import { useDispatch } from "react-redux";
import { search } from '../actions';
const SearchBar = () => {
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
            dispatch(search(event.target.value));
          }}/>
        <i aria-hidden="true" id="refreshSongs" className={`redo icon refresh`} onClick={() => {dispatch({type: GET_SONGS})}}/>
      </div>
    );
  
}

export default SearchBar;
