// This is the inject page script that will run stuff on YT.Player and send it to the content script

console.log("i'm stuff (injected)");

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
  document.dispatchEvent(new CustomEvent("ytSendProg", {detail: vidInfo}));
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
}

main();

export {};
