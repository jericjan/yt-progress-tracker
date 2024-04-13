import { getVideoId } from "./youtubeFuncs";

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  let queryOptions = { active: true, currentWindow: true };
  // istg lastFocusedWindow worked in my other extension below. now it doesn't????
  // https://github.com/jericjan/tab-purger
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function findTabs(targetVidId: string, onlyAudible?: Boolean ): Promise<chrome.tabs.Tab[]> {

  const options = onlyAudible ? {audible: true} : {'url':'https://www.youtube.com/watch*'}

  const audibleTabs = await chrome.tabs.query(options);

  const matchedTabs = audibleTabs.filter((tab) => {
    const url = tab.url;
    const currentVidId = getVideoId(url);
    if (currentVidId == targetVidId) {
      return true;
    } 
  });

  return matchedTabs;
}

export { getCurrentTab, findTabs };
