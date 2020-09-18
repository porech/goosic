import React from "react";
import { connect, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBar from "./Searchbar";
import SongList from "./SongList";
import NowPlaying from "./Nowplaying";
import "./App.css";
import ArtistView from "./views/ArtistView/ArtistView";
import AlbumView from "./views/AlbumView/AlbumView";
import { getSearchedSongs } from "../state/songs";
import Spacer from "./utils/Spacer";

const App = () => {
    return (
      <Router>
        <Switch>
          <Route path="/artist">
            <ArtistView />
          </Route>
          <Route path="/album">
            <AlbumView />
          </Route> 
          <Route path="/">
            <SearchBar></SearchBar>
            <SongList></SongList>
          </Route>
        </Switch>
        <NowPlaying></NowPlaying>
      </Router>
    );
  }
export default App;
