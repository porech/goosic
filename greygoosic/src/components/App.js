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
import { useDispatch } from "react-redux";
import { SEARCH_SONG } from "../state/searchedText";
import Menu from "./Menu/Menu";

const App = () => {
  const dispatch = useDispatch();
  dispatch({ type: SEARCH_SONG, payload: "" });
  const options = [{ linkTo: "/menu" }, { linkTo: null }];
  return (
    <Router>
      <Switch>
        <Route path="/menu">
          <Menu></Menu>
        </Route>
        <Route path="/">
          <ActionBar options={options}>
            <MenuIcon></MenuIcon>
            <SearchBar></SearchBar>
          </ActionBar>
          <Spacer margin="10vh"></Spacer>
          <Switch>
            <Route path="/artist">
              <ArtistView />
            </Route>
            <Route path="/album">
              <AlbumView />
            </Route>
            <Route path="/">
              <SongList></SongList>
            </Route>
          </Switch>
          <NowPlaying></NowPlaying>
        </Route>
      </Switch>
    </Router>
  );
};
export default App;
