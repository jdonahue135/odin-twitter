import React from "react";

import { svgDimensions } from "../constants";
import logo from "../images/Twitter_Logo_Blue.png";

const Sidebar = (props) => {
  //to change icons to blue change the svg style to include "fill: rgba(29,161,242,1.00)", height: 1.75rem
  const makeSidebarItem = (title) => {
    if (title === "Home" || title === "More") {
      return (
        <div className="sidebar-item-container">
          <svg className="sidebar-graphic" viewBox="0 0 24 24">
            <g>
              <path d={svgDimensions[title.toUpperCase() + 1]}></path>
              <path d={svgDimensions[title.toUpperCase() + 2]}></path>
            </g>
          </svg>
          <p className="sidebar-label">{title}</p>
        </div>
      );
    }
    return (
      <div className="sidebar-item-container">
        <svg className="sidebar-graphic" viewBox="0 0 24 24">
          <g>
            <path d={svgDimensions[title.toUpperCase()]}></path>
          </g>
        </svg>
        <p className="sidebar-label">{title}</p>
      </div>
    );
  };

  return (
    <div className="Sidebar">
      <img className="logo" src={logo} alt="logo" />
      {makeSidebarItem("Home")}
      {makeSidebarItem("Notifications")}
      {makeSidebarItem("Messages")}
      {makeSidebarItem("Profile")}
      {makeSidebarItem("More")}
      <div className="tweet-button tweet-button-lg">
        <p>Tweet</p>
      </div>
      <div className="profile">
        <div className="pic-container"></div>
        <div className="id-container">
          <p className="profile-name">Your 14 char N...</p>
          <p className="profile-handle">@yourHandle</p>
        </div>
        <svg className="profile-graphic">
          <g>
            <path d={svgDimensions.PROFILE_OPTIONS}></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Sidebar;
