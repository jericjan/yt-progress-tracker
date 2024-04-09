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



// interface VideoInfo extends PartialVideoInfo {
//   [x: string]: {
//     title: string;
//     currTime: number;
//     session: TabAndWindowID[];
//   };
// }

type VideoInfo = {
  [key: string]: {
      title: string;
      currTime: number;
      session: TabAndWindowID[];
  };
}


interface TabAndWindowID {
  tabId: number | undefined;
  windowId: number;
}

type RowProps = {
  title: string;
  currTime: string;
}

type AppProps = {
  vids: VideoInfo;
}

export {
  type TabContainerElem,
  type VideoInfo,
  type PartialVideoInfo,
  type TabAndWindowID,
  type RowProps,
  type AppProps
};
