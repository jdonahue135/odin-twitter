import React from "react";
import TweetForm from "./TweetForm";
import CharacterCounter from "./CharacterCounter";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

class Home extends React.Component {
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
    let tweetButtonClassList;
    if (this.props.charCount === 0 || this.props.charCount > 280) {
      tweetButtonClassList = "tweet-button-disabled tweet-button-sm";
    } else {
      tweetButtonClassList = "tweet-button tweet-button-sm";
    }
    return (
      <div className="Home">
        <div className="title-container">
          <p className="title">Home</p>
          {renderGraphic(graphics.SORT)}
        </div>
        <div className="tweet-compose-container">
          <div className="pic-container pic-container-lg" />
          <TweetForm
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
            <div className={tweetButtonClassList}>
              <p>Tweet</p>
            </div>
            {this.props.charCount > 0 ? (
              <CharacterCounter charCount={this.props.charCount} />
            ) : (
              <div style={{ display: "none" }} />
            )}
          </div>
        </div>
        <div className="main">
          <div className="tweets-container" />
        </div>
      </div>
    );
  }
}

export default Home;
