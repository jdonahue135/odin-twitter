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
    if (!this.state.users) {
      return <SpinningLoader />;
    }
    const classList = this.props.main
      ? "recommendations-container recommendations-container-main"
      : "recommendations-container";
    const userList = this.props.main
      ? this.state.users.slice(0, 15)
      : this.state.users.slice(0, 5);
    return (
      <div className={classList}>
        {!this.props.main ? (
          <div className="user-title-container">
            <div className="title user-title">Who to follow</div>
          </div>
        ) : null}
        <div className="users-container">
          {userList.map((user) => (
            <User user={user} key={user._id} />
          ))}
          {!this.props.main ? <p className="show-more">Show more</p> : null}
        </div>
      </div>
    );
  }
}

export default Recommendations;
