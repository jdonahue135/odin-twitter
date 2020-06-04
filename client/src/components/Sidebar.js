import React from "react";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";
import logo from "../images/Twitter_Logo_Blue.png";

const Sidebar = (props) => {
  //to change icons to blue change the svg style to include "fill: rgba(29,161,242,1.00)", height: 1.75rem
  const renderSidebarItem = (title) => {
    return (
      <div className="sidebar-item-container">
        {renderGraphic(graphics[title.toUpperCase()])}
        <p className="sidebar-label">{title}</p>
      </div>
    );
  };

  return (
    <div className="Sidebar">
      <img className="logo" src={logo} alt="logo" />
      {renderSidebarItem("Home")}
      {renderSidebarItem("Notifications")}
      {renderSidebarItem("Messages")}
      {renderSidebarItem("Profile")}
      {renderSidebarItem("More")}
      <div className="tweet-button tweet-button-lg">
        <p>Tweet</p>
      </div>
      <div className="profile">
        <div className="pic-container pic-container-sm"></div>
        <div className="id-container">
          <p className="profile-name">Your 14 char N...</p>
          <p className="profile-handle">@yourHandle</p>
        </div>
        {renderGraphic(graphics.PROFILE_OPTIONS)}
      </div>
    </div>
  );
};

export default Sidebar;
