// import logo from "./logo.svg";
import { ReactComponent as NewLogo } from "./neon.svg";
import "./App.css";
import { AppProps } from "./modules/interfaces";
import { List, Row } from "./UI/Stored";
import { UnstoredList, UnstoredRow } from "./UI/Unstored";
import Anime, { anime } from "react-anime";
import { useEffect } from "react";

function App({ vids, unstored }: AppProps) {

  useEffect(() => {
    console.log("effecting")
    function randomValues() {
      const distance = 25
      anime({
        targets: '#logo-div',
        translateX: function() {
          return anime.random(0, distance) - (distance/2);
        },
        translateY: function() {
          return anime.random(0, distance) - (distance/2);
        },        
        rotate: function() {
          return anime.random(0, 180);
        },            
        easing: 'easeInOutQuad',
        duration: 1000,
        complete: randomValues
      });
    }
    randomValues();

    anime({
      targets: '.App-header > h1',
      translateY: [2.5,-2.5],
      duration: 1000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    })
    

    return function() {
      console.log("removing")
      anime.remove("#logo-div");
      anime.remove('.App-header > h1');
    }

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Progress Tracker</h1>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <div id="logo-div"><NewLogo className="App-logo" /></div>
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
