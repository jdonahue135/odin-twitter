import React from "react";

const Button = (props) => {
  const textContent = props.textContent ? props.textContent : "Tweet";
  return (
    <div
      onClick={props.onClick}
      className={"btn btn-" + props.size + " " + props.class}
    >
      {textContent}
    </div>
  );
};

export default Button;
