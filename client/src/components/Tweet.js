import React from "react";
import { Link } from "react-router-dom";

import { ClickAwayListener } from "@material-ui/core";

import ProfilePic from "./ProfilePic";
import { renderGraphic, formatDate } from "../helpers";
import { graphics } from "../constants";

class Tweet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
    };
  }
  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  handleLikeChange() {
    //send fetch request
    this.props.onLike(this.props.tweet._id);
  }

  render() {
    let id;
    let classList;
    let tweetOptionsText =
      this.props.currentUser._id === this.props.tweet.user._id
        ? "Delete"
        : "Unfollow @" + this.props.tweet.user.username;
    if (this.props.currentUser._id === this.props.tweet.user._id) {
      tweetOptionsText = "Delete";
      id = this.props.tweet._id;
      classList = "popup tweet-popup delete-tweet-popup";
    } else {
      id = this.props.tweet.user._id;
      classList = "popup tweet-popup";
      tweetOptionsText = this.props.currentUser.following.includes(
        this.props.tweet.user._id
      )
        ? "Unfollow @" + this.props.tweet.user.username
        : "Follow @" + this.props.tweet.user.username;
    }
    const graphic =
      tweetOptionsText === "Delete"
        ? "DELETE"
        : tweetOptionsText.replace(/ .*/, "").toUpperCase();

    return (
      <div>
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
        <div className="tweet-container">
          <Link
            to={"/" + this.props.tweet.user.username}
            onClick={this.props.handlePathChange}
          >
            <ProfilePic
              photo={
                this.props.tweet.user.profilePicture
                  ? this.props.tweet.user.profilePicture
                  : null
              }
              size="med"
            />
          </Link>
          <div className="tweet-main">
            <div className="tweet-header">
              <Link
                to={"/" + this.props.tweet.user.username}
                onClick={this.props.onPathChange}
              >
                <div className="tweet-name">{this.props.tweet.user.name}</div>
                <div className="tweet-username">
                  {"@" + this.props.tweet.user.username}
                </div>
              </Link>
              <div className="divider">.</div>
              <div className="tweet-date">
                {formatDate(this.props.tweet.date)}
              </div>
              <div
                className="popup-option-container"
                onClick={this.togglePopup.bind(this)}
              >
                {renderGraphic(graphics.TWEET_OPTIONS)}
              </div>
            </div>
            <div className="tweet-text">{this.props.tweet.text}</div>
            <div className="tweet-footer">
              {renderGraphic(graphics.REPLY)}
              {renderGraphic(graphics.RETWEET)}
              {renderGraphic(
                graphics.LIKE,
                false,
                this.handleLikeChange.bind(this)
              )}
              {renderGraphic(graphics.SHARE)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tweet;
