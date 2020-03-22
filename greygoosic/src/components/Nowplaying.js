import React from "react";
import { connect } from "react-redux";
import "./Nowplaying.css";
class NowPlaying extends React.Component {
  render() {
    return (
      <div className="panel">
        <div className="action-icons">
          <i onClick={() => {}} className="backward icon"></i>
          <i onClick={() => {}} className="play circle icon"></i>
          <i onClick={() => {}} className="forward icon"></i>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { songs: state.songs };
};
export default connect(mapStateToProps)(NowPlaying);
