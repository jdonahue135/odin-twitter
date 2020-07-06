import React from "react";
import { Link } from "react-router-dom";

import ProfilePic from "./ProfilePic";
import Button from "./Button";
import { addTextStyling } from "../helpers";

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reRender: false,
    };
  }

  render() {
    const name =
      this.props.user.name.length > 14
        ? this.props.user.name.slice(0, 13)
        : this.props.user.name;
    const buttonTextContent = this.props.currentUser.following.includes(
      this.props.user._id
    )
      ? "Following"
      : "Follow";
    const buttonClass = this.props.currentUser.following.includes(
      this.props.user._id
    )
      ? "unfollow-btn"
      : "follow-btn";
    return (
      <div className="user-container">
        <Link to={"/" + this.props.user.username}>
          <ProfilePic
            photo={
              this.props.user.profilePicture
                ? this.props.user.profilePicture
                : null
            }
            size="med"
          />
          <div className="profile-information-container">
            <div className="profile-name recommendations-profile-name">
              {name}
            </div>
            <div className="profile-handle">
              {"@" + this.props.user.username}
            </div>
            {this.props.showBio ? (
              <div className="bio">
                {this.props.user.bio
                  ? addTextStyling(this.props.user.bio)
                  : null}
              </div>
            ) : null}
          </div>
        </Link>
        {this.props.currentUser._id === this.props.user._id ? null : (
          <Button
            textContent={buttonTextContent}
            class={buttonClass}
            size="sm"
            onClick={this.props.onClick}
            id={this.props.user._id}
          />
        )}
      </div>
    );
  }
}

export default User;
