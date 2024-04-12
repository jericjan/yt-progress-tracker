// This the content script that will access chrome.storage

// check if in a video url [X]
// check if vid elem exists [x]
//save it to storage [x]
//notify user of progress
import { PartialVideoInfo, TabAndWindowID, VideoInfo } from "./interfaces";

// import { Method } from "@testing-library/react";
console.log("I'm the content script");

function inject() {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL("./static/js/stuff.js"); //this is injected.ts
  s.onload = function () {
    s.remove();
  };
  // see also "Dynamic values in the injected code" section in this answer
  (document.head || document.documentElement).appendChild(s);
}

function main() {
  document.addEventListener("ytSendProg", async function (e) {
    const stuff: PartialVideoInfo = (<any>e).detail;
    // console.log('Received from injected script: ', e, stuff);
    // const [vidId, values] = Object.entries(stuff)[0];

    // // can't do this here either. gotta send to a service worker.
    // const currTab = await getCurrentTab();
    // const ids = {
    //   tabId: currTab.id,
    //   windowId: currTab.windowId,
    // };

    // // nvm i don't need a sw. i can just run getCurrentTab in index.tsx
    // chrome.runtime
    //   .sendMessage({ message: "IDs please", vidId: vidId })
    //   .then((response: TabAndWindowID[]) => {
    //     console.log("Received response from service worker:", response);
    //     if (response.length > 0) {
    //       const completeStuff: VideoInfo = {
    //         [vidId]: { ...values, session: response },
    //       };
    //       chrome.storage.local.set(completeStuff);
    //     }
    //   });

    chrome.storage.local.set(stuff);

  });
  inject();
}

main();

export {};
