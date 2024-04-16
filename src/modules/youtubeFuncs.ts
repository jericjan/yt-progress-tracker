import { PartialVideoInfo } from "./interfaces";
import { waitforProperty } from "./elemFuncs";

const INTERVAL = 5000;
const VIDEO_PLAYER_SELECTOR = ".html5-video-player";

function getVideoId(url?: string): string {
  var params;
  if (url) {
    params = url.slice(url.indexOf("?"));
  } else {
    params = window.location.search;
  }

  var urlParams = Array.from(new URLSearchParams(params));
  var videoId = "";
  for (const param of urlParams) {
    let [key, value] = param;
    if (key == "v" && value != "") {
      videoId = value;
    }
  }
  return videoId;
}

async function monitorProgress() {
  if (document.body.getAttribute("yt-send-prog-listener-active") == "false") {
    // stop. user will be told to refresh the page,
    // so that attribute will be true and injected.ts is re-injected
    return;
  }

  const vidId = getVideoId();
  if (vidId) {
    const currentTime: number = await waitforProperty(
      VIDEO_PLAYER_SELECTOR,
      "getCurrentTime"
    );
    const totalTime: number = await waitforProperty(
      VIDEO_PLAYER_SELECTOR,
      "getDuration"
    );
    const videoData: { title: string } = await waitforProperty(
      VIDEO_PLAYER_SELECTOR,
      "getVideoData"
    );
    const title = videoData["title"];

    const vidInfo: PartialVideoInfo = {
      [vidId]: {
        title: title,
        currTime: currentTime,
        totalTime: totalTime,
        epoch: Date.now(),
      },
    };

    // this is being run in an injected script, so it can't run `chrome.tabs`
    // it will need to send an event to the content script (youtube.ts)
    document.dispatchEvent(new CustomEvent("ytSendProg", { detail: vidInfo }));
    console.log("Saved: ", vidInfo);
  }
  setTimeout(() => {
    monitorProgress();
  }, INTERVAL);
}

export { monitorProgress, getVideoId, VIDEO_PLAYER_SELECTOR };
