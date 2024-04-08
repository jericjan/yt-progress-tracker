// This the content script that will access chrome.storage

// check if in a video url [X]
// check if vid elem exists [x]
// listen to the progress bar onchange
//save it to storage
//notify user of progress

// import { Method } from "@testing-library/react";

function inject() {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL("./static/js/stuff.js"); //this is injected.ts
  s.onload = function () {
    // s.remove();
  };
  // see also "Dynamic values in the injected code" section in this answer
  (document.head || document.documentElement).appendChild(s);
}

document.addEventListener('ytSendProg', async function (e) {
  const stuff = (<any>e).detail
  // console.log('Received from injected script: ', e, stuff);
  await chrome.storage.local.set(stuff);
});

inject()

export {};
