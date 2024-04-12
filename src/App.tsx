import logo from "./logo.svg";
import "./App.css";
import { RowProps, AppProps, ListProps, TabAndWindowID } from "./interfaces";
import { formatTime } from "./mathStuff";
function Row({ title, currTime, vidId, sessions }: RowProps) {

  const click = async () => {
    // const matchedTabs = await findTab(vidId);

    if (sessions.length == 0) {
      //none found, open it
      chrome.tabs.create({ url: `https://youtu.be/${vidId}` });
    } else {
      // TODO: handle if more than one tab

      const firstMatch = sessions[0];

      await chrome.tabs.update(firstMatch.tabId as number, {
        active: true,
      });
      await chrome.windows.update(firstMatch.windowId, {
        focused: true,
      });
    }
  };


  return (
    <li>
      <a className="tabContainer" onClick={click}>
        <div className="iconDiv">
          <img className="icon" />
        </div>
        <div className="tabContents">
          <h3 className="title">{title}</h3>
          <p className="curr-time">{currTime}</p>
          <p className="tab-count">{sessions.length}</p>
        </div>
      </a>
    </li>
  );
}

function List({ items, renderItem }: ListProps) {
  const vidIds = Object.keys(items);

  vidIds.sort((first, second) => {
    const firstState = items[first].isCurrent;
    const secondState = items[second].isCurrent;

    if (firstState == true && secondState == false) {
      return -1;
    } else if (firstState == false && secondState == true) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <>
      {vidIds.map((vidId) => {
        const contents = items[vidId];
        const title = contents["title"];
        const currTime = contents["currTime"];
        const sessions = contents["session"];
        const isCurrent = contents["isCurrent"];
        return renderItem(title, formatTime(currTime), vidId, sessions, isCurrent);
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
          renderItem={(
            title: string,
            currTime: string,
            vidId: string,
            sessions: TabAndWindowID[],
            isCurrent: boolean
          ) => (
            <Row
              title={title}
              currTime={currTime}
              vidId={vidId}
              sessions={sessions}
              isCurrent={isCurrent}
            />
          )}
        />
      </ul>
    </div>
  );
}

export { App as default };
