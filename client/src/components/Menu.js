import React from "react";

import { svgDimensions } from "../constants";
import logo from "../images/Twitter_Logo_Blue.png";

const Menu = (props) => {
  //to change icons to blue change the svg style to include "fill: rgba(29,161,242,1.00)", height: 1.75rem
  const makeMenuIcon = (title) => {
    if (title === "Home") {
      return (
        <div>
          <svg className="menu-icon" viewBox="0 0 24 24">
            <g>
              <path d={svgDimensions.HOME1}></path>
              <path d={svgDimensions.HOME2}></path>
            </g>
          </svg>
          <p>{title}</p>
        </div>
      );
    }
    return (
      <div>
        <svg className="menu-icon" viewBox="0 0 24 24">
          <g>
            <path d={svgDimensions[title.toUpperCase()]}></path>
          </g>
        </svg>
        <p>{title}</p>
      </div>
    );
  };

  return (
    <div>
      <img className="logo" src={logo} alt="logo" />
      {makeMenuIcon("Home")}
      {makeMenuIcon("Notifications")}
      {makeMenuIcon("Messages")}
      {makeMenuIcon("Profile")}
    </div>
  );
};

export default Menu;
