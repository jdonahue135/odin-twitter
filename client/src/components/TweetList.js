import React from "react";
import { Link } from "react-router-dom";

import Tweet from "./Tweet";
import TweetFooter from "./TweetFooter";

import { sortList, removeReplies, addFormattedReplies } from "../helpers";

const TweetList = (props) => {
  if (!props.tweets || !props.user) {
    return (
      <div className="component">
        <div className="spinning-loader" />
      </div>
    );
  }
  const sortedTweets = sortList(props.tweets);
  let tweets = sortedTweets;
  if (!props.focus) {
    tweets =
      props.tweetsSelected === false
        ? addFormattedReplies(sortedTweets)
        : removeReplies(sortedTweets);
  }

  const classList = props.class
    ? "tweets-container " + props.class + "-tweets-container"
    : "tweets-container";
  return (
    <div className={classList}>
      {tweets.map((tweet) => {
        if (tweet.retweetOf && tweet.user._id === props.user._id) {
          //do not display user's retweet
          return null;
        }
        const targetTweet = tweet.retweetOf ? tweet.retweetOf : tweet;
        const onClickProp =
          props.user._id === targetTweet.user._id
            ? props.deleteTweet
            : props.onFollowChange;
        let threadLink;
        if (tweet.replies.length > 0 && props.home) {
          threadLink = (
            <Link to={"/" + tweet.user.username + "/" + tweet._id}>
              <div className="show-thread">Show this thread</div>
            </Link>
          );
        }
        const isreply = tweet.inReplyTo ? true : false;
        return (
          <div className="tweet-container" key={tweet._id + " container"}>
            <div className="tweet">
              <Tweet
                currentUser={props.user}
                key={tweet._id}
                tweet={tweet}
                onClick={onClickProp}
                onPathChange={props.onPathChange}
                isReply={isreply}
              />
              <TweetFooter
                currentUser={props.user}
                key={tweet._id + "footer"}
                tweet={tweet}
                onLike={props.onLike}
                onRetweet={props.onRetweet}
                onReply={props.onReply}
              />
            </div>
            {threadLink}
          </div>
        );
      })}
    </div>
  );
};

export default TweetList;
