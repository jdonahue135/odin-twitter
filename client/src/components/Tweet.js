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
      likeStatus: false,
      likeCount: null,
      retweetStatus: false,
      retweetCount: null,
    };
  }

  componentDidMount() {
    const likeStatus = this.props.tweet.likes.includes(
      this.props.currentUser._id
    )
      ? true
      : false;
    const retweetStatus = this.props.tweet.retweets.includes(
      this.props.currentUser._id
    )
      ? true
      : false;
    this.setState({
      likeStatus: likeStatus,
      retweetStatus: retweetStatus,
      likeCount: this.props.tweet.likes.length,
      retweetCount: this.props.tweet.retweets.length,
    });
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  handleLikeChange() {
    this.props.onLike(this.props.tweet._id);
    const likeCount = this.state.likeStatus
      ? this.state.likeCount - 1
      : this.state.likeCount + 1;
    this.setState({
      likeStatus: !this.state.likeStatus,
      likeCount: likeCount,
    });
  }

  handleRetweetChange() {
    const retweetCount = this.state.retweetStatus
      ? this.state.retweetCount - 1
      : this.state.retweetCount + 1;
    this.setState({
      retweetStatus: !this.state.retweetStatus,
      retweetCount: retweetCount,
    });
    this.props.onRetweet(this.props.tweet._id);
  }

  renderTweetGraphic(name) {
    const selected = this.state[name + "Status"] ? true : false;
    const functionString =
      "handle" + name[0].toUpperCase() + name.slice(1) + "Change";
    return (
      <div className="tweet-graphic-item">
        {renderGraphic(
          graphics[name.toUpperCase()],
          selected,
          this[functionString].bind(this)
        )}

        {this.state[name + "Count"] > 0 ? (
          <div className={"tweet-footer-count " + name + "-count"}>
            {this.state[name + "Count"]}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const tweet = this.props.tweet.retweetOf
      ? this.props.tweet.retweetOf
      : this.props.tweet;
    let id;
    let classList = "popup tweet-popup";
    let tweetOptionsText;

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
    const graphic =
      this.props.currentUser._id === tweet.user._id
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
          <Link
            to={"/" + tweet.user.username}
            onClick={this.props.handlePathChange}
          >
            <ProfilePic
              photo={
                tweet.user.profilePicture ? tweet.user.profilePicture : null
              }
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
                <div className="tweet-username">
                  {"@" + tweet.user.username}
                </div>
              </Link>
              <div className="divider">.</div>
              <div className="tweet-date">{formatDate(tweet.date)}</div>
              <div
                className="popup-option-container"
                onClick={this.togglePopup.bind(this)}
              >
                {renderGraphic(graphics.TWEET_OPTIONS)}
              </div>
            </div>
            <div className="tweet-text">{tweet.text}</div>
            <div className="tweet-footer">
              <div className="tweet-graphic-item">
                {renderGraphic(graphics.REPLY)}
              </div>
              {this.renderTweetGraphic("retweet")}
              {this.renderTweetGraphic("like")}
              <div className="tweet-graphic-item">
                {renderGraphic(graphics.SHARE)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tweet;
