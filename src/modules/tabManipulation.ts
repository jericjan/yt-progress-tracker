import { UnstoredTab } from "./interfaces";
import { getVideoId } from "./youtubeFuncs";

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  let queryOptions = { active: true, currentWindow: true };
  // istg lastFocusedWindow worked in my other extension below. now it doesn't????
  // https://github.com/jericjan/tab-purger
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function findTabs(targetVidId: string, ytTabs: chrome.tabs.Tab[] ): chrome.tabs.Tab[] {
  const matchedTabs = ytTabs.filter((tab) => {
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

    const strippedTitle = (()=>{
      const matchStr = ' - YouTube'
      const title = tab.title
      if (title?.endsWith(matchStr)){
          return title.slice(0, -matchStr.length)
      }
      return title
    })()

    return <UnstoredTab>{
      title: strippedTitle,
      vidId: getVideoId(tab.url),
      tabId: tab.id,
      windowId: tab.windowId
    }
  })
}

export { getCurrentTab, findTabs, findUnstoredTabs };
