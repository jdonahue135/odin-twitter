import React from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Home from "./Home";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetInput: "",
      user: null,
    };
  }

  componentDidMount() {
    fetch("/users")
      .then((res) => res.json())
      .then((res) => this.setState({ user: res[0] }));
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
    return (
      <div className="App">
        <Sidebar />
        <Home
          charCount={this.state.tweetInput.length}
          onChange={this.handleTweetInputChange.bind(this)}
          onClick={this.handleSubmit.bind(this)}
        />
      </div>
    );
  }
}

export default App;
