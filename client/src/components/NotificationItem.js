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
    const onClickProp =
      props.user._id === props.notification.reply.user._id
        ? props.deleteTweet
        : props.onFollowChange;
    return (
      <div className={"notification-item-container " + className}>
        <Tweet
          tweet={props.notification.reply}
          currentUser={props.user}
          key={props.notification.reply._id}
          onClick={onClickProp}
          onPathChange={props.onPathChange}
          notification={true}
          deleteTweet={props.deleteTweet}
        />
        <TweetFooter
          tweet={props.notification.reply}
          key={props.notification.reply._id + "footer"}
          currentUser={props.user}
          onLike={props.onLike}
          onRetweet={props.onRetweet}
          onReply={props.onReply}
        />
      </div>
    );
  } else {
    const renderNotificationItem = (type) => {
      let message = [];
      message.push(
        <Link
          key={props.notification._id}
          to={"/" + props.notification.actionUser.username}
        >
          <span className="username">{props.notification.actionUser.name}</span>
        </Link>
      );
      let text;
      const link =
        type === "follow"
          ? null
          : "/status/" +
            props.notification.tweet.user.username +
            "/" +
            props.notification.tweet._id;
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
              <Link to={link}>
                <div className="notification-tweet-text">
                  {props.notification.tweet.text}
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      );
    };
    const className = !props.notification.readStatus ? "unread" : "";
    return (
      <div className={"notification-item " + className}>
        {renderNotificationItem(props.notification.type)}
      </div>
    );
  }
};

export default NotificationItem;
