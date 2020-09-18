import React from "react";
import { getCurrentCover } from "../../../state/artist";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { UPDATE_ARTIST_COVER } from "../../../state/artist";
import { SEARCH_SONG } from "../../../state/searchedText";
import View from "../BaseView/View";
import SongList from "../../SongList";
import ViewDetail from "../BaseView/ViewDetail"
import "./ArtistView.css";
import { getSearchedSongs, getFilteredSongs } from "../../../state/songs";
import SearchBar from "../../Searchbar";
import Spacer from "../../utils/Spacer";

const ViewSongList = styled(SongList)`
margin-top: 0;
`;
const ArtistView = () => {
  const dispatch = useDispatch();
  let artistCover =
    "https://dynamicmedia.livenationinternational.com/Media/q/g/e/ffee5410-d190-366f-a3b6-daeb9c8b9ca6.jpg";
  dispatch({ type: UPDATE_ARTIST_COVER, payload: artistCover });
  dispatch({ type: SEARCH_SONG, payload: "Miyavi" });
  let cover = useSelector(getCurrentCover);
  let artistSongs = useSelector(getSearchedSongs);
  let viewSongs = useSelector(getFilteredSongs);
  if (!viewSongs || viewSongs.length === 0) {
    viewSongs = artistSongs;
  }
  if (!cover) {
    cover = artistCover;
  }

  return (
    <View>
      <ViewDetail objectId={1} name="Miyavi" cover={artistCover} songs={viewSongs}></ViewDetail>
      <div className="song-list-container">
        <ViewSongList></ViewSongList>
      </div>
    </View>
  );
};
export default ArtistView;
