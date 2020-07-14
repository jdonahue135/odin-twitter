import React from "react";
import { Link } from "react-router-dom";

import Options from "./Options";
import User from "./User";
import Button from "./Button";

import { renderGraphic } from "../helpers";
import { graphics } from "../constants";

class Follow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      followersSelected: null,
    };
  }

  componentDidMount() {
    fetch("/users/" + this.props.match.params.username + "/follow")
      .then((res) => res.json())
      .then((user) => this.setState({ user }))
      .catch((err) => console.log(err));

    this.props.match.params.follow === "followers"
      ? this.setState({ followersSelected: true })
      : this.setState({ followersSelected: false });
  }

  handleClick(e) {
    if (e.target.id === "Followers") {
      this.setState({ followersSelected: true });
    } else {
      this.setState({ followersSelected: false });
    }
  }

  renderMessage() {
    if (
      !this.state.followersSelected &&
      this.state.user._id === this.props.user._id
    ) {
      return (
        <div className="follow-message-container follow-message-title-container">
          <p className="headline message-info-item">
            You aren’t following anyone yet
          </p>
          <p className="sub-headline message-info-item">
            When you do, they’ll be listed here and you’ll see their Tweets in
            your timeline.
          </p>
          <Link to={"/explore"}>
            <Button
              size="lg"
              textContent="Find people to follow"
              class="message-btn"
            />
          </Link>
        </div>
      );
    }
    let titleText;
    let subTitleText;
    if (!this.state.followersSelected) {
      titleText = "@" + this.state.user.username + " isn’t following anyone";
      subTitleText = "When they do, they’ll be listed here.";
    } else {
      titleText =
        this.state.user._id === this.props.user._id
          ? "You don't have any followers yet"
          : "@" + this.state.user.username + " doesn’t have any followers";
      subTitleText =
        this.state.user._id === this.props.user._id
          ? "When someone follows you, you’ll see them here"
          : "When someone follows them, they’ll be listed here.";
    }
    return (
      <div className="follow-message-container follow-message-title-container">
        <p className="headline message-info-item">{titleText}</p>
        <p className="sub-headline message-info-item">{subTitleText}</p>
      </div>
    );
  }

  render() {
    if (!this.state.user) {
      return (
        <div className="component">
          <div className="spinning-loader" />
        </div>
      );
    }
    let userList = this.state.followersSelected
      ? this.state.user.followers
      : this.state.user.following;
    for (let i = 0; i < userList.length; i++) {
      if (userList[i]._id === this.state.user._id) {
        userList.splice(i, 1);
      }
    }
    return (
      <div className="component">
        <div className="title-container follow-title-container">
          <div className="follow-info-container">
            {renderGraphic(graphics.BACK, null, () =>
              this.props.history.goBack()
            )}
            <p className="title follow-title">{this.state.user.name}</p>
            <p className="sub-title">{"@" + this.state.user.username}</p>
          </div>
        </div>
        <div className="main follow-main">
          <Options
            a="Followers"
            b="Following"
            class="follow-options"
            selected={this.state.followersSelected}
            onClick={this.handleClick.bind(this)}
          />
          <div className="users-container">
            {userList.length > 0 ? (
              userList.map((user) => (
                <User
                  currentUser={this.props.user}
                  user={user}
                  key={user._id + this.state.followersSelected}
                  onClick={this.props.onClick}
                  showBio={true}
                />
              ))
            ) : (
              <div>{this.renderMessage()}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Follow;
