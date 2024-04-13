// i realize i don't actually need this anymore. will be removed soon.

import { findTabs } from "./modules/tabManipulation";
import { TabAndWindowID } from "./modules/interfaces";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message from content script:", message);
  const vidId: string = message.vidId;
  findTabs(vidId, true).then((matchedTabs) => {
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
