import React from "react";
import TweetForm from "./TweetForm";
import CharacterCounter from "./CharacterCounter";

import { svgDimensions } from "../constants";

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
    return (
      <div className="Home">
        <div className="title-container">
          <p className="title">Home</p>
          <svg className="sort-graphic" viewBox="0 0 24 24">
            <g>
              <path d={svgDimensions.SORT}></path>
            </g>
          </svg>
        </div>
        <div className="tweet-compose-container">
          <div className="pic-container pic-container-lg" />
          <TweetForm
            onChange={this.props.onChange}
            onFocus={this.handleFocus.bind(this)}
          />
          {this.state.focused ? (
            <div className="visibility-container">
              <svg className="visibility-graphic" viewBox="0 0 24 24">
                <g>
                  <path d={svgDimensions.GLOBE} />
                </g>
              </svg>
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
            <div className="tweet-compose-graphic-container">
              <svg className="tweet-compose-graphic" viewBox="0 0 24 24">
                <g>
                  <path d={svgDimensions.PHOTO_UPLOAD} />
                  <circle cx="8.868" cy="8.309" r="1.542" />
                </g>
              </svg>
              <svg className="tweet-compose-graphic" viewBox="0 0 24 24">
                <g>
                  <path d={svgDimensions.GIF1} />
                  <path d={svgDimensions.GIF2} />
                </g>
              </svg>
            </div>
            <div className="tweet-button tweet-button-sm">
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
