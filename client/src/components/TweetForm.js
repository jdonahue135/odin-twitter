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
    };
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  render() {
    let ButtonClass;
    if (this.props.charCount === 0 || this.props.charCount > 280) {
      ButtonClass = "btn-disabled";
    } else {
      ButtonClass = "";
    }

    return (
      <div className="tweet-form-container">
        <TextareaAutosize
          rows={1}
          placeholder="What's happening?"
          onChange={this.props.onChange}
          onFocus={this.handleFocus.bind(this)}
          value={this.props.tweetInput}
        />
        {this.state.focused ? (
          <div className="visibility-container">
            {renderGraphic(graphics.GLOBE)}
            <p className="visibility-message">Everyone can reply</p>
          </div>
        ) : (
          <div style={{ display: "none" }} />
        )}
        {this.state.focused ? (
          <div className="break" />
        ) : (
          <div style={{ display: "none" }} />
        )}

        <div className="tweet-compose-footer">
          <div className="tweet-compose-graphics">
            {renderGraphic(graphics.PHOTO_UPLOAD)}
            {renderGraphic(graphics.GIF)}
          </div>
          <Button class={ButtonClass} size="sm" onClick={this.props.onClick} />
          {this.props.charCount > 0 ? (
            <CharacterCounter charCount={this.props.charCount} />
          ) : (
            <div style={{ display: "none" }} />
          )}
        </div>
      </div>
    );
  }
}

export default TweetForm;
