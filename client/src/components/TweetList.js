import React from "react";

import Tweet from "./Tweet";

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
        const onClickProp =
          props.user._id === tweet.user._id
            ? props.deleteTweet
            : props.unfollowUser;
        return (
          <Tweet
            currentUser={props.user}
            key={tweet._id}
            tweet={tweet}
            onClick={onClickProp}
          />
        );
      })}
    </div>
  );
};

export default TweetList;
