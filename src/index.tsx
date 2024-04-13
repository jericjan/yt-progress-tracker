import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PartialVideoInfo, VideoInfo, TabAndWindowID } from "./modules/interfaces";
import { getCurrentTab, findTabs, findUnstoredTabs } from "./modules/tabManipulation";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);


// chrome.storage.local.get().then((saveVods) => {
  
//   root.render(
//     <React.StrictMode>
//       <App vids={saveVods as VideoInfo}/>
//     </React.StrictMode>
//   );
// });

(async () => {
  const savedVods: PartialVideoInfo = await chrome.storage.local.get()

// saveVods does not have tab and window info

  for (const vidId in savedVods) {
    const matchedTabs = await findTabs(vidId);
    const sessions = matchedTabs.map((x)=> {return {tabId: x.id, windowId: x.windowId} as TabAndWindowID})
    savedVods[vidId].sessions = sessions
    const currTab = await getCurrentTab();
    savedVods[vidId].isCurrent = sessions.some((x) => {
      return x.tabId == currTab.id;
    });    
  }

// saveVods now has tab and window info

  const unstoredTabs = await findUnstoredTabs(Object.keys(savedVods))

  root.render(
    <React.StrictMode>
      <App vids={savedVods as VideoInfo} unstored={unstoredTabs}/>
    </React.StrictMode>
  );
})();

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
