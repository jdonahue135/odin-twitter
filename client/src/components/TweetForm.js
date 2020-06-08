import React from "react";

import TextareaAutosize from "react-autosize-textarea";
import TweetButton from "./TweetButton";
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
    let tweetButtonClass;
    if (this.props.charCount === 0 || this.props.charCount > 280) {
      tweetButtonClass = "tweet-button-disabled";
    } else {
      tweetButtonClass = "";
    }

    return (
      <div className="tweet-form-container">
        <TextareaAutosize
          rows={1}
          placeholder="What's happening?"
          onChange={this.props.onChange}
          onFocus={this.handleFocus.bind(this)}
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
          <TweetButton
            class={tweetButtonClass}
            size="sm"
            onClick={this.props.onClick}
          />
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
