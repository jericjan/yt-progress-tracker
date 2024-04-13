import logo from "./logo.svg";
import "./App.css";
import {
  AppProps,

} from "./modules/interfaces";
import { List, Row } from "./UI/Stored";
import { UnstoredList, UnstoredRow } from "./UI/Unstored";

function App({ vids, unstored }: AppProps) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <ul id="visible-ul">
        {/* <List title="test" currTime="200" /> */}
        <List
          items={vids}
          renderItem={(props) => (
            <Row
              vidId={props.vidId}
              title={props.title}
              currTime={props.currTime}
              totalTime={props.totalTime}
              perc={props.perc}
              epoch={props.epoch}
              sessions={props.sessions}
              isCurrent={props.isCurrent}
              changeVideoCount={props.changeVideoCount}
            />
          )}
        />
      </ul>
      <ul id="unstored-ul">
        <UnstoredList
          items={unstored}
          renderItem={(props) => (
            <UnstoredRow
              vidId={props.vidId}
              title={props.title}
              tabId={props.tabId}
              windowId={props.windowId}
              changeTabCount={props.changeTabCount}
            />
          )}
        />
      </ul>
    </div>
  );
}

export { App as default };
