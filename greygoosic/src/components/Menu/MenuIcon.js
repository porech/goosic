import React from "react";
import "./MenuIcon.css";
const MenuIcon = (props) => {
  return (
    <div className={"menu-icon-shelf"}>
      <i className={`${props.className} menu-icon icon th large`}></i>
    </div>
  );
};
export default MenuIcon;
