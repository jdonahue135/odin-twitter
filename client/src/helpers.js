import React from "react";

export const renderGraphic = (graphic) => {
  const classList = graphic.class
    ? graphic.type + "-graphic-container " + graphic.class
    : graphic.type + "-graphic-container";
  const dimensions = graphic.d;
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
