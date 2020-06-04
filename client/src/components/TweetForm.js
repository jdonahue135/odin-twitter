import React from "react";

import TextareaAutosize from "react-autosize-textarea";

const TweetForm = (props) => {
  return (
    <div className="tweet-form-container">
      <TextareaAutosize
        rows={1}
        placeholder="What's happening?"
        onChange={props.onChange}
        onFocus={props.onFocus}
      />
    </div>
  );
};

export default TweetForm;
