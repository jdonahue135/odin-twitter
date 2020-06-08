import React from "react";

const TweetButton = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={"tweet-button tweet-button-" + props.size + " " + props.class}
    >
      Tweet
    </div>
  );
};

export default TweetButton;
