import React from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Home from "./Home";
import LogIn from "./LogIn";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { storageAvailable } from "../localStorage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetInput: "",
      user: null,
      usernameInput: "",
      passwordInput: "",
      jwt: null,
      showLoginWarning: false,
      tweets: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.jwt !== this.state.jwt) {
      //save jwt and user to local storage
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.setItem("jwt", this.state.jwt);
      localStorage.setItem("user", JSON.stringify(this.state.user));
    }
  }

  componentDidMount() {
    //configure localStorage
    if (storageAvailable("localStorage")) {
      if (localStorage.getItem("jwt")) {
        //update state with token and user
        const jwt = localStorage.getItem("jwt");
        const user = JSON.parse(localStorage.getItem("user"));
        this.setState({ jwt, user });
      }
    }
    //fetch tweets
    fetch("/tweets")
      .then((res) => res.json())
      .then((tweets) => this.setState({ tweets }))
      .catch((err) => console.log(err));
  }

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
      .then((res) => {
        if (res.success === false) {
          this.setState({ showLoginWarning: true });
        } else {
          this.setState({
            jwt: res.token,
            user: res.user,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  handleTweetInputChange(e) {
    this.setState({
      tweetInput: e.target.value,
    });
  }

  handleTweetSubmit() {
    if (!this.state.tweetInput || !this.state.user) return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: this.state.user,
        text: this.state.tweetInput,
      }),
    };

    fetch("/tweets", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.tweets) {
          this.setState({ tweets: res.tweets });
        }
      })
      .catch((err) => console.log(err));
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
            showWarning={this.state.showLoginWarning}
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
                  path="/"
                  render={(props) => (
                    <Home
                      {...props}
                      charCount={this.state.tweetInput.length}
                      onChange={this.handleTweetInputChange.bind(this)}
                      onClick={this.handleTweetSubmit.bind(this)}
                      tweets={this.state.tweets}
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
