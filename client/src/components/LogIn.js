import React from "react";
import logo from "../images/Twitter_Logo_Blue.png";

import Button from "./Button";

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: null,
      signUpClicked: false,
    };
  }
  componentWillUnmount() {
    this.setState({
      isFocused: null,
      signUpClicked: false,
    });
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
    this.setState({ signUpClicked: !this.state.signUpClicked });
  }

  render() {
    const message = this.state.signUpClicked
      ? "Sign up for Twitter"
      : "Log in to Twitter";
    const usernameClasslist =
      this.state.isFocused === "username"
        ? "input-overlay input-overlay-focused"
        : "input-overlay";
    const passwordFocused =
      this.state.isFocused === "password"
        ? "input-overlay input-overlay-focused"
        : "input-overlay";
    let buttonClass = "sign-in-btn ";
    buttonClass = !this.props.buttonStatus
      ? buttonClass + "btn-disabled"
      : buttonClass;
    const buttonText = this.state.signUpClicked ? "Sign up" : "Log in";
    const onClick = this.state.signUpClicked
      ? this.props.handleSignUp
      : this.props.handleLogIn;
    return (
      <div className="login-container">
        <img className="static-logo" src={logo} alt="logo" />
        <h1>{message}</h1>
        {this.props.showWarning ? (
          <span className="warning">
            The username and password you entered did not match our records.
            Please double-check and try again.
          </span>
        ) : null}
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
          textContent={buttonText}
          class={buttonClass}
          onClick={onClick}
        />
        {this.state.signUpClicked ? null : (
          <button onClick={this.handleClick.bind(this)} className="sign-up">
            Sign up for Twitter
          </button>
        )}
      </div>
    );
  }
}

export default LogIn;
