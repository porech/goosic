import React from "react";
import { connect } from "react-redux";
import "./Slider.css";

//import { } from "../actions";
class Slider extends React.Component {
  pointer;
  componentDidMount() {}
  render() {
    this.pointer = document.getElementById("pointer");

    return (
      <div
        className="slider"
        id="slider"
        onDragEnd={event => {
          this.setSlidePosition(event);
        }}
      >
        <div
          draggable="true"
          onDragStart={event => {
            this.startSliding(event);
          }}
          id="pointer"
          className="pointer"
        ></div>
      </div>
    );
  }
  startSliding = event => {};
  setSlidePosition = event => {
    console.log("X:", event);
  };
}

export default connect(null, {})(Slider);
