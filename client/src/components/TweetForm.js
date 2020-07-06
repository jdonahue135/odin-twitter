import React from "react";
import Picker from "react-giphy-picker";
import { ClickAwayListener } from "@material-ui/core";
import TextareaAutosize from "react-autosize-textarea";

import Button from "./Button";
import CharacterCounter from "./CharacterCounter";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

class TweetForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      text: "",
      photo: null,
      isGif: false,
      refreshFileInput: false,
      showGifPicker: false,
    };
    this.fileUploaderRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.state.refreshFileInput) {
      this.setState({
        refreshFileInput: false,
      });
    }
  }

  handleFocus(e) {
    this.setState({ focused: true });
  }

  renderVisibilityContainer() {
    if (this.state.focused) {
      return (
        <div>
          <div className="visibility-container">
            {renderGraphic(graphics.GLOBE)}
            <p className="visibility-message">Everyone can reply</p>
          </div>
          <div className="break" />
        </div>
      );
    }
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  handleGifSelect(gif) {
    console.log(gif);
    this.setState({
      photo: gif["original"]["url"],
      isGif: true,
      showGifPicker: false,
    });
  }

  handleClick() {
    //does not allow submissions of no characters, too many characters, or just whitespace without a photo
    if (
      this.state.text.length === 0 ||
      this.state.text.length > 280 ||
      !/\S/.test(this.state.text)
    ) {
      if (!this.state.photo) return;
    }
    const handle = this.props.isReplyTo
      ? "@" + this.props.isReplyTo.user.username + " "
      : "";
    this.props.onClick(
      handle + this.state.text,
      this.props.isReplyTo,
      this.state.photo
    );
    //clear form after submit
    this.setState({
      text: "",
      photo: null,
      refreshFileInput: true,
    });
  }

  handleFileUploadClick() {
    this.fileUploaderRef.current.click();
  }

  handlePhotoUpload(e) {
    const photo = e.target.files[0];
    if (!photo) return;
    if (
      photo.type === "image/png" ||
      photo.type === "image/jpg" ||
      photo.type === "image/jpeg"
    ) {
      this.setState({
        photo: e.target.files[0],
        isGif: false,
      });
    }
  }
  handlePhotoDelete() {
    this.setState({
      photo: null,
      refreshFileInput: true,
    });
  }
  toggleGifPicker() {
    this.setState({
      showGifPicker: !this.state.showGifPicker,
    });
  }

  render() {
    const placeholder = this.props.isReplyTo
      ? "Tweet your reply"
      : "What's happening?";

    let buttonClass;
    if (
      this.state.text.length === 0 ||
      this.state.text.length > 280 ||
      !/\S/.test(this.state.text)
    ) {
      buttonClass = "btn-disabled";
    } else {
      buttonClass = "";
    }
    if (this.state.photo) {
      buttonClass = "";
    }
    let rows = this.props.overlay ? 6 : 1;

    const charCount = this.props.isReplyTo
      ? this.state.text.length + this.props.isReplyTo.user.username.length
      : this.state.text.length;
    let photoUrl;
    if (this.state.photo) {
      photoUrl = !this.state.isGif
        ? URL.createObjectURL(this.state.photo)
        : this.state.photo;
    }
    return (
      <div className="tweet-form-container">
        {this.state.showGifPicker ? (
          <ClickAwayListener onClickAway={this.toggleGifPicker.bind(this)}>
            <div className="overlay-form-container tweet-form-overlay">
              <Picker onSelected={this.handleGifSelect.bind(this)} />
            </div>
          </ClickAwayListener>
        ) : null}
        <TextareaAutosize
          rows={rows}
          placeholder={placeholder}
          onChange={this.handleTextChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          value={this.state.text}
        />
        {this.props.inline ? this.renderVisibilityContainer() : null}
        {this.state.photo ? (
          <div className="tweet-form-photo-container">
            <img className="tweet-form-photo" src={photoUrl} alt="upload" />
            {renderGraphic(graphics.X, null, this.handlePhotoDelete.bind(this))}
          </div>
        ) : null}
        <div className="tweet-compose-footer">
          <div className="tweet-compose-graphics">
            {renderGraphic(
              graphics.PHOTO_UPLOAD,
              null,
              this.handleFileUploadClick.bind(this)
            )}
            {this.state.refreshFileInput ? null : (
              <input
                type="file"
                id="file"
                ref={this.fileUploaderRef}
                style={{ display: "none" }}
                onChange={this.handlePhotoUpload.bind(this)}
              />
            )}
            {renderGraphic(graphics.GIF, null, this.toggleGifPicker.bind(this))}
          </div>
          <Button
            class={buttonClass}
            size="sm"
            onClick={this.handleClick.bind(this)}
          />
          {this.state.text.length > 0 ? (
            <CharacterCounter charCount={charCount} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default TweetForm;
