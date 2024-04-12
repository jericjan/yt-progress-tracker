// This the content script that will access chrome.storage

// check if in a video url [X]
// check if vid elem exists [x]
//save it to storage [x]
//notify user of progress
import { PartialVideoInfo } from "./interfaces";
import { VIDEO_PLAYER_SELECTOR } from "./youtubeFuncs";

// import { Method } from "@testing-library/react";
console.log("I'm the content script");

function inject(custom?: string) {
  var s = document.createElement("script");
  if (custom) {
    s.textContent = custom;
  } else {
    s.src = chrome.runtime.getURL("./static/js/stuff.js"); //this is injected.ts
  }

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

    // check if it exists

    const vidId = Object.keys(stuff)[0];
    const storedData: PartialVideoInfo = await chrome.storage.local.get(vidId);
    if (Object.keys(storedData).length != 0) {
      //if it alr exists,
      const storedTime = storedData[vidId].currTime;
      const newTime = stuff[vidId].currTime;

      if (newTime > storedTime) {
        // and it's a newer time
        chrome.storage.local.set(stuff);
      }
    } else {
      // else, it don't exist
      chrome.storage.local.set(stuff);
    }
  });


  // document.addEventListener("ytSetVideoTime", async function (e) {
    // const time = (<any>e).detail;
      // // can't. CSP directives block it.
    // inject(`document.querySelector("${VIDEO_PLAYER_SELECTOR}").seekTo(${time})`)
    // window.location.href = `javascript:document.querySelector("${VIDEO_PLAYER_SELECTOR}").seekTo(${time})`
  // });

  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      window.location.href = message
    }
  );

  inject();
}

main();

export {};
