import React from "react";
import Options from "./Options";

import Recommendations from "./Recommendations";

class Notifications extends React.Component {
  //sub-headline needs to be changed to "When someone mentions you, you’ll find it here." when Mentions is clicked on
  constructor(props) {
    super(props);

    this.state = {
      showAll: true,
    };
  }

  handleClick(e) {
    console.log(e.target);
    if (e.target.id === "All") {
      this.setState({ showAll: true });
    } else {
      this.setState({ showAll: false });
    }
  }

  render() {
    const subHeadlineText = this.state.showAll
      ? "From likes to Retweets and a whole lot more, this is where all the action happens."
      : "When someone mentions you, you’ll find it here.";
    return (
      <div className="component">
        <div className="title-container notifications-title-container">
          <p className="title">Notifications</p>
          <Options
            a="All"
            b="Mentions"
            class="notifications-options"
            onClick={this.handleClick.bind(this)}
            selected={this.state.showAll}
          />
        </div>
        <div className="main">
          {!this.props.notifications ? (
            <div className="notifications-info-container notifications-info-title-container">
              <p className="headline message-info-item">
                Nothing to see here — yet
              </p>
              <p className="sub-headline message-info-item">
                {subHeadlineText}
              </p>
            </div>
          ) : null}
        </div>
        <Recommendations
          user={this.props.user}
          onClick={this.props.onClick}
          onPathChange={this.props.onPathChange}
        />
      </div>
    );
  }
}

export default Notifications;
