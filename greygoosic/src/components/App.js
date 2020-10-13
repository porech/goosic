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

const App = () => {
  const dispatch = useDispatch();
  dispatch({ type: SEARCH_SONG, payload: "" });
  const options = [
    { linkTo: "/menu" },
    { linkTo: null },
    { linkTo: "/options" },
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
              <i className="icon settings black large" />
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
                <SongList></SongList>
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
