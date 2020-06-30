import React from "react";

import { sortList } from "../helpers";
import Options from "./Options";
import NotificationItem from "./NotificationItem";
import Recommendations from "./Recommendations";

class Notifications extends React.Component {
  //sub-headline needs to be changed to "When someone mentions you, you’ll find it here." when Mentions is clicked on
  constructor(props) {
    super(props);

    this.state = {
      showAll: true,
    };
  }
  componentDidMount() {
    this.props.onMount();
  }

  handleClick(e) {
    if (e.target.id === "All") {
      this.setState({ showAll: true });
    } else {
      this.setState({ showAll: false });
    }
  }

  render() {
    if (!this.props.notifications) {
      return (
        <div className="component">
          <div className="spinning-loader" />
        </div>
      );
    }
    let notificationList = [];
    if (!this.state.showAll) {
      for (let i = 0; i < this.props.notifications.length; i++) {
        if (this.props.notifications[i].type === "reply") {
          notificationList.push(this.props.notifications[i]);
        }
      }
    } else {
      notificationList = this.props.notifications;
    }
    let sortedNotificationList = sortList(notificationList);
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
          {sortedNotificationList.length === 0 ? (
            <div className="notifications-info-container notifications-info-title-container">
              <p className="headline message-info-item">
                Nothing to see here — yet
              </p>
              <p className="sub-headline message-info-item">
                {subHeadlineText}
              </p>
            </div>
          ) : (
            <div className="main">
              {sortedNotificationList.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  user={this.props.user}
                />
              ))}
            </div>
          )}
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
