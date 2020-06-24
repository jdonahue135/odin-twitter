import React from "react";

import Tweet from "./Tweet";
import TweetFooter from "./TweetFooter";

const TweetList = (props) => {
  const sortedTweets = props.tweets.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);

    //reverse logic of sort function
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const classList = props.class
    ? "tweets-container " + props.class + "-tweets-container"
    : "tweets-container";
  return (
    <div className={classList}>
      {sortedTweets.map((tweet) => {
        if (
          tweet.retweetOf &&
          tweet.user._id === props.user._id &&
          props.home
        ) {
          //do not display user's retweet on home tweetList
          return null;
        }
        const targetTweet = tweet.retweetOf ? tweet.retweetOf : tweet;
        const onClickProp =
          props.user._id === targetTweet.user._id
            ? props.deleteTweet
            : props.onFollowChange;
        return (
          <div className="tweet-container" key={tweet._id + " container"}>
            <Tweet
              currentUser={props.user}
              key={tweet._id}
              tweet={tweet}
              onClick={onClickProp}
              onPathChange={props.onPathChange}
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
        );
      })}
    </div>
  );
};

export default TweetList;
