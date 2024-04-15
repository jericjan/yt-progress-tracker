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

// const testStuff: VideoInfo = {
//   "abc": {
//     title: "le title",
//     currTime: 10.05,
//     session: [{
//       tabId: 123,
//       windowId: 456
//     }]
//   }
// }

// root.render(
//   <React.StrictMode>
//     <App vids={testStuff}/>
//   </React.StrictMode>
// );

//this isn't running btw
// async () => {
//   const template = (await waitforElem("#li_template")) as HTMLTemplateElement;
//   // const template = document.querySelector("#li_template") as HTMLTemplateElement;
//   const savedVods: VideoInfo = await chrome.storage.local.get();
//   const tabMan = new TabManager();
//   for (const vidId in savedVods) {
//     const contents = savedVods[vidId];
//     const time: number = contents["currTime"];
//     const title: string = contents["title"];
//     // const tabId = contents["tabId"];
//     // const windowId = contents["windowId"];
//     const sessionIDs = contents["session"];
//     const currTab = await getCurrentTab();

//     const tabObj = new YouTubeTab(template, sessionIDs, currTab);
//     tabObj.setContents(title, time);
//     tabObj.onclick(tabObj.focusWindowTab);

//     tabMan.add(tabObj);
//   }

//   tabMan.sort(); // moves current tab to beginning if it exists

//   tabMan.appendAll();
//   // show all tabs
// };
