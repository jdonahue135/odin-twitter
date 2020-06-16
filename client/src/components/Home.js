import React from "react";

import TweetForm from "./TweetForm";
import TweetList from "./TweetList";
import ProfilePic from "./ProfilePic";
import Recommendations from "./Recommendations";
import SpinningLoader from "./SpinningLoader";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

const Home = (props) => {
  return (
    <div className="component">
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
          tweetInput={props.tweetInput}
          inline={true}
        />
      </div>
      <div className="main home-main">
        {props.tweets ? (
          <TweetList tweets={props.tweets} />
        ) : (
          <SpinningLoader />
        )}
      </div>
      <Recommendations />
    </div>
  );
};

export default Home;
