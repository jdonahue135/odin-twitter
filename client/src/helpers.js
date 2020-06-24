import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export const renderGraphic = (graphic, selectedStatus, onClick) => {
  const containerClassList = graphic.class
    ? graphic.type + "-graphic-container " + graphic.class
    : graphic.type + "-graphic-container";
  const graphicClassList = selectedStatus
    ? graphic.type + "-graphic " + graphic.type + "-graphic-selected"
    : graphic.type + "-graphic";
  const dimensions = selectedStatus ? graphic.selected : graphic.d;
  const circle = graphic.circle ? graphic.circle : null;
  if (Array.isArray(dimensions)) {
    return (
      <div className={containerClassList} onClick={onClick}>
        <svg className={graphicClassList} viewBox="0 0 24 24">
          <g>
            <path d={dimensions[0]} />
            <path d={dimensions[1]} />
          </g>
        </svg>
      </div>
    );
  }
  if (circle) {
    return (
      <div className={containerClassList} onClick={onClick}>
        <svg className={graphicClassList} viewBox="0 0 24 24">
          <g>
            <path d={dimensions} />
            <circle style={circle} />
          </g>
        </svg>
      </div>
    );
  }
  return (
    <div className={containerClassList} onClick={onClick}>
      <svg className={graphicClassList} viewBox="0 0 24 24">
        <g>
          <path d={dimensions} />
        </g>
      </svg>
    </div>
  );
};

export const formatDate = (dateTime, fullDateOption) => {
  if (fullDateOption) {
    const time = moment(dateTime).format("LT");
    const date = moment(dateTime).format("MMM D, YYYY");
    return { time, date };
  }
  const fromNow = Math.round((Date.now() - new Date(dateTime)) / 1000);
  let time;
  if (fromNow < 60) {
    time = fromNow + "s";
  } else if (fromNow < 3600) {
    time = Math.floor(fromNow / 60) + "m";
  } else if (fromNow < 86400) {
    time = Math.floor(fromNow / 3600) + "h";
  } else {
    time = moment(dateTime).format("MMM D");
  }
  return time;
};

export const formatTweetText = (string) => {
  //deconstruct string into words
  const words = string.split(" ");

  //apply span stylings
  let formatArray = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i][0] === "#") {
      formatArray.push(
        <span key={words[i] + " hashtag"} className="hashtag">
          {words[i]}
        </span>,
        " "
      );
    } else if (words[i][0] === "@") {
      formatArray.push(
        <Link key={words[i]} to={"/" + words[i].slice(1)}>
          <span key={words[i] + " handle"} className="handle">
            {words[i]}
          </span>
        </Link>,
        " "
      );
    } else formatArray.push(words[i], " ");
  }

  //remove trailing space
  formatArray[formatArray.length - 1].trim();

  return formatArray;
};

export const removeReplies = (tweetList) => {
  let formattedTweetList = [];
  for (let i = 0; i < tweetList.length; i++) {
    if (!tweetList[i].text || tweetList[i].text[0] !== "@") {
      formattedTweetList.push(tweetList[i]);
    }
  }
  return formattedTweetList;
};
