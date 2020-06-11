import React from "react";

import ProfilePic from "./ProfilePic";
import Button from "./Button";

const User = (props) => {
  const name =
    props.user.name.length > 14
      ? props.user.name.slice(0, 13)
      : props.user.name;
  return (
    <div className="user-container">
      <ProfilePic size="med" />
      <div className="profile-information-container">
        <div className="profile-name recommendations-profile-name">{name}</div>
        <div className="profile-handle">{"@" + props.user.username}</div>
      </div>
      <Button textContent="Follow" class="follow-btn" size="sm" />
    </div>
  );
};

export default User;
