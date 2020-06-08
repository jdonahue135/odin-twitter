import React from "react";

import defaultPhoto from "../images/default_profile_pic.png";

const ProfilePic = (props) => {
  const classList = "profile-pic profile-pic-" + props.size;
  return (
    <div className="profile-pic-container">
      <img
        className={classList}
        src={!props.photo ? defaultPhoto : props.photo}
        alt="profile-pic"
      />
    </div>
  );
};
export default ProfilePic;
