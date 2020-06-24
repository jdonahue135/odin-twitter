import React from "react";

const CharacterCounter = (props) => {
  let strokeDashoffset;
  let strokeDasharray;
  let r;
  let stroke;
  let viewBox;
  let circleSize;
  const charCountColor =
    props.charCount < 279 ? "rgb(101, 119, 134)" : "rgb(224, 36, 94)";
  if (props.charCount < 260) {
    strokeDashoffset = 0.20196 * (280 - props.charCount);
    strokeDasharray = 56.5487;
    r = 9;
    stroke = "rgb(29, 161, 242)";
    viewBox = "0 0 20 20";
    circleSize = "1.5rem";
  } else {
    strokeDashoffset =
      props.charCount < 279 ? 0.314159 * (280 - props.charCount) : 0;
    strokeDasharray = 87.9646;
    r = 14;
    stroke = props.charCount < 279 ? "rgb(255, 173, 31)" : "rgb(224, 36, 94)";
    viewBox = "0 0 30 30";
    circleSize = "2.25rem";
  }

  return (
    <div
      className="character-display-container"
      style={{ height: circleSize, width: circleSize }}
    >
      <svg
        className="character-display-graphic"
        height="100%"
        viewBox={viewBox}
        width="100%"
        style={{ overflow: "visible" }}
      >
        <circle
          cx="50%"
          cy="50%"
          fill="none"
          strokeWidth="2"
          r={r}
          stroke="rgb(230, 236, 240)"
        />
        <circle
          cx="50%"
          cy="50%"
          fill="none"
          strokeWidth="2"
          r={r}
          stroke={stroke}
          strokeLinecap="round"
          style={{
            strokeDashoffset: strokeDashoffset,
            strokeDasharray: strokeDasharray,
          }}
        />
      </svg>
      {props.charCount > 259 ? (
        <div className="char-count" style={{ color: charCountColor }}>
          {279 - props.charCount}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default CharacterCounter;
