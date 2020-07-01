import React from "react";
import { Link } from "react-router-dom";

import ProfilePic from "./ProfilePic";
import TweetForm from "./TweetForm";
import Tweet from "./Tweet";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

const TweetOverlay = (props) => {
  function formatReplyLabel(username) {
    return [
      "Replying to ",
      <Link
        to={"/" + username}
        onClick={props.onXClick}
        key={props.replyTweet._id}
      >
        <span className="profile-link">{"@" + username}</span>
      </Link>,
    ];
  }

  const isReply = props.replyTweet !== null ? props.replyTweet : null;
  const className = props.replyTweet ? "overlay-input-container" : null;
  return (
    <div className="overlay-form-container">
      <div className="overlay-top" onClick={props.onXClick}>
        {renderGraphic(graphics.X)}
      </div>
      {props.replyTweet ? (
        <div className="overlay-target-container">
          <div className="tweet-container" onClick={props.onXClick}>
            <Tweet
              tweet={props.replyTweet}
              currentUser={props.user}
              isOverlay={true}
            />
            <div className="reply-label">
              {formatReplyLabel(props.replyTweet.user.username)}
            </div>
            <div className="break vertical-break" />
          </div>
        </div>
      ) : null}
      <div className={className}>
        <ProfilePic
          photo={props.user ? props.user.profilePicture : null}
          size="med"
        />
        <TweetForm
          overlay={true}
          onClick={props.onClick}
          onChange={props.onChange}
          charCount={props.charCount}
          isReplyTo={isReply}
        />
      </div>
    </div>
  );
};

export default TweetOverlay;
