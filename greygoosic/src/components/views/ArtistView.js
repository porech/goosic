import React from "react";
import "./ArtistView.css";
const ArtistView = () => {
  let artistStyle = get("artistStyle");
  return <div style={artistStyle} className="artist-image"></div>;
};
export default ArtistView;
