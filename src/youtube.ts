// This the content script that will access chrome.storage

// check if in a video url [X]
// check if vid elem exists [x]
// listen to the progress bar onchange
//save it to storage
//notify user of progress

import { Method } from "@testing-library/react";

const INTERVAL = 5000;
const PROPERTY_INTERVAL = 2000;
const VIDEO_PLAYER_SELECTOR = ".html5-video-player";
function getVideoId(): string {
  var urlParams = Array.from(new URLSearchParams(window.location.search));
  var videoId = "";
  for (const param of urlParams) {
    let [key, value] = param;
    if (key == "v" && value != "") {
      videoId = value;
    }
  }
  return videoId;
}

function inject() {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL("./static/js/stuff.js"); //this is injected.ts
  s.onload = function () {
    // s.remove();
  };
  // see also "Dynamic values in the injected code" section in this answer
  (document.head || document.documentElement).appendChild(s);
}

async function waitforElem(selector: string): Promise<Element | YT.Player> {
  console.log("Checking for element:", selector);

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        console.log("Element found:", element);
        resolve(element);
      } else {
        console.log("Element not found yet...");
      }
    }, INTERVAL);
  });
}

async function waitforProperty(
  selector: string,
  propertyName: string
): Promise<any> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const elem = document.querySelector(selector) as Element;
      if (propertyName in elem) {
        clearInterval(intervalId);
        console.log("Property found:", propertyName);
        resolve((elem as any)[propertyName]());
      } else {
        console.log(
          "Couldn't find property. here be keys: ",
          Object.keys(elem)
        );
      }
    }, PROPERTY_INTERVAL);
  });
}

async function monitorProgress(vidId: string, elem: YT.Player) {
  console.log("HUH?", elem);
  const currentTime: number = await waitforProperty(
    VIDEO_PLAYER_SELECTOR,
    "getCurrentTime"
  );
  const videoData: { title: string } = await waitforProperty(
    VIDEO_PLAYER_SELECTOR,
    "getVideoData"
  );
  const title = videoData["title"];
  const vidInfo = {
    [vidId]: { title: title, currTime: currentTime },
  };
  console.log("Saving...", vidInfo);
  await chrome.storage.local.set(vidInfo);
  document.dispatchEvent(new CustomEvent("ytSaveProg", vidInfo as any));
  console.log("Saved?????");
  setTimeout(() => {
    monitorProgress(vidId, elem);
  }, INTERVAL);
}

function main() {
  console.log("chrome storage: ", chrome.storage);
  var vidId = getVideoId();
  console.log(`Video id is ${vidId}`);
  if (vidId == "") {
    return;
  }
  waitforElem(VIDEO_PLAYER_SELECTOR).then(async (e) => {
    monitorProgress(vidId, e as YT.Player).catch((error) => {
      console.error(error);
    });
  });
  var vidElem = document.querySelector(VIDEO_PLAYER_SELECTOR);

  if (vidElem == null) {
    return;
  }

  //   var pBar = document.querySelector(".ytp-progress-bar");
  // unreliable. can't get tracked when not hovered on
}

document.addEventListener('EventB', function (e) {
  console.log('EventB received', e);
});

inject()

document.dispatchEvent(new CustomEvent('EventA', { stuff: "Astuff" } as any ));






main();

export {};
