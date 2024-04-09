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
    // const currTab = await getCurrentTab(); // won't work here. moved to content script.
    const vidInfo: PartialVideoInfo = {
      [vidId]: { title: title, currTime: currentTime },
    };
    console.log("Saving...", vidInfo);
    document.dispatchEvent(new CustomEvent("ytSendProg", { detail: vidInfo }));
    console.log("Saved?????");
    setTimeout(() => {
      monitorProgress(vidId, elem);
    }, INTERVAL);
  }

  export { monitorProgress , getVideoId, VIDEO_PLAYER_SELECTOR};