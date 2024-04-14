// import logo from "./logo.svg";
import {ReactComponent as NewLogo} from "./neon.svg"
import "./App.css";
import {
  AppProps,

} from "./modules/interfaces";
import { List, Row } from "./UI/Stored";
import { UnstoredList, UnstoredRow } from "./UI/Unstored";
import Anime from 'react-anime';

function App({ vids, unstored }: AppProps) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Progress Tracker</h1>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Anime loop={true} duration={3000} scale={[{value: 0.5, easing: 'linear'},1.0,0.75]}>
        <NewLogo className="App-logo" />
        </Anime>  
      </header>
      <hr></hr>
      <ul id="visible-ul">
        
        <List
          items={vids}
          renderItem={(props) => (
            <>
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
            <hr></hr>
            </>
          )}
        />
      </ul>
      <ul id="unstored-ul">
        <UnstoredList
          items={unstored}
          renderItem={(props) => (
            <>
            <UnstoredRow
              vidId={props.vidId}
              title={props.title}
              tabId={props.tabId}
              windowId={props.windowId}
              changeTabCount={props.changeTabCount}
            />
            <hr></hr>
            </>
          )}
        />
      </ul>
    </div>
  );
}

export { App as default };
