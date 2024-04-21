// This the content script that will access chrome.storage

import { swalBasic } from "modules/swal";
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

async function ytSendProgListener(e: any) {
  const stuff: PartialVideoInfo = e.detail;

  const vidId = Object.keys(stuff)[0];

  if (!vidId) {
    return;
  }

  if (!stuff.title) {
    return; // visiting the link of a dead video will have a blank title. return to ignore
  }

  try {
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
  } catch (error) {
    if (error instanceof Error) {
      if ((error.message = "Extension context invalidated.")) {
        const notice = document.createElement("p");
        notice.innerHTML =
          "Please refresh the page. YouTube Progress Tracker is not working rn.";
        notice.style.cssText =
          "color: white;" +
          "position: fixed;" +
          "left: 0px;" +
          "z-index: 99999;" +
          "background-color:#ff000030;" +
          "padding: 10px;";
        document.body.appendChild(notice);

        document.removeEventListener("ytSendProg", ytSendProgListener);
        document.body.setAttribute("yt-send-prog-listener-active", "false");
      } else {
        throw error;
      }
    }
  }
}

function main() {
  document.body.setAttribute("yt-send-prog-listener-active", "true");
  document.addEventListener("ytSendProg", ytSendProgListener);

  // the popup UI will send a message, and it will set the `t` parameter of the current tab,
  // then inject a scrip to grab that parameter
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const url = new URL(location.href);
    url.searchParams.set("t", message);
    history.pushState({}, "", url);
    inject("./static/js/timeSetter.js");
  });

  inject("./static/js/stuff.js"); // this is inject.js
}

main();

export {};
