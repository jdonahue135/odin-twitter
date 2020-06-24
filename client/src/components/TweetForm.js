import React from "react";

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
    };
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

  handleClick() {
    //does not allow submissions of no characters, too many characters, or just whitespace
    if (
      this.state.text.length !== 0 &&
      this.state.text.length < 280 &&
      /\S/.test(this.state.text)
    ) {
      const handle = this.props.isReplyTo
        ? "@" + this.props.isReplyTo.user.username + " "
        : "";
      this.props.onClick(handle + this.state.text, this.props.isReplyTo);
      //clear form after submit
      this.setState({ text: "" });
    } else return;
  }

  render() {
    const placeholder = this.props.isReplyTo
      ? "Tweet your reply"
      : "What's happening?";

    let ButtonClass;
    if (
      this.state.text.length === 0 ||
      this.state.text.length > 280 ||
      !/\S/.test(this.state.text)
    ) {
      ButtonClass = "btn-disabled";
    } else {
      ButtonClass = "";
    }
    let rows = this.props.overlay ? 6 : 1;

    const charCount = this.props.isReplyTo
      ? this.state.text.length + this.props.isReplyTo.user.username.length
      : this.state.text.length;

    return (
      <div className="tweet-form-container">
        <TextareaAutosize
          rows={rows}
          placeholder={placeholder}
          onChange={this.handleTextChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          value={this.state.text}
        />
        {this.props.inline ? this.renderVisibilityContainer() : null}
        <div className="tweet-compose-footer">
          <div className="tweet-compose-graphics">
            {renderGraphic(graphics.PHOTO_UPLOAD)}
            {renderGraphic(graphics.GIF)}
          </div>
          <Button
            class={ButtonClass}
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
