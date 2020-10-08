import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import Media from "react-media";
const ReactRouter = require("react-router");

const Menu = () => {
  const browserHistory = ReactRouter.useHistory();
  return (
    <div className="menu-outer-container">
      <div className="menu-back-button menu-overlay">
        <i
          onClick={() => {
            browserHistory.goBack();
          }}
          className="arrow circle left icon huge violet"
        ></i>
      </div>
      <Media
        queries={{
          small: "(max-width: 800px)",
          large: "(min-width: 800px)",
        }}
      >
        {(matches) => (
          <div className="menu-container">
            <Link className="menu-item" to="/artist">
              <i
                className={`menu-item-icon user circle left icon violet ${
                  matches.small ? "large" : "huge"
                }`}
              ></i>
              <br></br>
              <div className="menu-item-label">Artists</div>
            </Link>

            <Link className="menu-item" to="/album">
              <i
                className={`menu-item-icon bullseye left icon violet ${
                  matches.small ? "large" : "huge"
                }`}
              ></i>
              <br></br>
              <div className="menu-item-label">Albums</div>
            </Link>

            <Link className="menu-item" to="/">
              <i
                className={`menu-item-icon music circle left icon violet ${
                  matches.small ? "large" : "huge"
                }`}
              ></i>
              <br></br>
              <div className="menu-item-label">Songs</div>
            </Link>
          </div>
        )}
      </Media>
    </div>
  );
};

export default Menu;
