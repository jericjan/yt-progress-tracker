interface TabContainerElem extends HTMLElement {
  sessionIDs: TabAndWindowID[]
}

// it's partial, will need to go through the content script to gain tab and window ID
interface PartialVideoInfo {
  [x: string]: {
    title: string;
    currTime: number;
  };
}



interface VideoInfo extends PartialVideoInfo {
  [x: string]: {
    title: string;
    currTime: number;
    session: TabAndWindowID[];
  };
}



interface TabAndWindowID {
  tabId: number | undefined;
  windowId: number;
}

export {
  type TabContainerElem,
  type VideoInfo,
  type PartialVideoInfo,
  type TabAndWindowID,
};
