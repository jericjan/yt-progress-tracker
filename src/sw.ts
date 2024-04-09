import { findTab } from "./tabManipulation";
import { TabAndWindowID } from "./interfaces";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message from content script:", message);
  const vidId: string = message.vidId;
  findTab(vidId).then((matchedTabs) => {
    const matchedTabDict = matchedTabs.map((currTab) => {
      return {
        tabId: currTab.id,
        windowId: currTab.windowId,
      };
    }) as TabAndWindowID[];

    sendResponse(matchedTabDict);
  });
  return true;
});

export {};
