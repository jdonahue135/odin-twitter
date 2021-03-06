import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import axios from "axios";

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
import Follow from "./Follow";

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
      notifications: null,
      showOverlay: false,
      replyTweet: null,
      unseenNotifications: null,
    };
  }

  componentDidMount() {
    //configure localStorage
    if (storageAvailable("localStorage")) {
      if (
        localStorage.getItem("jwt") !== "null" &&
        localStorage.getItem("jwt") !== null &&
        localStorage.getItem("user") !== null &&
        localStorage.getItem("user") !== "null"
      ) {
        //update state with token and user
        const jwt = localStorage.getItem("jwt");
        const userStored = JSON.parse(localStorage.getItem("user"));

        //this is set to wait 2 seconds if server needs to restart in development
        setTimeout(
          () =>
            fetch("/users/" + userStored._id)
              .then((res) => res.json())
              .then((user) => this.setState({ jwt, user }))
              .catch((err) => console.log(err)),
          1500
        );
      }
    }
    if (this.state.user) {
      //fetch tweets and notifications
      //this is set to wait 2 seconds if server needs to restart in development
      setTimeout(this.fetchTweets(), 1500);
      setTimeout(this.fetchUserNotifications(), 1500);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.user !== this.state.user) {
      this.fetchUserNotifications();
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
    if (!this.state.notifications && this.state.user) {
      this.fetchUserNotifications();
    }
  }

  fetchTweets() {
    fetch("/tweets/" + this.state.user._id)
      .then((res) => res.json())
      .then((res) => this.setState({ tweets: res.tweets }))
      .catch((err) => console.log(err));
  }

  fetchUserNotifications() {
    if (!this.state.user) return;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
    };

    const url = "/users/" + this.state.user._id + "/notifications";

    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        let unseenNotifications = 0;
        for (let i = 0; i < res.notifications.length; i++) {
          if (!res.notifications[i].readStatus) {
            unseenNotifications++;
          }
        }
        this.setState({
          notifications: res.notifications,
          unseenNotifications,
        });
      })
      .catch((err) => console.log(err));
  }

  renderAppLoadingGraphic() {
    setTimeout(this.stopLoadingScreen.bind(this), 1500);
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

  handleLogOut() {
    //remove user and jwt from localStorage
    localStorage.clear();

    //logs user out of state and clears tweet cache
    this.setState({
      user: null,
      jwt: null,
      tweets: null,
      notifications: null,
      showLoginWarning: false,
    });
  }

  handleProfileUpdate(bio, profilePicture, header) {
    if (!bio && !profilePicture && !header) return;

    //create request object
    const formData = new FormData();
    if (bio !== undefined && bio !== "") {
      formData.append("bio", bio);
    }
    if (profilePicture) {
      //save profilePicture and name to formData
      formData.append("photos", profilePicture);
      formData.append("profilePictureID", profilePicture.name);
    }
    if (header) {
      formData.append("photos", header);
      formData.append("headerID", header.name);
    }

    const url = "/users/" + this.state.user._id + "/update";
    const headers = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
    };

    axios
      .post(url, formData, headers)
      .then((res) => console.log(res))
      .then(() => window.location.reload())
      .catch((err) => console.error(err));
  }

  handleTweetSubmit(text, replyTweet, image) {
    if (!this.state.user) return;
    if (!image && !text) return;

    const formData = new FormData();
    if (image) {
      //check if image is gif
      if (typeof image === "string") {
        formData.append("gif", image);
      } else {
        formData.append("photo", image);
      }
    }
    formData.append("text", text);
    formData.append("replyTweet", JSON.stringify(replyTweet));
    formData.append("user", JSON.stringify(this.state.user));

    const headers = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
    };

    axios
      .post("/tweets", formData, headers)
      .then((res) => {
        console.log(res);
        this.setState({ showOverlay: false });
        setTimeout(this.fetchTweets.bind(this), 1500);
      })
      .catch((err) => console.error(err));
  }

  toggleOverlay() {
    this.setState({
      showOverlay: !this.state.showOverlay,
      replyTweet: null,
    });
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
      .then(() => this.fetchTweets())
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

  handleLikeChange(tweetID) {
    //configure fetch request
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

    //send fetch request
    fetch("/tweets/" + tweetID + "/like", requestOptions)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .then(() => this.fetchTweets())
      .catch((err) => console.log(err));
  }

  handleRetweetChange(tweetID) {
    //configure fetch request
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

    //send fetch request
    fetch("/tweets/" + tweetID + "/retweet", requestOptions)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .then(() => this.fetchTweets())
      .catch((err) => console.log(err));
  }

  showReplyOverlay(tweet) {
    const replyTweet = tweet.retweetOf ? tweet.retweetOf : tweet;
    this.setState({
      showOverlay: true,
      replyTweet: replyTweet,
    });
  }
  readAllNotifications() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.state.jwt,
      },
    };
    fetch(
      "/users/" + this.state.user._id + "/notifications/read",
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
      .then(() => this.fetchUserNotifications())
      .catch((err) => console.log(err));
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

    return (
      <div className="App">
        <div>
          {this.state.showOverlay ? (
            <div>
              <div className="backdrop" />
              <TweetOverlay
                user={this.state.user}
                onXClick={this.toggleOverlay.bind(this)}
                onClick={this.handleTweetSubmit.bind(this)}
                replyTweet={this.state.replyTweet}
              />
            </div>
          ) : null}
          <div>
            <Sidebar
              onButtonClick={this.toggleOverlay.bind(this)}
              onClick={this.handleLogOut.bind(this)}
              disable={this.state.showOverlay}
              user={this.state.user}
              unseenNotifications={this.state.unseenNotifications}
            />
            <Switch>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route
                exact
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
                exact
                path="/notifications"
                render={(props) => (
                  <Notifications
                    {...props}
                    notifications={this.state.notifications}
                    user={this.state.user}
                    onClick={this.handleFollowerChange.bind(this)}
                    onMount={this.readAllNotifications.bind(this)}
                    onLike={this.handleLikeChange.bind(this)}
                    onRetweet={this.handleRetweetChange.bind(this)}
                    onReply={this.showReplyOverlay.bind(this)}
                    onFollowChange={this.handleFollowerChange.bind(this)}
                    onTweetDelete={this.handleTweetDelete.bind(this)}
                  />
                )}
              />
              <Route
                exact
                path="/messages"
                render={(props) => <Messages {...props} />}
              />
              <Route
                exact
                path="/home"
                render={(props) => (
                  <Home
                    {...props}
                    onTweetSubmit={this.handleTweetSubmit.bind(this)}
                    tweets={this.state.tweets}
                    onTweetDelete={this.handleTweetDelete.bind(this)}
                    user={this.state.user}
                    onClick={this.handleFollowerChange.bind(this)}
                    onLike={this.handleLikeChange.bind(this)}
                    onRetweet={this.handleRetweetChange.bind(this)}
                    onReply={this.showReplyOverlay.bind(this)}
                  />
                )}
              />
              <Route
                exact
                path={"/status/:username/:tweetid"}
                render={(props) => (
                  <TweetFocus
                    {...props}
                    user={this.state.user}
                    onTweetDelete={this.handleTweetDelete.bind(this)}
                    onClick={this.handleFollowerChange.bind(this)}
                    onLike={this.handleLikeChange.bind(this)}
                    onRetweet={this.handleRetweetChange.bind(this)}
                    onReply={this.showReplyOverlay.bind(this)}
                  />
                )}
              />
              <Route
                exact
                path={"/:username/:follow"}
                render={(props) => (
                  <Follow
                    {...props}
                    user={this.state.user}
                    onClick={this.handleFollowerChange.bind(this)}
                  />
                )}
              />
              <Route
                exact
                path={"/:username"}
                render={(props) => (
                  <Profile
                    {...props}
                    user={this.state.user}
                    onProfileUpdate={this.handleProfileUpdate.bind(this)}
                    onButtonClick={this.toggleOverlay.bind(this)}
                    onTweetDelete={this.handleTweetDelete.bind(this)}
                    onClick={this.handleFollowerChange.bind(this)}
                    overlayStatus={this.state.showOverlay}
                    onLike={this.handleLikeChange.bind(this)}
                    onRetweet={this.handleRetweetChange.bind(this)}
                    onReply={this.showReplyOverlay.bind(this)}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
