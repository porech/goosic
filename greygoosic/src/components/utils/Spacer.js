import React from "react";
const Spacer = ({ margin, orientation }) => {
  margin = margin ? margin : "3vh";
  let styleConfig = { margin: margin };
  if (orientation && orientation === "horizontal") {
    styleConfig = { marginLeft: margin };
  } else if (orientation && orientation === "vertical") {
    styleConfig = { marginTop: margin };
  }

  return <div style={styleConfig}></div>;
};
export default Spacer;
