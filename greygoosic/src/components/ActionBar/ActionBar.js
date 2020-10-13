import React from "react";
import { Link } from "react-router-dom";
import "./ActionBar.css";
const ActionBar = (props) => {
  return (
    <div id="action-bar" className="action-bar ui grey inverted segment">
      <div className="ui inverted secondary menu">
        {props.children.map((child, i) => {
          if (props.options[i] && props.options[i].linkTo) {
            return (
              <Link
                to={props.options[i].linkTo}
                key={`actionbar-child-${i}`}
                className="item"
              >
                {child}
              </Link>
            );
          } else {
            return (
              // eslint-disable-next-line
              <a key={`actionbar-child-${i}`} className="item">
                {child}
              </a>
            );
          }
        })}
      </div>
    </div>
  );
};
export default ActionBar;
