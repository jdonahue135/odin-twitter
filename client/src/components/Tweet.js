import React from "react";

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
  render() {
    const tweetOptionsText =
      this.props.currentUser._id === this.props.tweet.user._id
        ? "Delete"
        : "Unfollow @" + this.props.tweet.user.username;
    const classList =
      tweetOptionsText === "Delete"
        ? "popup tweet-popup delete-tweet-popup"
        : "popup tweet-popup";
    const id =
      this.props.currentUser._id === this.props.tweet.user._id
        ? this.props.tweet._id
        : this.props.tweet.user._id;
    return (
      <div>
        {this.state.showPopup ? (
          <div>
            <ClickAwayListener onClickAway={this.togglePopup.bind(this)}>
              <div className={classList}>
                {tweetOptionsText === "Delete"
                  ? renderGraphic(graphics.DELETE)
                  : renderGraphic(graphics.UNFOLLOW)}
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
          <ProfilePic
            photo={
              this.props.tweet.user.profilePicture
                ? this.props.tweet.user.profilePicture
                : null
            }
            size="med"
          />
          <div className="tweet-main">
            <div className="tweet-header">
              <div className="tweet-name">{this.props.tweet.user.name}</div>
              <div className="tweet-username">
                {"@" + this.props.tweet.user.username}
              </div>
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
              {renderGraphic(graphics.LIKE)}
              {renderGraphic(graphics.SHARE)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tweet;
