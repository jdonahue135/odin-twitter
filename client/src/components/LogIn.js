import React from "react";
import logo from "../images/Twitter_Logo_Blue.png";

import Button from "./Button";

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: null,
    };
  }

  handleFocus(e) {
    //change class of parent element
    console.log(e.target.name);
    this.setState({
      isFocused: e.target.name,
    });
  }
  handleBlur(e) {
    this.setState({
      isFocused: null,
    });
  }

  render() {
    const usernameClasslist =
      this.state.isFocused === "username"
        ? "input-overlay input-overlay-focused"
        : "input-overlay";
    const passwordFocused =
      this.state.isFocused === "password"
        ? "input-overlay input-overlay-focused"
        : "input-overlay";
    return (
      <div className="login-container">
        <img className="static-logo" src={logo} alt="logo" />
        <h1>Log in to Twitter</h1>
        <div className={usernameClasslist}>
          Username
          <input
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            type="text"
            name="username"
            className="login-input"
          />
        </div>
        <div className={passwordFocused}>
          Password
          <input
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            type="password"
            name="password"
            className="login-input"
          />
        </div>
        <Button size="lg" textContent="Log In" />
        <Button size="lg" textContent="Sign Up" />
        <button className="forgot-password">Forgot password?</button>
      </div>
    );
  }
}

export default LogIn;
