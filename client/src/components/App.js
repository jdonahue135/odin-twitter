import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "../styles/App.css";
import { storageAvailable } from "../localStorage";
import logo from "../images/Twitter_Logo_Blue.png";

import Sidebar from "./Sidebar";
import Home from "./Home";
import LogIn from "./LogIn";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Profile from "./Profile";
import Explore from "./Explore";
import TweetOverlay from "./TweetOverlay";
import TweetFocus from "./TweetFocus";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoadingScreen: true,
      user: null,
      usernameInput: "",
      passwordInput: "",
      jwt: null,
      showLoginWarning: false,
      tweets: null,
      pathname: "/home",
      showTweetOverlay: false,
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
    if (!this.state.tweets && this.state.user) {
      this.fetchTweets();
    }
  }

  componentDidMount() {
    //configure localStorage
    if (storageAvailable("localStorage")) {
      if (localStorage.getItem("jwt")) {
        //update state with token and user
        const jwt = localStorage.getItem("jwt");
        const userStored = JSON.parse(localStorage.getItem("user"));
        fetch("/users/" + userStored._id)
          .then((res) => res.json())
          .then((user) => this.setState({ jwt, user }))
          .catch((err) => console.log(err));
      }
    }
    if (this.state.user) {
      //fetch tweets
      //this is set to wait 2 seconds if server needs to restart in development
      setTimeout(this.fetchTweets(), 2000);
    }
  }

  fetchTweets() {
    fetch("/tweets/" + this.state.user._id)
      .then((res) => res.json())
      .then((res) => this.setState({ tweets: res.tweets }))
      .catch((err) => console.log(err));
  }

  renderAppLoadingGraphic() {
    setTimeout(this.stopLoadingScreen.bind(this), 2000);
    return <img className="logo loading-logo" src={logo} alt="logo" />;
  }

  stopLoadingScreen() {
    this.setState({ showLoadingScreen: false });
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
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
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
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
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
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
      body: JSON.stringify({
        user: this.state.user,
        text: text,
      }),
    };

    fetch("/tweets", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ showTweetOverlay: false });
        this.fetchTweets();
      })
      .catch((err) => console.log(err));
  }

  handleLogOut() {
    //remove user and jwt from localStorage
    localStorage.clear();

    //logs user out of state and clears tweet cache
    this.setState({
      user: null,
      jwt: null,
      tweets: null,
    });
  }

  toggleTweetOverlay() {
    this.setState({ showTweetOverlay: !this.state.showTweetOverlay });
  }
  handleTweetDelete(e) {
    const requestOptions = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
      body: JSON.stringify({
        user: this.state.user,
      }),
    };
    fetch("/tweets/" + e.target.id + "/delete", requestOptions)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .then(this.fetchTweets())
      .catch((err) => console.log(err));
  }

  handleFollowerChange(e) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
      body: JSON.stringify({
        user: this.state.user,
      }),
    };
    fetch("/users/" + e.target.id, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ user: res.user });
        this.fetchTweets();
      })
      .catch((err) => console.log(err));
  }

  handlePathChange() {
    this.setState({ pathname: window.location.pathname });
  }

  render() {
    if (this.state.showLoadingScreen) {
      return this.renderAppLoadingGraphic();
    }

    let buttonStatus = false;
    if (this.state.usernameInput && this.state.passwordInput) {
      buttonStatus = true;
    }
    if (!this.state.user) {
      return (
        <LogIn
          showWarning={this.state.showLoginWarning}
          onChange={this.handleLoginInputChange.bind(this)}
          buttonStatus={buttonStatus}
          handleSignUp={this.handleSignUp.bind(this)}
          handleLogIn={this.handleLogIn.bind(this)}
        />
      );
    }

    const profileTweets = this.state.tweets
      ? this.state.tweets.filter(
          (tweets) => tweets.user._id === this.state.user._id
        )
      : null;
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
            {this.state.showTweetOverlay ? (
              <div>
                <div className="backdrop" />
                <TweetOverlay
                  user={this.state.user}
                  onXClick={this.toggleTweetOverlay.bind(this)}
                  onClick={this.handleTweetSubmit.bind(this)}
                />
              </div>
            ) : null}
            <div>
              <Router>
                <Sidebar
                  onButtonClick={this.toggleTweetOverlay.bind(this)}
                  pathname={this.state.pathname}
                  onPathChange={this.handlePathChange.bind(this)}
                  username={this.state.user.name}
                  handle={this.state.user.username}
                  onClick={this.handleLogOut.bind(this)}
                  disable={this.state.showTweetOverlay}
                />
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                  <Route
                    path="/explore"
                    render={(props) => (
                      <Explore
                        {...props}
                        user={this.state.user}
                        onClick={this.handleFollowerChange.bind(this)}
                      />
                    )}
                  />
                  <Route
                    path="/notifications"
                    render={(props) => (
                      <Notifications
                        {...props}
                        user={this.state.user}
                        onClick={this.handleFollowerChange.bind(this)}
                        onPathChange={this.handlePathChange.bind(this)}
                      />
                    )}
                  />
                  <Route
                    path="/messages"
                    render={(props) => <Messages {...props} />}
                  />
                  <Route
                    path="/home"
                    render={(props) => (
                      <Home
                        {...props}
                        onTweetSubmit={this.handleTweetSubmit.bind(this)}
                        tweets={this.state.tweets}
                        onTweetDelete={this.handleTweetDelete.bind(this)}
                        user={this.state.user}
                        onClick={this.handleFollowerChange.bind(this)}
                        onPathChange={this.handlePathChange.bind(this)}
                      />
                    )}
                  />
                  <Route
                    path={"/:username/:tweetid"}
                    render={(props) => (
                      <TweetFocus
                        {...props}
                        user={this.state.user}
                        onTweetDelete={this.handleTweetDelete.bind(this)}
                        onClick={this.handleFollowerChange.bind(this)}
                      />
                    )}
                  />
                  <Route
                    path={"/:username"}
                    render={(props) => (
                      <Profile
                        {...props}
                        user={this.state.user}
                        onButtonClick={this.toggleTweetOverlay.bind(this)}
                        onTweetDelete={this.handleTweetDelete.bind(this)}
                        onClick={this.handleFollowerChange.bind(this)}
                        popupStatus={this.state.showTweetOverlay}
                        tweets={profileTweets}
                        onPathChange={this.handlePathChange.bind(this)}
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
