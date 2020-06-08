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
    };
  }

  /*componentDidMount() {
    fetch("/users")
      .then((res) => res.json())
      .then((res) => this.setState({ user: res[0] }));
  }*/

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
    return (
      <div className="App">
        {!this.state.user ? (
          <LogIn />
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
