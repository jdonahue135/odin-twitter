import React from "react";

import Tweet from "./Tweet";

const TweetList = (props) => {
  return (
    <div className="tweets-container">
      {props.tweets.map((tweet) => (
        <Tweet key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default TweetList;
