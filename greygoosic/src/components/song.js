import React from "react";
import { connect } from "react-redux";
import { playSong } from "../actions";
import "./Song.css";

class Song extends React.Component {
  render = () => {
    let { title, artist } = this.props.song;
    //console.log("song", this.props.song);
    return (
      <div
        onClick={() => this.props.playSong(this.props.song)}
        className="song"
      >
        <div className="container">
          <img
            alt="avatar"
            src="https://www.mh-corp.com/img/icons/avatar.png"
            width="25"
            height="25"
            className="avatar"
          ></img>
          <div className="text">
            {artist} - {title}
          </div>
        </div>
        <div className="divider"></div>
      </div>
    );
  };
}

/* const playSong = id => {
  let audio = getAudioState.audio;
  audio.src = `/song-stream/${id}`;
  setAudioState({ audio });
  audio.play();
}; */
/* const mapStateToProps = state => {
  return {};
}; */
export default connect(null, { playSong })(Song);
