import React from "react";

class Options extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mentionsSelected: false,
    };
  }

  handleAClick() {
    if (!this.state.mentionsSelected) return;
    else this.setState({ mentionsSelected: false });
  }
  handleBClick() {
    if (this.state.mentionsSelected) return;
    else this.setState({ mentionsSelected: true });
  }

  render() {
    const aClassList = !this.state.mentionsSelected
      ? "option option-selected"
      : "option";
    const bClassList = this.state.mentionsSelected
      ? "option option-selected"
      : "option";

    return (
      <div
        onClick={this.handleAClick.bind(this)}
        className={"options-container " + this.props.class}
      >
        <div className={aClassList}>
          <p>{this.props.a}</p>
        </div>
        <div onClick={this.handleBClick.bind(this)} className={bClassList}>
          <p>{this.props.b}</p>
        </div>
      </div>
    );
  }
}

export default Options;
