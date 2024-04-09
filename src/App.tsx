import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { RowProps, AppProps, VideoInfo } from "./interfaces";

function Row({ title, currTime }: RowProps) {
  return (
    <li>
      <a className="tabContainer">
        <div className="iconDiv">
          <img className="icon" />
        </div>
        <div className="tabContents">
          <h3 className="title">{title}</h3>
          <p className="curr-time">{currTime}</p>
        </div>
      </a>
    </li>
  );
}

type ListProps = {
  items: VideoInfo;
  renderItem: Function;
};

function List({ items, renderItem }: ListProps) {
  const keys = Object.keys(items);
  return (
    <>
      {keys.map((key) => {
        const contents = items[key]
        const title = contents["title"];
        const currTime = contents["currTime"];
        return renderItem(title, currTime.toString());
      })}
    </>
  );
}

function App({ vids }: AppProps) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <ul id="visible-ul">
        {/* <List title="test" currTime="200" /> */}
        <List
          items={vids}
          renderItem={(title: string, currTime: string) => (
            <Row title={title} currTime={currTime} />
          )}
        />
      </ul>
    </div>
  );
}

export { App as default };
