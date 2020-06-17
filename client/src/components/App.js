import React from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Home from "./Home";
import LogIn from "./LogIn";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Profile from "./Profile";
import Explore from "./Explore";
import TweetPopup from "./TweetPopup";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { storageAvailable } from "../localStorage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      usernameInput: "",
      passwordInput: "",
      jwt: null,
      showLoginWarning: false,
      tweets: null,
      pathname: "/home",
      showTweetPopup: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.location.pathname !== this.state.pathname) {
      this.setState({ pathname: window.location.pathname });
    }
    if (prevState.jwt !== this.state.jwt) {
      //save jwt and user to local storage
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.setItem("jwt", this.state.jwt);
      localStorage.setItem("user", JSON.stringify(this.state.user));
    }
    if (!this.state.tweets) {
      fetch("/tweets")
        .then((res) => res.json())
        .then((tweets) => this.setState({ tweets }))
        .catch((err) => console.log(err));
    }
  }

  componentDidMount() {
    console.log(this.state.pathname);
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
            showLoginWarning: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  handleTweetSubmit(text) {
    if (!text || !this.state.user) return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: this.state.user,
        text: text,
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
    this.setState({ showTweetPopup: false });
  }

  handleLogOut() {
    //remove user and jwt from localStorage
    localStorage.clear();

    //logs user out of state
    this.setState({
      user: null,
      jwt: null,
    });
  }

  handleRouteChange() {
    this.setState({ pathname: window.location.pathname });
  }

  toggleTweetPopup() {
    this.setState({ showTweetPopup: !this.state.showTweetPopup });
  }
  handleTweetDelete(e) {
    console.log(e.target);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: this.state.user,
      }),
    };
    fetch("/tweets/" + e.target.id + "/delete", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.message);
        this.setState({ tweets: res.tweets });
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
            {this.state.showTweetPopup ? (
              <div>
                <div className="backdrop" />
                <TweetPopup
                  user={this.state.user}
                  onXClick={this.toggleTweetPopup.bind(this)}
                  onClick={this.handleTweetSubmit.bind(this)}
                />
              </div>
            ) : null}
            <div>
              <Router>
                <Sidebar
                  onButtonClick={this.toggleTweetPopup.bind(this)}
                  selected={this.state.pathname}
                  onRouteChange={this.handleRouteChange.bind(this)}
                  username={this.state.user.name}
                  handle={this.state.user.username}
                  onClick={this.handleLogOut.bind(this)}
                  disable={this.state.showTweetPopup}
                />
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                  <Route
                    path="/explore"
                    render={(props) => (
                      <Explore {...props} user={this.state.user} />
                    )}
                  />
                  <Route
                    path="/notifications"
                    render={(props) => <Notifications {...props} />}
                  />
                  <Route
                    path="/messages"
                    render={(props) => <Messages {...props} />}
                  />
                  <Route
                    path={"/" + this.state.user.username}
                    render={(props) => (
                      <Profile
                        {...props}
                        user={this.state.user}
                        onButtonClick={this.toggleTweetPopup.bind(this)}
                        onClick={this.handleTweetDelete.bind(this)}
                      />
                    )}
                  />
                  <Route
                    path="/home"
                    render={(props) => (
                      <Home
                        {...props}
                        onClick={this.handleTweetSubmit.bind(this)}
                        tweets={this.state.tweets}
                        onTweetDelete={this.handleTweetDelete.bind(this)}
                      />
                    )}
                  />
                </Switch>
              </Router>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
