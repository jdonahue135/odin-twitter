import React from "react";
import { Link, Redirect } from "react-router-dom";

import { ClickAwayListener } from "@material-ui/core";

import ProfilePic from "./ProfilePic";
import { renderGraphic, formatDate, addTextStyling } from "../helpers";
import { graphics } from "../constants";

class Tweet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
      redirect: null,
    };
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  handleTweetClick(e) {
    //do not redirect if a profile link was clicked
    if (e.target.className === "handle") return;
    else this.setState({ redirect: true });
  }

  renderVerticalBreak() {
    if (this.props.tweet.photo) {
      return (
        <div className="large-vertical-break vertical-break tweet-list-vertical-break" />
      );
    } else {
      return <div className="vertical-break tweet-list-vertical-break" />;
    }
  }

  render() {
    if (!this.props.tweet) {
      return <div className="spinning-loader" />;
    }
    const tweet = this.props.tweet.retweetOf
      ? this.props.tweet.retweetOf
      : this.props.tweet;
    if (this.state.redirect) {
      return (
        <Redirect
          push
          to={"/status/" + tweet.user.username + "/" + tweet._id}
        />
      );
    }
    const text = tweet.text ? addTextStyling(tweet.text) : "";
    let handle = ["Replying to "];
    if (this.props.notification) {
      handle.push(text[0]);
      //split text into an array
      text.splice(0, 1);
    }

    let id;
    let classList = "popup tweet-popup";
    let tweetOptionsText;
    let graphic;
    if (this.props.currentUser) {
      if (this.props.currentUser._id === tweet.user._id) {
        tweetOptionsText = "Delete";
        id = tweet._id;
        classList = classList + " delete-tweet-popup";
      } else {
        id = tweet.user._id;
        classList = classList + " popup tweet-popup";
        tweetOptionsText = this.props.currentUser.following.includes(
          tweet.user._id
        )
          ? "Unfollow @" + tweet.user.username
          : "Follow @" + tweet.user.username;
      }
      graphic =
        this.props.currentUser._id === tweet.user._id
          ? "DELETE"
          : tweetOptionsText.replace(/ .*/, "").toUpperCase();
    }

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
        {this.props.tweet.retweetOf ? (
          <Link to={"/" + this.props.tweet.user.username}>
            <div className="retweet-label">
              {renderGraphic(graphics.RETWEET_SMALL)}
              <div>
                {this.props.currentUser.name === this.props.tweet.user.name
                  ? "You Retweeted"
                  : this.props.tweet.user.name + " Retweeted"}
              </div>
            </div>
          </Link>
        ) : null}
        {this.props.tweet.replyStatus ? this.renderVerticalBreak() : null}
        <Link
          to={"/" + tweet.user.username}
          onClick={this.props.handlePathChange}
        >
          <ProfilePic
            photo={tweet.user.profilePicture ? tweet.user.profilePicture : null}
            size="med"
          />
        </Link>
        <div className="tweet-main">
          <div className="tweet-header">
            <Link
              to={"/" + tweet.user.username}
              onClick={this.props.onPathChange}
            >
              <div className="tweet-name">{tweet.user.name}</div>
              <div className="tweet-username">{"@" + tweet.user.username}</div>
            </Link>
            <Link to={"/status/" + tweet.user.username + "/" + tweet._id}>
              <div className="divider">.</div>
              <div className="tweet-date">{formatDate(tweet.date)}</div>
            </Link>
            <div
              className="popup-option-container"
              onClick={this.togglePopup.bind(this)}
            >
              {renderGraphic(graphics.TWEET_OPTIONS)}
            </div>
          </div>
          {this.props.notification ? (
            <div className="replying-to">{handle}</div>
          ) : null}
          <div
            onClick={this.handleTweetClick.bind(this)}
            className="tweet-text"
          >
            {text}
          </div>
          {tweet.photo && !this.props.isOverlay ? (
            <div className="tweet-photo-container">
              <img className="tweet-photo" src={tweet.photo} alt="upload" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Tweet;
