import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBar from "./Searchbar";
import SongList from "./SongList";
import NowPlaying from "./Nowplaying";
import "./App.css";
import ArtistView from "./views/ArtistView/ArtistView";
import AlbumView from "./views/AlbumView/AlbumView";
import MenuIcon from "./Menu/MenuIcon";
import ActionBar from "./ActionBar/ActionBar";
import Spacer from "./utils/Spacer";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_SONG } from "../state/searchedText";
import Menu from "./Menu/Menu";
import { getAnimationStatus } from "../state/options";
import Options from "./Options";
import { GET_SONGS } from "../state/songs";

const App = () => {
  const dispatch = useDispatch();
  dispatch({ type: SEARCH_SONG, payload: "" });
  const options = [
    { optionId: "menu-button", linkTo: "/menu" },
    { optionId: "search-bar", linkTo: null },
    { optionId: "refresh-button", linkTo: null, disposable: "true" },
    { optionId: "spacer", linkTo: null, disposable: "true" },
    { optionId: "settings", linkTo: "/options", disposable: "true" },
  ];
  const animationStatus = useSelector(getAnimationStatus);
  return (
    <div className={animationStatus === false ? "no-animations" : ""}>
      <Router>
        <Switch>
          <Route path="/menu">
            <Menu></Menu>
          </Route>
          <Route path="/">
            <ActionBar options={options}>
              <MenuIcon></MenuIcon>
              <SearchBar></SearchBar>
              <i
                id="refreshSongs"
                className={`redo icon refresh fixed-side`}
                style={{ right: "80px" }}
                onClick={() => {
                  dispatch({ type: GET_SONGS });
                }}
              />
              <i
                className="icon settings black large fixed-side"
                style={{ right: "10px" }}
              />
            </ActionBar>
            <Switch>
              <Route path="/artist">
                <ArtistView />
              </Route>
              <Route path="/album">
                <AlbumView />
              </Route>
              <Route path="/options">
                <Options></Options>
              </Route>
              <Route path="/">
                <SongList className="song-list"></SongList>
              </Route>
            </Switch>
            <NowPlaying></NowPlaying>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
export default App;
