// This is the inject page script that will run stuff on YT.Player and send it to the content script
// - compiles to /static/js/stuff.js
// - can't run chrome api stuff like chrome.storage

import { waitforElem } from "./modules/elemFuncs";
import {
  getVideoId,
  VIDEO_PLAYER_SELECTOR,
  monitorProgress,
} from "./modules/youtubeFuncs";

console.log("i'm stuff (injected)");

function canAccessStorage(): Boolean {
  return chrome.storage == undefined ? false : true;
}

function main() {
  console.log("chrome storage: ", chrome.storage);

  if (canAccessStorage()) {
    return; // we are inside the extension, we want to be injected into a page, not this
  }

  waitforElem(VIDEO_PLAYER_SELECTOR).then(async (e) => {
    monitorProgress().catch((error) => {
      console.error(error);
    });
  });
  var vidElem = document.querySelector(VIDEO_PLAYER_SELECTOR);

  if (vidElem == null) {
    return;
  }
}

main();

export {};
