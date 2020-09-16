import React from "react";
import styled from "styled-components";
import View from "../BaseView/View";
import SongList from "../../SongList";
import ViewDetail from "../BaseView/ViewDetail"
import "./AlbumView.css";

const ViewSongList = styled(SongList)`
margin-top: 0;
`;
const AlbumView = () => {
  let albumCover = "https://previews.123rf.com/images/queezzard/queezzard1601/queezzard160100094/50263297-equalizzatore-icona-pu%C3%B2-essere-usato-come-logo-per-l-album-dj-set-concerti-banner-illustrazione-vett.jpg"

  return (
    <View>
      <ViewDetail objectId={12} name="My Album" cover={albumCover}></ViewDetail>
      <div className="song-list-container">
        <ViewSongList></ViewSongList>
      </div>
    </View>
  );
};
export default AlbumView;
