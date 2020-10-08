import React from "react";
import { useDispatch } from "react-redux";
import "./ViewDetail.css";
import { QUEUE_SHUFFLE_ON, QUEUE_SONG_FROM_VIEW } from "../../../state/queue";
import Star from "../../Star";
import { random } from "lodash";

const ViewDetail = ({ objectId, name, cover, songs }) => {
  const dispatch = useDispatch();
  return (
    <div className="viewdetail-container">
      {cover && (
        <img
          alt="cover"
          src={cover}
          height="150px"
          className="viewdetail-cover"
        />
      )}
      <div className="viewdetail-info-box">
        <div className="viewdetail-name">{name}</div>
        <div className="viewdetail-actions">
          <p className="viewdetail-action">
            <Star id={objectId}></Star>
          </p>
          <p className="viewdetail-action">
            <i
              className="random icon"
              onClick={() => {
                dispatch({ type: QUEUE_SHUFFLE_ON });
                let viewIndex = random(0, songs.length - 1);
                dispatch({
                  type: QUEUE_SONG_FROM_VIEW,
                  payload: { view: songs, viewIndex: viewIndex },
                });
              }}
            ></i>
          </p>
          <p className="viewdetail-action">
            <i className="plus icon"></i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;
