import React from "react";

import ProfileForm from "./ProfileForm";
import PhotoUpload from "./PhotoUpload";

class ProfileOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //0 based index to track what form is currently visible
      activeForm: null,
      bio: "",
      profilePicture: null,
    };

    this.forms = ["bio", "profilePicture", "header"];
  }
  componentDidMount() {
    this.setState({ activeForm: 0 });
  }
  handleBackClick() {
    this.setState({ activeForm: this.state.activeForm - 1 });
  }

  handleNextClick(value) {
    if (this.state.activeForm === 0) {
      this.setState({
        bio: value,
        activeForm: this.state.activeForm + 1,
      });
    } else {
      this.setState({
        profilePicture: value,
        activeForm: this.state.activeForm + 1,
      });
    }
  }

  handleSubmit(header) {
    console.log(header);
    this.props.onProfileSubmit(
      this.state.bio,
      this.state.profilePicture,
      header
    );
  }

  render() {
    return (
      <div>
        <PhotoUpload
          header={true}
          onBackClick={this.handleBackClick.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          active={this.forms[this.state.activeForm] === "header" ? true : false}
        />
        <PhotoUpload
          onBackClick={this.handleBackClick.bind(this)}
          onNext={this.handleNextClick.bind(this)}
          active={
            this.forms[this.state.activeForm] === "profilePicture"
              ? true
              : false
          }
        />
        <ProfileForm
          onTextInputChange={this.props.onTextInputChange}
          onNext={this.handleNextClick.bind(this)}
          onXClick={this.props.onXClick}
          active={this.forms[this.state.activeForm] === "bio" ? true : false}
        />
      </div>
    );
  }
}

export default ProfileOverlay;
