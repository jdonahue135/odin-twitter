import React from "react";
import logo from "../images/Twitter_Logo_Blue.png";

import Button from "./Button";

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: null,
      forgotPassword: false,
    };
  }

  handleFocus(e) {
    //change class of parent element
    this.setState({
      isFocused: e.target.name,
    });
  }
  handleBlur(e) {
    this.setState({
      isFocused: null,
    });
  }
  handleClick() {
    this.setState({ forgotPassword: !this.state.forgotPassword });
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
    let buttonClass = !this.props.buttonStatus ? "btn-disabled" : "";
    return (
      <div className="login-container">
        <img className="static-logo" src={logo} alt="logo" />
        <h1>Log in to Twitter</h1>
        {this.props.showWarning ? (
          <span className="warning">
            The username and password you entered did not match our records.
            Please double-check and try again.
          </span>
        ) : (
          <div style={{ display: "none" }} />
        )}
        <div className={usernameClasslist}>
          Username
          <input
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            onChange={this.props.onChange}
            type="text"
            name="username"
            className="login-input"
            maxLength={15}
          />
        </div>
        <div className={passwordFocused}>
          Password
          <input
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            onChange={this.props.onChange}
            type="password"
            name="password"
            className="login-input"
            maxLength={15}
          />
        </div>
        <Button
          size="lg"
          textContent="Log In"
          class={buttonClass}
          onClick={this.props.handleLogIn}
        />
        <Button
          size="lg"
          textContent="Sign Up"
          class={buttonClass}
          onClick={this.props.handleSignUp}
        />
        {this.state.forgotPassword ? (
          <div className="forgot-password">Try "guest"</div>
        ) : (
          <button
            onClick={this.handleClick.bind(this)}
            className="forgot-password"
          >
            Forgot password?
          </button>
        )}
      </div>
    );
  }
}

export default LogIn;
