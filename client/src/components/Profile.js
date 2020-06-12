import React from "react";

import Button from "./Button";
import ProfilePic from "./ProfilePic";
import Recommendations from "./Recommendations";
import Options from "./Options";
import TweetList from "./TweetList";
import calendar from "../images/calendar.png";

import { renderGraphic } from "../helpers";
import { graphics } from "../constants";

const Profile = (props) => {
  return (
    <div className="component">
      <div className="title-container profile-title-container">
        {renderGraphic(graphics.BACK)}
        <div className="profile-info-container">
          <p className="title profile-title">{props.user.name}</p>
          <p className="sub-title">1 Tweet</p>
        </div>
      </div>
      <div className="main profile-main">
        <div className="header-image-container">
          {props.user.headerImage ? (
            <img src={props.user.headerImage} alt="header" />
          ) : (
            <div className="default-header-image" />
          )}
        </div>
        <ProfilePic size="lg" />
        <Button textContent="Set up profile" size="med" class="follow-btn" />
        <div className="profile-main-info-container">
          <p className="title profile-main-title">{props.user.name}</p>
          <p className="profile-handle">{"@" + props.user.username}</p>
          <div className="calendar-container">
            <img className="calendar-graphic" src={calendar} alt="calendar" />
            <p className="calendar-detail">Joined June 2020</p>
          </div>
          <div className="follow-info-container">
            <p className="follow-count">{props.user.following.length}</p>
            <p className="follow-count-label">&nbsp;Following</p>
            <p className="follow-count">{props.user.followers.length}</p>
            <p className="follow-count-label">&nbsp;Followers</p>
          </div>
        </div>
        <Options a="Tweets" b="Tweets & replies" class="profile-options" />
        <TweetList tweets={props.user.tweets} />
      </div>
      <Recommendations />
    </div>
  );
};

export default Profile;
