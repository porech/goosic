import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import './ViewDetail.css'
import {STAR_ITEM, getStarredItems} from '../../../state/starred';

const ViewDetail = ({objectId, name, cover}) => {
    const dispatch = useDispatch();
    let starred = useSelector(getStarredItems)
    let starring = starred.length > 0 && starred.filter(s => s.id === objectId);
    let unstarring = !starring;
    console.log("unstarring", unstarring)
    return (
        <div className="viewdetail-container">
        {cover && <img alt="cover" src={cover} height="150px" className="viewdetail-cover" />}
        <div className="viewdetail-info-box">
        <div className="viewdetail-name">{name}</div>
        <div className="viewdetail-actions">
          <p className="viewdetail-action">
            <i id="viewdetail-star" className={`star icon ${starring ? "viewdetail-star-click" : ''} ${unstarring ? "viewdetail-star-unclick": ''}`} onClick={() => {dispatch({type: STAR_ITEM, payload: {id: objectId}})}}></i>
          </p>
          <p className="viewdetail-action">
            <i className="random icon"></i>
          </p>
          <p className="viewdetail-action">
            <i className="plus icon"></i>
          </p>
        </div>
      </div>
      </div>
    )
}

export default ViewDetail;