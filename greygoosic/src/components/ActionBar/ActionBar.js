import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ActionBar.css";

const ActionBar = (props) => {
  let size = useWindowSize();
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
                {props.options[i] &&
                props.options[i].disposable &&
                size.width < 600
                  ? ""
                  : child}
              </Link>
            );
          } else {
            return (
              // eslint-disable-next-line
              <a key={`actionbar-child-${i}`} className="item">
                {props.options[i] &&
                props.options[i].disposable &&
                size.width < 600
                  ? ""
                  : child}
              </a>
            );
          }
        })}
      </div>
    </div>
  );
};
// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
export default ActionBar;
