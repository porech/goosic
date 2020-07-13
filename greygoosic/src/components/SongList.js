import React from "react";
import "./SongList.css";
import Song from "./cards/Song";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSongs } from "../actions";
import { getSongs, getLoadingSongs } from "../state/songs";
import { getNowPlaying } from "../state/player";
import { getSearchedText } from "../state/searchedText";
var searchResults = [];

const SongList = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector(getNowPlaying);
  const songs = useSelector(getSongs);
  const searchedText = useSelector(getSearchedText);
  const isLoading = useSelector(getLoadingSongs);

  //shows a loading message
  const showLoadingMessage = () => {
    return <div>Loading...</div>;
  };
  //shows a message to inform the user that songs array in state is empty
  const showNoSongsMessage = () => {
    return (
      <div>
        No songs in list, or backend unavailable. In case, please add music
        folder on Goosic to see it here :)
      </div>
    );
  };
  return (
    <div className="song-list">
      <div>
        {!songs || songs.length === 0 ? (
          <div className="ui info icon message">
            <i className="info icon" />
            <div className="header">
              {isLoading && showLoadingMessage()}
              {!isLoading && showNoSongsMessage()}
            </div>
          </div>
        ) : (
          (searchResults = songs
            .filter((song) => {
              if (searchedText === "") {
                return song;
              } else {
                let { title, artist } = song.metadata;
                let fileName = song.file_name;
                if (
                  (title &&
                    title.toLowerCase().includes(searchedText.toLowerCase())) ||
                  (artist &&
                    artist
                      .toLowerCase()
                      .includes(searchedText.toLowerCase())) ||
                  (fileName &&
                    fileName.toLowerCase().includes(searchedText.toLowerCase()))
                ) {
                  searchResults.push(song);
                  return song;
                } else {
                  return "";
                }
              }
            })
            .map((song, index) => {
              return (
                <Song
                  nowPlaying={!!(nowPlaying && nowPlaying.id === song.id)}
                  tabIndex={index}
                  key={song.id}
                  song={song}
                  onClick={() => dispatch(enqueueSongs(songs, index, true))}
                />
              );
            }))
        )}
        {searchResults.length === 0 && searchedText !== "" ? (
          <div>Nothing found!</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default SongList;
