import React from "react";
import { ClickAwayListener } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";

import ProfilePic from "./ProfilePic";
import Button from "./Button";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";
import logo from "../images/Twitter_Logo_Blue.png";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
    };
  }

  renderSidebarItem = (title) => {
    let selected = false;
    let path =
      title === "Profile"
        ? "/" + this.props.user.username
        : "/" + title.toLowerCase();
    if (this.props.location.pathname === "/" + title.toLowerCase()) {
      selected = true;
    }
    if (
      title === "Profile" &&
      this.props.location.pathname === "/" + this.props.user.username
    ) {
      selected = true;
    }
    return (
      <div>
        <Link to={path}>
          <div
            className={
              selected
                ? "sidebar-item-container graphic-selected"
                : "sidebar-item-container"
            }
          >
            {renderGraphic(graphics[title.toUpperCase()], selected)}
            <p className="sidebar-label">{title}</p>
          </div>
        </Link>
      </div>
    );
  };

  handleProfileClick() {
    this.setState({ isClicked: !this.state.isClicked });
  }
  handleClickAway() {
    if (this.state.isClicked === true) {
      this.setState({ isClicked: false });
    }
  }

  render() {
    const formatName =
      this.props.user.username.length > 14
        ? this.props.user.username.slice(0, 13) + "..."
        : this.props.user.username;
    return (
      <div className="sidebar">
        <Link to="/">
          <img
            className="logo"
            src={logo}
            alt="logo"
            onClick={this.props.onRouteChange}
          />
        </Link>
        {this.renderSidebarItem("Home")}
        {this.renderSidebarItem("Explore")}
        {this.props.unseenNotifications > 0 ? (
          <div className="notification-count">
            {this.props.unseenNotifications}
          </div>
        ) : null}
        {this.renderSidebarItem("Notifications")}
        {this.renderSidebarItem("Messages")}
        {this.renderSidebarItem("Profile")}
        <Button
          size="lg"
          onClick={this.props.onButtonClick}
          class="sidebar-tweet-button"
        />
        {renderGraphic(graphics.TWEET_COMPOSE, null, this.props.onButtonClick)}
        {this.state.isClicked ? (
          <ClickAwayListener onClickAway={this.handleClickAway.bind(this)}>
            <div className="popup profile-popup">
              <div
                onClick={this.props.onClick}
                className="popup-text-container"
              >
                {"Log out @" + this.props.user.username}
              </div>
            </div>
          </ClickAwayListener>
        ) : null}
        <div className="profile" onClick={this.handleProfileClick.bind(this)}>
          <ProfilePic
            size="sm"
            photo={this.props.user ? this.props.user.profilePicture : null}
          />
          <div className="id-container">
            <p className="profile-name">{formatName}</p>
            <p className="profile-handle">{"@" + this.props.user.username}</p>
          </div>
          {renderGraphic(graphics.PROFILE_OPTIONS)}
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
