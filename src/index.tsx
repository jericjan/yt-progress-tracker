import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { YouTubeTab, TabManager } from "./classes";
import { waitforElem } from "./elemFuncs";
import { VideoInfo } from "./interfaces";
import { getCurrentTab } from "./tabManipulation";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("test");

(async () => {
  const template = await waitforElem("#li_template") as HTMLTemplateElement;
  // const template = document.querySelector("#li_template") as HTMLTemplateElement;
  const savedVods: VideoInfo = await chrome.storage.local.get();
  const tabMan = new TabManager();
  for (const vidId in savedVods) {
    const contents = savedVods[vidId];
    const time: number = contents["currTime"];
    const title: string = contents["title"];
    // const tabId = contents["tabId"];
    // const windowId = contents["windowId"];
    const sessionIDs = contents['session']
    const currTab = await getCurrentTab();

    const tabObj = new YouTubeTab(template, sessionIDs, currTab);
    tabObj.setContents(title, time);
    tabObj.onclick(tabObj.focusWindowTab);

    tabMan.add(tabObj);
  }

  tabMan.sort(); // moves current tab to beginning if it exists

  tabMan.appendAll();
  // show all tabs
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
