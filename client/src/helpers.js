import React from "react";

export const renderGraphic = (graphic) => {
  const dimensions = graphic.d;
  const circle = graphic.circle ? graphic.circle : null;
  if (Array.isArray(dimensions)) {
    return (
      <div className={graphic.type + "-graphic-container"}>
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
      <div className={graphic.type + "-graphic-container"}>
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
    <div className={graphic.type + "-graphic-container"}>
      <svg className={graphic.type + "-graphic"} viewBox="0 0 24 24">
        <g>
          <path d={dimensions} />
        </g>
      </svg>
    </div>
  );
};
