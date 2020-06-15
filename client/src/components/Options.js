import React from "react";

const Options = (props) => {
  const aClassList = props.selected ? "option option-selected" : "option";
  const bClassList = !props.selected ? "option option-selected" : "option";

  return (
    <div
      id={props.a}
      onClick={props.onClick}
      className={"options-container " + props.class}
    >
      <div id={props.a} className={aClassList}>
        <p id={props.a}>{props.a}</p>
      </div>
      <div id={props.b} onClick={props.onClick} className={bClassList}>
        <p id={props.b}>{props.b}</p>
      </div>
    </div>
  );
};

export default Options;
