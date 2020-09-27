import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStarredItems, STAR_ITEM, UNSTAR_ITEM } from '../state/starred';
import './Star.css'
const Star = ({id, starring}) => {
    const dispatch = useDispatch();
    let starred = useSelector(getStarredItems);
    if (starring === undefined) {
        let starring = starred.length > 0 && starred.filter(s => s.id === id).length > 0 ? true : false;
        if (!starring || starring.length === 0) {
            starring = false;
        } 
        return (
            <i key={`star-${id}`} className={`star icon ${starring ? "star-click" : ''} ${!starring ? "star-unclick": ''}`} onClick={e => {
                e.stopPropagation();
                if (starring === true) {
                    dispatch({type: UNSTAR_ITEM, payload: {id: id}})
                } else {
                    dispatch({type: STAR_ITEM, payload: {id: id}})
                }
            }}/>
        )
    } else {
        return (
            <i key={`star-${id}`} className={`star icon ${starring ? "star-click" : ''} ${!starring ? "star-unclick": ''}`}/>
        )
     }
}

export default Star;