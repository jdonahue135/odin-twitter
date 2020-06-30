import React from "react";
import { Link } from "react-router-dom";

import Options from "./Options";
import User from "./User";

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
          <Link
            to={"/" + this.state.user.username}
            onClick={this.props.onPathChange}
          >
            {renderGraphic(graphics.BACK)}
          </Link>
          <div className="follow-info-container">
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
            {userList.map((user) => (
              <User
                currentUser={this.props.user}
                user={user}
                key={user._id + this.state.followersSelected}
                onClick={this.props.onClick}
                showBio={true}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Follow;
