import React from "react";
import { Link, Redirect } from "react-router-dom";

import { ClickAwayListener } from "@material-ui/core";

import ProfilePic from "./ProfilePic";
import { renderGraphic, formatDate, formatTweetText } from "../helpers";
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

  formatText(string) {
    //deconstruct string into words
    const words = string.split(" ");

    //apply span stylings
    let formatArray = [];
    for (let i = 0; i < words.length; i++) {
      if (words[i][0] === "#") {
        formatArray.push(
          <span key={words[i] + " " + i} className="hashtag">
            {words[i]}
          </span>,
          " "
        );
      } else formatArray.push(words[i], " ");
    }

    //remove trailing space
    formatArray[formatArray.length - 1].trim();

    return formatArray;
  }
  handleTweetClick() {
    this.setState({ redirect: true });
  }

  render() {
    const tweet = this.props.tweet.retweetOf
      ? this.props.tweet.retweetOf
      : this.props.tweet;
    if (this.state.redirect) {
      return <Redirect to={"/" + tweet.user.username + "/" + tweet._id} />;
    }
    let text = tweet.text;
    if (tweet.text.indexOf("#") !== -1 || tweet.text.indexOf("@") !== -1) {
      text = formatTweetText(tweet.text);
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
        {this.props.isReply ? (
          <div className="vertical-break tweet-list-vertical-break" />
        ) : null}
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
            <Link to={"/" + tweet.user.username + "/" + tweet._id}>
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
          <div
            onClick={this.handleTweetClick.bind(this)}
            className="tweet-text"
          >
            {text}
          </div>
        </div>
      </div>
    );
  }
}

export default Tweet;
