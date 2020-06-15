import React from "react";

import Button from "./Button";
import ProfilePic from "./ProfilePic";
import Recommendations from "./Recommendations";
import Options from "./Options";
import TweetList from "./TweetList";
import calendar from "../images/calendar.png";

import { renderGraphic } from "../helpers";
import { graphics } from "../constants";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetsSelected: true,
    };
  }

  handleClick(e) {
    if (e.target.id === "Tweets") {
      this.setState({ tweetsSelected: true });
    } else {
      this.setState({ tweetsSelected: false });
    }
  }
  render() {
    const tweetCount =
      this.props.user.tweets.length === 1
        ? "1 Tweet"
        : this.props.user.tweets.length + " tweets";
    return (
      <div className="component">
        <div className="title-container profile-title-container">
          {renderGraphic(graphics.BACK)}
          <div className="profile-info-container">
            <p className="title profile-title">{this.props.user.name}</p>
            <p className="sub-title">{tweetCount}</p>
          </div>
        </div>
        <div className="main profile-main">
          <div className="header-image-container">
            {this.props.user.headerImage ? (
              <img src={this.props.user.headerImage} alt="header" />
            ) : (
              <div className="default-header-image" />
            )}
          </div>
          <ProfilePic size="lg" />
          <Button textContent="Set up profile" size="med" class="follow-btn" />
          <div className="profile-main-info-container">
            <p className="title profile-main-title">{this.props.user.name}</p>
            <p className="profile-handle">{"@" + this.props.user.username}</p>
            <div className="calendar-container">
              <img className="calendar-graphic" src={calendar} alt="calendar" />
              <p className="calendar-detail">Joined June 2020</p>
            </div>
            <div className="follow-info-container">
              <div className="follow-count-item">
                <p className="follow-count">
                  {this.props.user.following.length}
                </p>
                <p className="follow-count-label">&nbsp;Following</p>
              </div>
              <div className="follow-count-item">
                <p className="follow-count">
                  {this.props.user.followers.length}
                </p>
                <p className="follow-count-label">&nbsp;Followers</p>
              </div>
            </div>
          </div>
          <Options
            a="Tweets"
            b="Tweets & replies"
            class="profile-options"
            selected={this.state.tweetsSelected}
            onClick={this.handleClick.bind(this)}
          />
          {this.props.user.tweets.length > 0 ? (
            <TweetList tweets={this.props.user.tweets} />
          ) : (
            <div className="tweetlist-info-container tweetlist-info-title-container">
              <p className="headline message-info-item">
                You haven’t Tweeted yet
              </p>
              <p className="sub-headline message-info-item">
                When you post a Tweet, it’ll show up here.
              </p>
              <Button size="med" textContent="Tweet Now" class="message-btn" />
            </div>
          )}
        </div>
        <Recommendations />
      </div>
    );
  }
}

export default Profile;
