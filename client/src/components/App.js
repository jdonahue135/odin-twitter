import React from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar";
import Home from "./Home";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Home />
    </div>
  );
}

export default App;
