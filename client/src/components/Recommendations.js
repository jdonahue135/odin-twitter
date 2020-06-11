import React from "react";

import User from "./User";
import SpinningLoader from "./SpinningLoader";

class Recommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    fetch("/users")
      .then((res) => res.json())
      .then((users) => this.setState({ users }))
      .catch((err) => console.log(err));
  }

  componentDidUpdate() {
    if (!this.state.users) {
      fetch("/users")
        .then((res) => res.json())
        .then((users) => this.setState({ users }))
        .catch((err) => console.log(err));
    }
  }
  render() {
    return (
      <div className="recommendations-container">
        <div className="user-title-container">
          <div className="title user-title">Who to follow</div>
        </div>
        {this.state.users ? (
          <div className="users-container">
            <User user={this.state.users[0]} />
            <User user={this.state.users[1]} />
            <User user={this.state.users[2]} />
            <User user={this.state.users[3]} />
            <p className="show-more">Show more</p>
          </div>
        ) : (
          <SpinningLoader />
        )}
      </div>
    );
  }
}

export default Recommendations;
