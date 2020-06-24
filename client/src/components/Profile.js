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
      tweets: null,
      user: null,
    };
  }

  componentDidMount() {
    this.fetchUserTweets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.fetchUserTweets();
    }
  }

  fetchUserTweets() {
    fetch("/users" + this.props.location.pathname + "/tweets")
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          tweets: res.tweets,
          user: res.user,
        })
      );
  }

  handleClick(e) {
    if (e.target.id === "Tweets") {
      this.setState({ tweetsSelected: true });
    } else {
      this.setState({ tweetsSelected: false });
    }
  }

  render() {
    if (!this.state.tweets || !this.state.user) {
      return (
        <div className="component">
          <div className="spinning-loader" />
        </div>
      );
    }
    const tweetCount =
      this.state.tweets.length === 1
        ? "1 Tweet"
        : this.state.tweets.length + " tweets";
    return (
      <div className="component">
        <div className="title-container profile-title-container">
          {renderGraphic(graphics.BACK)}
          <div className="profile-info-container">
            <p className="title profile-title">{this.state.user.name}</p>
            <p className="sub-title">{tweetCount}</p>
          </div>
        </div>
        <div className="main profile-main">
          <div className="header-image-container">
            {this.state.user.headerImage ? (
              <img src={this.state.user.headerImage} alt="header" />
            ) : (
              <div className="default-header-image" />
            )}
          </div>
          <ProfilePic size="lg" />
          <Button textContent="Set up profile" size="med" class="follow-btn" />
          <div className="profile-main-info-container">
            <p className="title profile-main-title">{this.state.user.name}</p>
            <p className="profile-handle">{"@" + this.state.user.username}</p>
            <div className="calendar-container">
              <img className="calendar-graphic" src={calendar} alt="calendar" />
              <p className="calendar-detail">Joined June 2020</p>
            </div>
            <div className="follow-info-container">
              <div className="follow-count-item">
                <p className="follow-count">
                  {this.state.user.following
                    ? this.state.user.following.length
                    : 0}
                </p>
                <p className="follow-count-label">&nbsp;Following</p>
              </div>
              <div className="follow-count-item">
                <p className="follow-count">
                  {this.state.user.followers
                    ? this.state.user.followers.length
                    : 0}
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
          {this.state.tweets.length > 0 ? (
            <TweetList
              user={this.props.user}
              tweets={this.state.tweets}
              class="profile"
              deleteTweet={this.props.onTweetDelete}
              onFollowChange={this.props.onClick}
              onLike={this.props.onLike}
              onRetweet={this.props.onRetweet}
              onReply={this.props.onReply}
            />
          ) : (
            <div className="tweetlist-info-container tweetlist-info-title-container">
              <p className="headline message-info-item">
                You haven’t Tweeted yet
              </p>
              <p className="sub-headline message-info-item">
                When you post a Tweet, it’ll show up here.
              </p>
              <Button
                size="med"
                textContent="Tweet Now"
                class="message-btn"
                onClick={this.props.onButtonClick}
              />
            </div>
          )}
        </div>
        <Recommendations
          user={this.props.user}
          onClick={this.props.onClick}
          onPathChange={this.props.onPathChange}
        />
      </div>
    );
  }
}

export default Profile;
