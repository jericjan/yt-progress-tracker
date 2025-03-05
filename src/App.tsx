import { ReactComponent as NewLogo } from "./neon.svg";
import "./App.css";
import { AppProps } from "./modules/interfaces";
import { List, Row } from "./UI/Stored";
import { UnstoredList, UnstoredRow } from "./UI/Unstored";
import anime from "animejs";
import { useEffect, useState } from "react";
import { swalConfirm } from "modules/swal";

function App({ vids, unstored }: AppProps) {
  const [vidState, setVidState] = useState(vids);

  useEffect(() => {
    function randomValues() {
      const distance = 25;
      anime({
        targets: "#logo-div",
        translateX: function () {
          return anime.random(0, distance) - distance / 2;
        },
        translateY: function () {
          return anime.random(0, distance) - distance / 2;
        },
        rotate: function () {
          return anime.random(0, 180);
        },
        easing: "easeInOutQuad",
        duration: 1000,
        complete: randomValues,
      });
    }
    randomValues();

    anime({
      targets: ".App-header > h1",
      translateY: [2.5, -2.5],
      duration: 1000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });

    return function () {
      anime.remove("#logo-div");
      anime.remove(".App-header > h1");
    };
  }, []);

  const deleteFinished = async () => {
    if (
      (
        await swalConfirm(
          "Videos that are 100% completed will be deleted. Continue?",
          "Delete finished vods?"
        )
      ).isConfirmed
    ) {
      setVidState((old) => {
        const newVods = { ...old };
        for (const [id, info] of Object.entries(newVods)) {
          const { currTime, totalTime } = info;
          if (currTime == totalTime) {
            chrome.storage.local.remove(id);
            delete newVods[id];
          }
        }
        return newVods;
      });
    }
  };

  const deleteClosed = async () => {
    if (
      (
        await swalConfirm(
          "Videos that have a tab count of 0 will be deleted. Continue?",
          "Delete closed vods?"
        )
      ).isConfirmed
    ) {
      setVidState((old) => {
        const newVods = { ...old };
        for (const [id, info] of Object.entries(newVods)) {
          const { sessions } = info;
          if (sessions.length == 0) {
            chrome.storage.local.remove(id);
            delete newVods[id];
          }
        }
        return newVods;
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Progress Tracker</h1>
        <div id="logo-div">
          <NewLogo className="App-logo" />
        </div>
      </header>
      <button className="button" onClick={deleteFinished}>
        Delete Finished Videos
      </button>
      <button className="button" onClick={deleteClosed}>
        Delete Closed Videos
      </button>      
      <hr></hr>
      <ul id="visible-ul">
        <List
          items={vidState}
          renderItem={(props) => (
            <>
              <Row
                key={props.vidId}
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
            </>
          )}
        />
      </ul>
    </div>
  );
}

export { App as default };
