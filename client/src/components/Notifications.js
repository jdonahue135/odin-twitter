import React from "react";
import Options from "./Options";

import Recommendations from "./Recommendations";

const Notifications = (props) => {
  return (
    <div className="component">
      <div className="title-container notifications-title-container">
        <p className="title">Notifications</p>
        <Options a="All" b="Mentions" class="notifications-options" />
      </div>
      <div className="main"></div>
      <Recommendations />
    </div>
  );
};

export default Notifications;
