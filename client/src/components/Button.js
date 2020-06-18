import React from "react";

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHovered: false,
    };
  }

  toggleHover() {
    this.setState({ isHovered: !this.state.isHovered });
  }
  render() {
    let textContent = this.props.textContent ? this.props.textContent : "Tweet";
    let style;
    if (textContent === "Following" && this.state.isHovered) {
      textContent = "Unfollow";
      style = { backgroundColor: "rgb(202, 32, 85)", color: "white" };
    }
    return (
      <div
        onClick={this.props.onClick}
        className={"btn btn-" + this.props.size + " " + this.props.class}
        onMouseEnter={this.toggleHover.bind(this)}
        onMouseLeave={this.toggleHover.bind(this)}
        style={style}
        id={this.props.id}
      >
        {textContent}
      </div>
    );
  }
}

export default Button;
