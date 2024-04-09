import { getVideoId } from "./youtubeFuncs";

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  let queryOptions = { active: true, currentWindow: true };
  // istg lastFocusedWindow worked in my other extension below. now it doesn't????
  // https://github.com/jericjan/tab-purger
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function findTab(targetVidId: string): Promise<chrome.tabs.Tab[]> {
  // get all audible tabs, look for matching url
  const audibleTabs = await chrome.tabs.query({ audible: true });

  const matchedTabs = audibleTabs.filter((tab) => {
    const url = tab.url;
    const currentVidId = getVideoId(url);
    if (currentVidId == targetVidId) {
      return true;
    } else {
      console.log("tab mismatch: ", currentVidId, targetVidId);
    }
  });

  return matchedTabs;
}

export { getCurrentTab, findTab };
