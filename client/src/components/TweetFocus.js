import React from "react";
import { ClickAwayListener } from "@material-ui/core";
import { Link } from "react-router-dom";

import { renderGraphic, formatDate, formatTweetText } from "../helpers";
import { graphics } from "../constants";

import ProfilePic from "./ProfilePic";
import TweetList from "./TweetList";

class TweetFocus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
      tweet: null,
    };
  }

  componentDidMount() {
    this.fetchTweet();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.fetchTweet();
    }
  }

  fetchTweet() {
    fetch("/tweets/status/" + this.props.match.params.tweetid)
      .then((res) => res.json())
      .then((res) => this.setState({ tweet: res.tweet }))
      .catch((err) => console.log(err));
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  handleTweetDelete(e) {
    this.props.onTweetDelete(e);
    setTimeout(this.fetchTweet(), 1000);
  }
  handleFollowChange(e) {
    this.props.onClick(e);
    setTimeout(this.fetchTweet(), 1000);
  }
  handleRetweetChange(tweetID) {
    this.props.onRetweet(tweetID);
    setTimeout(this.fetchTweet(), 1000);
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
    let onClick;
    let tweetOptionsText =
      this.props.user._id === this.state.tweet.user._id
        ? "Delete"
        : "Unfollow @" + this.state.tweet.user.username;
    if (this.props.user._id === this.state.tweet.user._id) {
      onClick = this.props.onTweetDelete;
      tweetOptionsText = "Delete";
      id = this.state.tweet._id;
      classList = "popup tweet-popup delete-tweet-popup";
    } else {
      onClick = this.props.onClick;
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

    const text =
      this.state.tweet.text.indexOf("#") !== -1
        ? formatTweetText(this.state.tweet.text)
        : this.state.tweet.text;

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
                  <Link to="/home">
                    <div
                      id={id}
                      className="popup-text-container tweet-options-text-container"
                      onClick={onClick}
                    >
                      {tweetOptionsText}
                    </div>
                  </Link>
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
              <div className="tweet-text tweet-focus-text">{text}</div>
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
        <div className="replies-container">
          <TweetList
            tweets={this.state.tweet.replies}
            user={this.props.user}
            deleteTweet={this.handleTweetDelete.bind(this)}
            onFollowChange={this.handleFollowChange.bind(this)}
            onLike={this.props.onLike}
            onRetweet={this.handleRetweetChange.bind(this)}
            onReply={this.props.onReply}
            focus={true}
          />
        </div>
      </div>
    );
  }
}

export default TweetFocus;
