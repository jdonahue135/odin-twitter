import React from "react";

import TweetForm from "./TweetForm";
import TweetList from "./TweetList";
import ProfilePic from "./ProfilePic";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweets: null,
    };
  }

  componentDidMount() {
    //fetch tweets
    fetch("/tweets")
      .then((res) => res.json())
      .then((tweets) => this.setState({ tweets }))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="Home">
        <div className="title-container">
          <p className="title">Home</p>
          {renderGraphic(graphics.SORT)}
        </div>
        <div className="tweet-compose-container">
          <ProfilePic
            photo={this.props.user ? this.props.user.profilePicture : null}
            size="med"
          />
          <TweetForm
            charCount={this.props.charCount}
            onChange={this.props.onChange}
            onClick={this.props.onClick}
          />
        </div>
        <div className="main">
          {this.state.tweets ? (
            <TweetList tweets={this.state.tweets} />
          ) : (
            <div style={{ display: "none" }} />
          )}
        </div>
      </div>
    );
  }
}

export default Home;
