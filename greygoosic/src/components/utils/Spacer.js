import React from "react";
const Spacer = ({ margin }) => {
  margin = margin ? margin : "3vh";
  return <div style={{ margin: margin }}></div>;
};
export default Spacer;
