import React from "react";
import { Link } from "react-router-dom";

import TweetForm from "./TweetForm";
import TweetList from "./TweetList";
import ProfilePic from "./ProfilePic";
import Recommendations from "./Recommendations";
import Button from "./Button";

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
          onClick={props.onTweetSubmit}
          tweetInput={props.tweetInput}
          inline={true}
        />
      </div>
      <div className="main home-main">
        {props.tweets === null ? (
          <div className="spinning-loader" />
        ) : (
          <div>
            {props.tweets.length === 0 ? (
              <div className="tweetlist-info-container tweetlist-info-title-container welcome-message-container">
                <p className="headline message-info-item">
                  Welcome to Twitter!
                </p>
                <p className="sub-headline message-info-item">
                  This is the best place to see what’s happening in your world.
                  Find some people and topics to follow now.
                </p>
                <Link to="/explore">
                  <Button
                    size="med"
                    textContent="Let's go!"
                    class="message-btn"
                    onClick={props.onPathChange}
                  />
                </Link>
              </div>
            ) : (
              <TweetList
                user={props.user}
                tweets={props.tweets}
                deleteTweet={props.onTweetDelete}
                onFollowChange={props.onClick}
                onPathChange={props.onPathChange}
                onLike={props.onLike}
              />
            )}
          </div>
        )}
      </div>
      <Recommendations
        user={props.user}
        onClick={props.onClick}
        onPathChange={props.onPathChange}
      />
    </div>
  );
};

export default Home;
