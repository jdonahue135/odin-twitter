import React from "react";

import Recommendations from "./Recommendations";

const Explore = (props) => {
  return (
    <div className="component">
      <div className="title-container">
        <p className="title">Explore</p>
      </div>
      <div className="main">
        <Recommendations main={true} />
      </div>
    </div>
  );
};

export default Explore;
