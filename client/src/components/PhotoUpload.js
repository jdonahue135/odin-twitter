import React from "react";
import Button from "./Button";
import { renderGraphic } from "../helpers";
import { graphics } from "../constants";
import logo from "../images/Twitter_Logo_Blue.png";

class PhotoUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      isHidden: false,
    };
  }

  onFileChange(e) {
    this.setState({ image: e.target.files[0] });
  }

  onSubmit() {
    const image = this.state.image === "" ? null : this.state.image;
    this.props.handleSubmit(image);
  }
  onNext() {
    this.props.onSubmit(this.state.image);
    this.setState({ isHidden: true });
  }

  render() {
    if (this.state.isHidden) {
      return <div className="hidden" />;
    }
    const name = this.props.header ? "header" : "profile picture";
    const message = this.props.header
      ? "People who visit your profile will see it. Show your style."
      : "Have a favorite selfie? Upload it now.";
    return (
      <div className="overlay-form-container">
        <div
          className="overlay-top profile-overlay-top"
          onClick={this.props.onXClick}
        >
          {renderGraphic(graphics.BACK, null, this.props.onBackClick)}
          <img className="logo profile-form-logo" src={logo} alt="logo" />
          {this.state.image === "" ? (
            <Button
              class="profile-overlay-skip"
              textContent="Skip for now"
              size="med"
              onClick={this.onNext.bind(this)}
            />
          ) : (
            <Button
              class="profile-overlay-next"
              textContent="Next"
              size="sm"
              onClick={this.onNext.bind(this)}
            />
          )}
        </div>
        <div className="profile-form">
          <div className="profile-form-container">
            <div className="profile-form-title-container">
              <div className="headline">{"Pick a " + name}</div>
              <div className="sub-headline">{message}</div>
            </div>
            <div className="photo-upload">
              <div className="row">
                <form onSubmit={this.onSubmit.bind(this)}>
                  <div className="form-group">
                    <input
                      type="file"
                      onChange={this.onFileChange.bind(this)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhotoUpload;
