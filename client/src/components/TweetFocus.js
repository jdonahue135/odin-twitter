import React from "react";
import { ClickAwayListener } from "@material-ui/core";
import { Link } from "react-router-dom";

import { renderGraphic, formatDate } from "../helpers";
import { graphics } from "../constants";

import ProfilePic from "./ProfilePic";

class TweetFocus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
      tweet: null,
    };
  }

  componentDidMount() {
    console.log(this.props.match.params.tweetid);
    fetch("/tweets/status/" + this.props.match.params.tweetid)
      .then((res) => res.json())
      .then((res) => this.setState({ tweet: res.tweet }));
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  render() {
    if (!this.state.tweet) {
      return (
        <div className="component">
          <div className="title-container">
            {renderGraphic(graphics.BACK)}
            <div className="profile-info-container">
              <p className="title">Tweet</p>
            </div>
          </div>
          <div className="main">
            <div className="spinning-loader" />
          </div>
        </div>
      );
    }
    let id;
    let classList;
    let tweetOptionsText =
      this.props.user._id === this.state.tweet.user._id
        ? "Delete"
        : "Unfollow @" + this.state.tweet.user.username;
    if (this.props.user._id === this.state.tweet.user._id) {
      tweetOptionsText = "Delete";
      id = this.state.tweet._id;
      classList = "popup tweet-popup delete-tweet-popup";
    } else {
      id = this.state.tweet.user._id;
      classList = "popup tweet-popup";
      tweetOptionsText = this.props.user.following.includes(
        this.state.tweet.user._id
      )
        ? "Unfollow @" + this.state.tweet.user.username
        : "Follow @" + this.state.tweet.user.username;
    }
    const graphic =
      tweetOptionsText === "Delete"
        ? "DELETE"
        : tweetOptionsText.replace(/ .*/, "").toUpperCase();

    const { time, date } = formatDate(this.state.tweet.date, true);

    return (
      <div className="component">
        <div className="title-container tweet-focus-title-container">
          {renderGraphic(graphics.BACK)}
          <div className="profile-info-container">
            <p className="title">Tweet</p>
          </div>
        </div>
        <div className="main">
          {this.state.showPopup ? (
            <div>
              <ClickAwayListener onClickAway={this.togglePopup.bind(this)}>
                <div className={classList}>
                  {renderGraphic(graphics[graphic])}
                  <div
                    id={id}
                    className="popup-text-container tweet-options-text-container"
                    onClick={this.props.onClick}
                  >
                    {tweetOptionsText}
                  </div>
                </div>
              </ClickAwayListener>
              <div className="tweet-overlay" />
            </div>
          ) : null}
          <div className="tweet-container tweet-focus-container">
            <Link to={"/" + this.state.tweet.user.username}>
              <ProfilePic
                photo={
                  this.state.tweet.user.profilePicture
                    ? this.state.tweet.user.profilePicture
                    : null
                }
                size="med"
              />
            </Link>
            <div className="tweet-main">
              <div className="tweet-header tweet-focus-header">
                <Link to={"/" + this.state.tweet.user.username}>
                  <div className="tweet-name tweet-focus-name">
                    {this.state.tweet.user.name}
                  </div>
                  <div className="tweet-username tweet-focus-username">
                    {"@" + this.state.tweet.user.username}
                  </div>
                </Link>
                <div
                  className="popup-option-container"
                  onClick={this.togglePopup.bind(this)}
                >
                  {renderGraphic(graphics.TWEET_OPTIONS)}
                </div>
              </div>
            </div>
            <div className="tweet-body">
              <div className="tweet-text tweet-focus-text">
                {this.state.tweet.text}
              </div>
              <div className="tweet-focus-date-container">
                <div className="tweet-date">{time}</div>
                <div className="divider">.</div>
                <div className="tweet-date">{date}</div>
              </div>
            </div>
            <div className="tweet-footer tweet-focus-footer">
              {renderGraphic(graphics.REPLY)}
              {renderGraphic(graphics.RETWEET)}
              {renderGraphic(graphics.LIKE)}
              {renderGraphic(graphics.SHARE)}
            </div>
          </div>
        </div>
        <div className="replies-container" />
      </div>
    );
  }
}

export default TweetFocus;
