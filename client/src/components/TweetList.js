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
      {sortedTweets.map((tweet) => (
        <Tweet key={tweet._id} tweet={tweet} onClick={props.onClick} />
      ))}
    </div>
  );
};

export default TweetList;
