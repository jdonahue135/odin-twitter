import React from "react";

import User from "./User";

import { Link } from "react-router-dom";

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
      .then((users) => {
        users.splice(users.indexOf(this.props.user), 1);
        return users;
      })
      .then((users) => this.setState({ users }))
      .catch((err) => console.log(err));
  }

  componentDidUpdate() {
    if (!this.state.users) {
      fetch("/users")
        .then((res) => res.json())
        .then((users) => {
          users.splice(users.indexOf(this.props.user), 1);
          return users;
        })
        .then((users) => this.setState({ users }))
        .catch((err) => console.log(err));
    }
  }
  render() {
    const classList = this.props.main
      ? "recommendations-container recommendations-container-main"
      : "recommendations-container";
    if (!this.state.users) {
      return (
        <div className={classList}>
          <div className="spinning-loader" />
        </div>
      );
    }
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
            <User
              currentUser={this.props.user}
              user={user}
              key={user._id}
              onClick={this.props.onClick}
            />
          ))}
          {!this.props.main ? (
            <Link to="/explore" onClick={this.props.onPathChange}>
              <p className="show-more">Show more</p>
            </Link>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Recommendations;
