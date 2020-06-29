import React from "react";
import moment from "moment";

import Button from "./Button";
import ProfilePic from "./ProfilePic";
import Recommendations from "./Recommendations";
import Options from "./Options";
import TweetList from "./TweetList";
import Overlay from "./Overlay";
import calendar from "../images/calendar.png";

import { renderGraphic, addTextStyling } from "../helpers";
import { graphics } from "../constants";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetsSelected: true,
      tweets: null,
      user: null,
      popup: false,
      showBioForm: false,
      profileInputText: "",
      profilePic: null,
      headerPic: null,
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
  handleTweetDelete(e) {
    this.props.onTweetDelete(e);
    setTimeout(this.fetchUserTweets(), 1000);
  }
  handleFollowChange(e) {
    this.props.onClick(e);
    setTimeout(this.fetchUserTweets(), 1000);
  }
  handleRetweetChange(tweetID) {
    this.props.onRetweet(tweetID);
    setTimeout(this.fetchUserTweets(), 1000);
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

  showPopup() {
    this.setState({ popup: true, showBioForm: true });
  }

  hidePopup() {
    this.setState({
      popup: false,
      showBioForm: false,
      profileInputText: "",
    });
  }

  handleSubmit(image) {
    this.setState({ popup: false });
    this.props.onProfileUpdate(this.state.profileInputText, image);
    window.location.reload();
  }

  showBioForm() {
    this.setState({ showBioForm: true });
  }
  handleNextClick() {
    this.setState({ showBioForm: false });
  }
  handleTextInputChange(text) {
    this.setState({ profileInputText: text });
  }

  render() {
    if (!this.state.tweets || !this.state.user) {
      return (
        <div className="component">
          <div className="spinning-loader" />
        </div>
      );
    }
    const joinDate = moment(this.state.user.joinDate).format("MMM YYYY");

    const tweetCount =
      this.state.tweets.length === 1
        ? "1 Tweet"
        : this.state.tweets.length + " tweets";

    let buttonText = "Set up profile";
    if (this.state.user._id !== this.props.user._id) {
      buttonText = this.props.user.following.includes(this.state.user._id)
        ? "Following"
        : "Follow";
    }
    let buttonClass = "follow-btn";
    if (
      this.state.user._id !== this.props.user._id &&
      this.props.user.following.includes(this.state.user._id)
    ) {
      buttonClass = "unfollow-btn";
    }
    const buttonOnClick =
      this.state.user._id !== this.props.user._id
        ? this.props.onClick
        : this.showPopup.bind(this);
    return (
      <div className="component">
        {this.state.popup ? (
          <div className="profile-backdrop backdrop" />
        ) : null}
        {this.state.popup ? (
          <Overlay
            onProfileSubmit={this.handleSubmit.bind(this)}
            onXClick={this.hidePopup.bind(this)}
            onBackClick={this.showBioForm.bind(this)}
            onNext={this.handleNextClick.bind(this)}
            onTextInputChange={this.handleTextInputChange.bind(this)}
            profile={true}
            showBioForm={this.state.showBioForm}
          />
        ) : null}
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
          <ProfilePic size="lg" photo={this.state.user.profilePicture} />
          <Button
            textContent={buttonText}
            size="med"
            class={buttonClass}
            onClick={buttonOnClick}
            id={this.state.user._id}
          />
          <div className="profile-main-info-container">
            <p className="title profile-main-title">{this.state.user.name}</p>
            <p className="profile-handle">{"@" + this.state.user.username}</p>
            {this.state.user.bio ? (
              <p className="profile-bio">
                {addTextStyling(this.state.user.bio)}
              </p>
            ) : null}
            <div className="calendar-container">
              <img className="calendar-graphic" src={calendar} alt="calendar" />
              <p className="calendar-detail">{"Joined " + joinDate}</p>
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
              tweetsSelected={this.state.tweetsSelected}
              class="profile"
              deleteTweet={this.handleTweetDelete.bind(this)}
              onFollowChange={this.handleFollowChange.bind(this)}
              onLike={this.props.onLike}
              onRetweet={this.handleRetweetChange.bind(this)}
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
