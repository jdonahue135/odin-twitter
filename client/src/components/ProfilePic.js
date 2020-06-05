import React from "react";

import defaultPhoto from "../images/default_profile_pic.png";

const ProfilePic = (props) => {
  return (
    <div className="profile-pic-container">
      <img
        className="profile-pic profile-pic-med"
        src={!props.photo ? defaultPhoto : props.photo}
        alt="profile-pic"
      />
    </div>
  );
};
export default ProfilePic;
