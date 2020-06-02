import React from "react";

import { svgDimensions } from "../constants";

const Home = (props) => {
  return (
    <div className="Home">
      <div className="title-container">
        <p className="title">Home</p>
        <svg className="sort-graphic" viewBox="0 0 24 24">
          <g>
            <path d={svgDimensions.SORT}></path>
          </g>
        </svg>
      </div>
      <div className="tweet-compose-container">
        <div className="pic-container" />
        <input type="text" placeholder="What's happening?" />
        <div className="tweet-compose-footer">
          <div className="tweet-compose-graphic-container">
            <svg className="tweet-compose-graphic" viewBox="0 0 24 24">
              <g>
                <path d={svgDimensions.PHOTO_UPLOAD} />
                <circle cx="8.868" cy="8.309" r="1.542" />
              </g>
            </svg>
            <svg className="tweet-compose-graphic" viewBox="0 0 24 24">
              <g>
                <path d={svgDimensions.GIF1} />
                <path d={svgDimensions.GIF2} />
              </g>
            </svg>
          </div>
          <div className="tweet-button tweet-button-sm">
            <p>Tweet</p>
          </div>
        </div>
      </div>
      <div className="break" />
      <div className="main">
        <div className="tweets-container" />
      </div>
    </div>
  );
};

export default Home;
