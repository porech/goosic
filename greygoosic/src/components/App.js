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

const App = () => {
    return (
      <Router>
        <ActionBar>        
          <MenuIcon></MenuIcon>
          <SearchBar></SearchBar>
        </ActionBar>
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
      </Router>
    );
  }
export default App;
