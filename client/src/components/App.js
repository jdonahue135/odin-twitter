import React from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Home from "./Home";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweetInput: "",
    };
  }

  handleTweetInputChange(e) {
    this.setState({
      tweetInput: e.target.value,
    });
  }

  render() {
    return (
      <div className="App">
        <Sidebar />
        <Home
          charCount={this.state.tweetInput.length}
          onChange={this.handleTweetInputChange.bind(this)}
        />
      </div>
    );
  }
}

export default App;
