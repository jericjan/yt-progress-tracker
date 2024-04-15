import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  PartialVideoInfo,
  VideoInfo,
  TabAndWindowID,
} from "./modules/interfaces";
import {
  getCurrentTab,
  findTabs,
  findUnstoredTabs,
} from "./modules/tabManipulation";
import { Timer } from "modules/mathStuff";
import { testStored, testUnstored } from "modules/testVars";

reportWebVitals(console.log);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const node_env = process.env.NODE_ENV

console.log("ENV: ", node_env)


if (node_env == "development") {
  root.render(
    <React.StrictMode>
      <App vids={testStored} unstored={testUnstored} />
    </React.StrictMode>
  );
} else {
  (async () => {
    const savedVods: PartialVideoInfo = await chrome.storage.local.get();

    // saveVods does not have tab and window info
    const timer = new Timer();
    for (const vidId in savedVods) {
      // these two async funcs query tabs twice in total, doesn't seem to affect performance tho
      const matchedTabs = await findTabs(vidId);
      timer.log("findTabs");
      const currTab = await getCurrentTab();
      timer.log("getCurrenTab");
      var currTabindex: number = -1;
      const sessions = matchedTabs.map((x, idx) => {
        if (x.id == currTab.id) {
          currTabindex = idx;
        }

        return { tabId: x.id, windowId: x.windowId } as TabAndWindowID;
      });
      timer.log("mapped IDs and set currTabIndex");
      savedVods[vidId].isCurrent = false;

      if (currTabindex != -1) {
        savedVods[vidId].isCurrent = true;
        // current tab found in tab list
        let removedItem = sessions.splice(currTabindex, 1)[0];
        sessions.unshift(removedItem);
        // moves that tab to the beginning of the list
      }
      timer.log("sorted currTab");

      savedVods[vidId].sessions = sessions;
      timer.log("replaced sessions");
    }

    // saveVods now has tab and window info

    // TODO: maybe make findUnstoredTabs use the same tab list from findTabs?
    const unstoredTabs = await findUnstoredTabs(Object.keys(savedVods));
    timer.log("unstoredTabs");
    console.log(savedVods, unstoredTabs);
    root.render(
      <React.StrictMode>
        <App vids={savedVods as VideoInfo} unstored={unstoredTabs} />
      </React.StrictMode>
    );
    timer.log("rendered");
  })();
}