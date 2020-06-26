import React from "react";

import { renderGraphic } from "../helpers";
import { graphics } from "../constants";

import Button from "./Button";

const Messages = (props) => {
  return (
    <div className="component">
      <div className="title-container messages-title-container">
        <p className="title">Messages (read-only for now)</p>
        {renderGraphic(graphics.COMPOSE)}
      </div>
      <div className="main messages-main">
        {!props.messages ? (
          <div className="message-info-container message-info-title-container">
            <p className="headline message-info-item">
              Send a message, get a message
            </p>
            <p className="sub-headline message-info-item">
              Direct Messages are private conversations between you and other
              people on Twitter. Share Tweets, media, and more!
            </p>
            <Button
              size="lg"
              textContent="Start a conversation"
              class="message-btn"
            />
          </div>
        ) : null}
      </div>
      <div className="messages-container">
        {!props.messages ? (
          <div className="message-info-container">
            <p className="headline message-info-item">
              You don't have a message selected
            </p>
            <p className="sub-headline message-info-item">
              Choose one from your existing messages, or start a new one.
            </p>
            <Button size="med" textContent="New message" class="message-btn" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Messages;
