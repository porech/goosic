import React from "react";
import "./ArtistView.css";
import { getCurrentCover } from "../../state/artist";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { UPDATE_ARTIST_COVER } from "../../state/artist";
import { SEARCH_SONG } from "../../state/searchedText";
import View from "./View";
import SongList from "../SongList";
/**
 *
 */

const ArtistView = () => {
  const dispatch = useDispatch();
  let artistCover =
    "https://dynamicmedia.livenationinternational.com/Media/q/g/e/ffee5410-d190-366f-a3b6-daeb9c8b9ca6.jpg";
  dispatch({ type: UPDATE_ARTIST_COVER, payload: artistCover });
  dispatch({ type: SEARCH_SONG, payload: "Miyavi" });
  let cover = useSelector(getCurrentCover);
  if (!cover) {
    cover = artistCover;
  }
  const ViewSongList = styled(SongList)`
    margin-top: 0;
  `;
  return (
    <View>
      <div className="artist-info">
        <img src={cover} height="150px" className="artist-cover" />
        <div className="artist-info-text-actions">
          <div className="artist-name">Miyavi</div>
          <div className="actions">
            <p className="action">
              <i className="star icon"></i>
            </p>
            <p className="action">
              <i className="random icon"></i>
            </p>
            <p className="action">
              <i className="plus icon"></i>
            </p>
          </div>
        </div>
      </div>
      <div className="song-list-container">
        <ViewSongList></ViewSongList>
      </div>
    </View>
  );
};
export default ArtistView;
