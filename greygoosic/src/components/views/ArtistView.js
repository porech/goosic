import React from "react";
import "./ArtistView.css";
import { getCurrentCover } from "../../state/artist";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_ARTIST_COVER } from "../../state/artist";
import { SEARCH_SONG } from "../../constants";
import View from "./View";
import SongList from "../SongList";
/**
 *
 */

const ArtistView = () => {
  const dispatch = useDispatch();
  const cover = useSelector(getCurrentCover);
  let artistCover =
    "https://dynamicmedia.livenationinternational.com/Media/q/g/e/ffee5410-d190-366f-a3b6-daeb9c8b9ca6.jpg";
  dispatch({ type: UPDATE_ARTIST_COVER, payload: artistCover });
  dispatch({ type: SEARCH_SONG, payload: "Miyavi" });
  return (
    <View>
      <img
        src={cover}
        height="150px"
        style={{
          borderRadius: "3px",
          margin: "20px",
        }}
      />
      <div style={{ display: "flex", flexFlow: "column", minWidth: "80vw" }}>
        <div className="artist-name">Miyavi</div>
        <SongList></SongList>
      </div>
    </View>
  );
};
export default ArtistView;
