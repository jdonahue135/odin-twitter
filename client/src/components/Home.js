import React from "react";

import TweetForm from "./TweetForm";
import TweetList from "./TweetList";
import ProfilePic from "./ProfilePic";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

const Home = (props) => {
  return (
    <div className="Home">
      <div className="title-container">
        <p className="title">Home</p>
        {renderGraphic(graphics.SORT)}
      </div>
      <div className="tweet-compose-container">
        <ProfilePic
          photo={props.user ? props.user.profilePicture : null}
          size="med"
        />
        <TweetForm
          charCount={props.charCount}
          onChange={props.onChange}
          onClick={props.onClick}
        />
      </div>
      <div className="main">
        {props.tweets ? (
          <TweetList tweets={props.tweets} />
        ) : (
          <div style={{ display: "none" }} />
        )}
      </div>
    </div>
  );
};

export default Home;
