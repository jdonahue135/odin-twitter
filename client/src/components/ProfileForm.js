import React from "react";

import Button from "./Button";
import { renderGraphic } from "../helpers";
import { graphics } from "../constants";
import logo from "../images/Twitter_Logo_Blue.png";

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      textInput: "",
    };
  }

  handleTextareaClick() {
    //focuses on textarea if label is clicked
    document.querySelector(".profile-input").focus();
    this.setState({ selected: true });
  }

  handleTextInputChange(e) {
    this.setState({ textInput: e.target.value });
  }

  handleNextClick() {
    //stores new bio in ProfileOverlay component
    this.props.onNext(this.state.textInput);
    this.setState({
      textInput: "",
      selected: false,
    });
  }

  render() {
    if (!this.props.active) {
      return <div className="hidden" />;
    }
    const selected = this.state.selected ? "selected" : null;
    return (
      <div className="overlay-form-container">
        <div className="overlay-top profile-overlay-top">
          {renderGraphic(graphics.BACK, null, this.props.onXClick)}
          <img className="logo profile-form-logo" src={logo} alt="logo" />
          {this.state.textInput.length === 0 ? (
            <Button
              class="profile-overlay-skip"
              textContent="Skip for now"
              size="med"
              onClick={this.handleNextClick.bind(this)}
            />
          ) : (
            <Button
              class="profile-overlay-next"
              textContent="Next"
              size="sm"
              onClick={this.handleNextClick.bind(this)}
            />
          )}
        </div>
        <div className="profile-form">
          <div className="profile-form-container">
            <div className="profile-form-title-container">
              <div className="headline">Describe yourself</div>
              <div className="sub-headline">
                What makes you special? Don't think too hard, just have fun with
                it.
              </div>
            </div>
            <div className={"profile-input-container " + selected}>
              <div
                className={"label " + selected}
                onClick={this.handleTextareaClick.bind(this)}
              >
                Your bio
              </div>
              <textarea
                onClick={this.handleTextareaClick.bind(this)}
                onChange={this.handleTextInputChange.bind(this)}
                className="profile-input"
                rows="2"
                value={this.state.textInput}
                maxLength={160}
              />
            </div>
            <div className="profile-char-count">
              {this.state.textInput.length + "/160"}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileForm;
