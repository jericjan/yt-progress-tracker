import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <template id="li_template">
          <li>
            <a className="tabContainer">
              <div className="iconDiv">
                <img className="icon" />
              </div>
              <div className="tabContents">
                <h3 className="title"></h3>
                <p className="curr-time"></p>
              </div>
            </a>
          </li>
        </template>
        <ul id="visible-ul"></ul>
      </header>
    </div>
  );
}

export default App;
