import React from "react";

import ProfilePic from "./ProfilePic";
import TweetForm from "./TweetForm";

import { graphics } from "../constants";
import { renderGraphic } from "../helpers";

const TweetOverlay = (props) => {
  return (
    <div className="overlay-tweet-form-container">
      <div className="overlay-top" onClick={props.onXClick}>
        {renderGraphic(graphics.X)}
      </div>
      <ProfilePic
        photo={props.user ? props.user.profilePicture : null}
        size="med"
      />
      <TweetForm
        overlay={true}
        onClick={props.onClick}
        onChange={props.onChange}
        charCount={props.charCount}
      />
    </div>
  );
};

export default TweetOverlay;
