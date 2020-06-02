import React from "react";

import { svgDimensions } from "../constants";

const Home = (props) => {
  return (
    <div className="Home">
      <div className="title-container">
        <p className="title">Home</p>
        <svg className="sort-icon" viewBox="0 0 24 24">
          <g>
            <path d={svgDimensions.SORT}></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Home;
