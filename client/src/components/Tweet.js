import React from "react";

import ProfilePic from "./ProfilePic";
import { renderGraphic } from "../helpers";
import { graphics } from "../constants";

const Tweet = (props) => {
  return (
    <div className="tweet-container">
      <ProfilePic
        photo={
          props.tweet.user.profilePicture
            ? props.tweet.user.profilePicture
            : null
        }
        size="med"
      />
      <div className="tweet-main">
        <div className="tweet-header">
          <div className="tweet-name">{props.tweet.user.name}</div>
          <div className="tweet-username">
            {"@" + props.tweet.user.username}
          </div>
          <div className="divider">.</div>
          <div className="tweet-date">{props.tweet.date}</div>
          {renderGraphic(graphics.TWEET_OPTIONS)}
        </div>
        <div className="tweet-text">{props.tweet.text}</div>
        <div className="tweet-footer">
          {renderGraphic(graphics.REPLY)}
          {renderGraphic(graphics.RETWEET)}
          {renderGraphic(graphics.LIKE)}
          {renderGraphic(graphics.SHARE)}
        </div>
      </div>
    </div>
  );
};

export default Tweet;
