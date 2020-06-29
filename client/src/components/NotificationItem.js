import React from "react";

import { renderGraphic } from "../helpers";
import { graphics } from "../constants";
import { Link } from "react-router-dom";

import Tweet from "./Tweet";
import TweetFooter from "./TweetFooter";
import ProfilePic from "./ProfilePic";

const NotificationItem = (props) => {
  if (props.notification.type === "reply") {
    const className = !props.notification.readStatus ? "unread" : "";
    return (
      <div className={"notification-item-container " + className}>
        <Tweet tweet={props.notification.reply} notification={true} />
        <TweetFooter
          tweet={props.notification.reply}
          currentUser={props.user}
        />
      </div>
    );
  } else {
    const renderNotificationItem = (type) => {
      let message = [];
      message.push(
        <Link
          key={props.notification._id}
          to={"/" + props.notification.actionUsers[0].username}
        >
          <span className="username">
            {props.notification.actionUsers[0].name}
          </span>
        </Link>
      );
      let text;
      if (type === "follow") {
        text = " followed you";
      } else if (type === "retweet") {
        text = " retweeted your Tweet";
      } else {
        text = " liked your Tweet";
      }
      message.push(text);
      return (
        <div className="notification-item-container">
          <div className="notification-header-container">
            <div
              className={"new-" + type + "-graphic notification-header-graphic"}
            >
              {renderGraphic(graphics["NEW_" + type.toUpperCase()])}
            </div>
            <div className="action-user-container notification-header-graphic">
              <ProfilePic size="sm" />
            </div>
          </div>
          <div className="notification-main">
            <div className="notification-message">{message}</div>
            {props.notification.tweet ? (
              <div className="notification-tweet-text">
                {props.notification.tweet.text}
              </div>
            ) : null}
          </div>
        </div>
      );
    };
    const className = !props.notification.readStatus ? "unread" : "";
    return (
      <div className={"notification-item-container " + className}>
        {renderNotificationItem(props.notification.type)}
      </div>
    );
  }
};

export default NotificationItem;
