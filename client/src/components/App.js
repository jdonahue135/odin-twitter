import React from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Home from "./Home";
import LogIn from "./LogIn";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetInput: "",
      user: null,
      usernameInput: "",
      passwordInput: "",
      jwt: null,
    };
  }

  /*componentDidMount() {
    fetch("/users")
      .then((res) => res.json())
      .then((res) => this.setState({ user: res[0] }));
  }*/

  handleLoginInputChange(e) {
    this.setState({
      [e.target.name + "Input"]: e.target.value,
    });
  }

  handleSignUp() {
    if (!this.state.usernameInput || !this.state.passwordInput) return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.usernameInput,
        password: this.state.passwordInput,
        name: this.state.usernameInput,
      }),
    };

    fetch("/users/signup", requestOptions)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          jwt: res.token,
          user: res.user,
        })
      )
      .catch((err) => console.log(err));
  }

  handleLogIn() {
    if (!this.state.usernameInput || !this.state.passwordInput) return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.usernameInput,
        password: this.state.passwordInput,
      }),
    };

    fetch("/users/login", requestOptions)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          jwt: res.token,
          user: res.user,
        })
      )
      .catch((err) => console.log(err));
  }

  handleTweetInputChange(e) {
    this.setState({
      tweetInput: e.target.value,
    });
  }

  handleSubmit() {
    if (!this.state.tweetInput || !this.state.user) return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: this.state.user,
        text: this.state.tweetInput,
      }),
    };

    fetch("/tweets", requestOptions).catch((err) => console.log(err));
  }

  render() {
    let buttonStatus = false;
    if (this.state.usernameInput && this.state.passwordInput) {
      buttonStatus = true;
    }
    return (
      <div className="App">
        {!this.state.user ? (
          <LogIn
            onChange={this.handleLoginInputChange.bind(this)}
            buttonStatus={buttonStatus}
            handleSignUp={this.handleSignUp.bind(this)}
            handleLogIn={this.handleLogIn.bind(this)}
          />
        ) : (
          <div>
            <Sidebar />
            <Router>
              <Switch>
                <Route
                  path="/home"
                  render={(props) => (
                    <Home
                      {...props}
                      charCount={this.state.tweetInput.length}
                      onChange={this.handleTweetInputChange.bind(this)}
                      onClick={this.handleSubmit.bind(this)}
                    />
                  )}
                />
              </Switch>
            </Router>
          </div>
        )}
      </div>
    );
  }
}

export default App;
