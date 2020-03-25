import React from "react";
import { connect } from "react-redux";
import { nextSong } from "../actions";
import "./Song.css";

class Song extends React.Component {
  render = () => {
    let { title, artist } = this.props.song.metadata;
    return (
      <div
        onClick={() => {
          this.props.nextSong(this.props.song);
        }}
        className="song"
      >
        <div className="container">
          <div className="avatar">
            <i className="music icon"></i>
          </div>
          <div className="text">
            {`${artist} ${artist ? " - " : ""} ${title ||
              this.props.song.file_name ||
              "Unknown"}`}
          </div>
        </div>
        <div className="divider"></div>
      </div>
    );
  };
}

export default connect(null, { nextSong })(Song);
