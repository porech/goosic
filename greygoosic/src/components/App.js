import React from "react";
import { connect } from "react-redux";
import SearchBar from "./Searchbar";
import SongList from "./SongList";
import NowPlaying from "./Nowplaying";
import ArtistView from "./views/ArtistView";
import "./App.css";
class App extends React.Component {
  render() {
    return (
      <div>
        <div style={{ display: "flex", flexFlow: "column" }}>
          <ArtistView />
          {/*  <SearchBar />
          <SongList></SongList> */}
        </div>
        <NowPlaying></NowPlaying>
      </div>
    );
  }
}
/* const mapStateToProps = state => {
  console.log(state);
}; */
export default connect()(App);
