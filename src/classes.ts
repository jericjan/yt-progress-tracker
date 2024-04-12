import { TabContainerElem, TabAndWindowID } from "./interfaces";

class YouTubeTab {
  element: HTMLLIElement;
  sessionIDs: TabAndWindowID[];
  isCurrentTab: Boolean;

  constructor(
    template: HTMLTemplateElement,
    sessionIDs: TabAndWindowID[],
    currentTab: chrome.tabs.Tab
  ) {
    const firstChild = template.childNodes[0].cloneNode();
    this.element = firstChild.cloneNode(true) as HTMLLIElement;
    this.sessionIDs = sessionIDs;
    // this.isCurrentTab = currentTab.id == tabId;
    this.isCurrentTab = sessionIDs.some((x) => {
      const tabId = x["tabId"];
      return tabId == currentTab.id;
    });
    // there most likely won't be a case where both the current
    // tab and given tab both have undefined IDs. hopefully
  }

  async setContents(title: string, time: number) {
    console.log("setContents: ", this.element.outerHTML)
    const titleElem = this.element.querySelector(".title") as Element;
    const timeElem = this.element.querySelector(".curr-time") as Element;
    const tabContainer = this.element.querySelector(
      ".tabContainer"
    ) as TabContainerElem;

    titleElem.textContent = title;
    timeElem.textContent = time.toString();
    // tabContainer.setAttribute("id", `tab-${this.tab.id}`);

    tabContainer.sessionIDs = this.sessionIDs;

    //   this.element.querySelector(".iconDiv > img").src = faviUrl;
  }

  onclick(func: () => Promise<void>) {
    this.element.addEventListener("click", async (e) => {
      await func();
    });
  }

  async focusWindowTab() {
    // there can possibly be multiple tabs of the same video
    const instanceCount = this.sessionIDs.length;
    if (instanceCount == 1) {
      await chrome.tabs.update(this.sessionIDs[0].tabId as number, {
        active: true,
      });
      await chrome.windows.update(this.sessionIDs[0].windowId, {
        focused: true,
      });
    } else {
        
    }
  }
}

class TabManager {
  tabs: YouTubeTab[];
  constructor() {
    this.tabs = [];
  }

  add(tab: YouTubeTab) {
    this.tabs.push(tab);
  }

  sort() {
    // TODO: sort by recently watched

    let index = this.tabs.findIndex((item) => item.isCurrentTab == true);

    if (index != -1) {
      // current tab found in tab list
      let removedItem = this.tabs.splice(index, 1)[0];
      this.tabs.unshift(removedItem);
      // moves that tab to the beginning of the list
    }
  }

  appendAll() {
    const elems: Node[] = this.tabs.map((x) => x.element);
    (document.querySelector("#visible-ul") as Element).append(...elems);
  }
}

export { YouTubeTab, TabManager };
