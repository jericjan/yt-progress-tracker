import { UnstoredTab } from "./interfaces";
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
    const currentVidId = getVideoId(tab.url);
    if (currentVidId == targetVidId) {
      return true;
    } 
  });

  return matchedTabs;
}
/** These are tabs that have been been to the extension's local storage */
async function findUnstoredTabs(storedVidIds: string[]) {
  const tabs = await chrome.tabs.query({'url':'https://www.youtube.com/watch*'});
  const unstoredTabs = tabs.filter((tab)=> {
    const currentVidId = getVideoId(tab.url);
    return !storedVidIds.includes(currentVidId)
  })
  return unstoredTabs.map((tab)=>{
    return <UnstoredTab>{
      title: tab.title,
      vidId: getVideoId(tab.url),
      tabId: tab.id,
      windowId: tab.windowId
    }
  })
}

export { getCurrentTab, findTabs, findUnstoredTabs };
