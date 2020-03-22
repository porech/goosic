import React from "react";
import { connect } from "react-redux";
import SearchBar from "./Searchbar";
import SongList from "./Songlist";
import NowPlaying from "./Nowplaying";
import "./App.css";
class App extends React.Component {
  render() {
    return (
      <div>
        <audio id="audioPlayer"></audio>
        <SearchBar />
        <SongList></SongList>
        <NowPlaying></NowPlaying>
      </div>
    );
  }
}
/* const mapStateToProps = state => {
  console.log(state);
}; */
export default connect()(App);
