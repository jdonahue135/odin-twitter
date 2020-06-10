import React from "react";

import defaultPhoto from "../images/default_profile_pic.png";

class ProfilePic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHovered: false,
    };
  }

  handleHover() {
    this.setState({ isHovered: true });
  }

  handleBlur() {
    this.setState({ isHovered: false });
  }

  render() {
    const classList = "profile-pic profile-pic-" + this.props.size;
    return (
      <div className="profile-pic-container">
        {this.state.isHovered ? (
          <div
            className="profile-pic-overlay"
            onMouseLeave={this.handleBlur.bind(this)}
          />
        ) : null}
        <img
          onMouseEnter={this.handleHover.bind(this)}
          className={classList}
          src={!this.props.photo ? defaultPhoto : this.props.photo}
          alt="profile-pic"
        />
      </div>
    );
  }
}
export default ProfilePic;
