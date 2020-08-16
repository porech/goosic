import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SearchBar from "./Searchbar";
import SongList from "./SongList";
import NowPlaying from "./Nowplaying";
import "./App.css";
import ArtistView from "./views/ArtistView";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/artist">
            <ArtistView />
          </Route>
          <Route path="/">
            <SearchBar />
            <SongList></SongList>
          </Route>
        </Switch>
        <NowPlaying></NowPlaying>
      </Router>
    );
  }
}
/* const mapStateToProps = state => {
  console.log(state);
}; */
export default connect()(App);
