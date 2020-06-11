import React from "react";
import moment from "moment";

export const renderGraphic = (graphic, selectedStatus) => {
  const classList = graphic.class
    ? graphic.type + "-graphic-container " + graphic.class
    : graphic.type + "-graphic-container";
  const dimensions = selectedStatus ? graphic.selected : graphic.d;
  const circle = graphic.circle ? graphic.circle : null;
  if (Array.isArray(dimensions)) {
    return (
      <div className={classList}>
        <svg className={graphic.type + "-graphic"} viewBox="0 0 24 24">
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
      <div className={classList}>
        <svg className={graphic.type + "-graphic"} viewBox="0 0 24 24">
          <g>
            <path d={dimensions} />
            <circle style={circle} />
          </g>
        </svg>
      </div>
    );
  }
  return (
    <div className={classList}>
      <svg className={graphic.type + "-graphic"} viewBox="0 0 24 24">
        <g>
          <path d={dimensions} />
        </g>
      </svg>
    </div>
  );
};

export const formatDate = (date) => {
  const fromNow = Math.round((Date.now() - new Date(date)) / 1000);
  let time;
  if (fromNow < 60) {
    time = fromNow + "s";
  } else if (fromNow < 3600) {
    time = Math.floor(fromNow / 60) + "m";
  } else if (fromNow < 86400) {
    time = Math.floor(fromNow / 3600) + "h";
  } else {
    time = moment(date).format("MMM D");
  }
  return time;
};
