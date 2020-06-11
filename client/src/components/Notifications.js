import React from "react";

import Recommendations from "./Recommendations";

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mentionsSelected: false,
    };
  }

  handleAllClick() {
    if (!this.state.mentionsSelected) return;
    else this.setState({ mentionsSelected: false });
  }
  handleMentionClick() {
    if (this.state.mentionsSelected) return;
    else this.setState({ mentionsSelected: true });
  }
  render() {
    const allClassList = !this.state.mentionsSelected
      ? "notification-option notification-option-selected"
      : "notification-option";
    const mentionsClassList = this.state.mentionsSelected
      ? "notification-option notification-option-selected"
      : "notification-option";
    return (
      <div className="component">
        <div className="title-container notifications-title-container">
          <p className="title">Notifications</p>
          <div
            onClick={this.handleAllClick.bind(this)}
            className="notification-options-container"
          >
            <div className={allClassList}>
              <p>All</p>
            </div>
            <div
              onClick={this.handleMentionClick.bind(this)}
              className={mentionsClassList}
            >
              <p>Mentions</p>
            </div>
          </div>
        </div>
        <div className="main"></div>
        <Recommendations />
      </div>
    );
  }
}

export default Notifications;
