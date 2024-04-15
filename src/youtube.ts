// This the content script that will access chrome.storage


import { PartialVideoInfo } from "./modules/interfaces";
console.log("I'm the content script");

function inject(scriptName: string) {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL(scriptName); 

  s.onload = function () {
    s.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

function main() {
  document.addEventListener("ytSendProg", async function (e) {
    const stuff: PartialVideoInfo = (<any>e).detail;

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


  // the popup UI will send a message, and it will set the `t` parameter of the current tab, 
  // then inject a scrip to grab that parameter
  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

      const url = new URL(location.href);
      url.searchParams.set("t", message);
      history.pushState({}, "", url);
      inject("./static/js/timeSetter.js");
    }
  );

  inject("./static/js/stuff.js"); // this is inject.js
}

main();

export {};
