interface TabContainerElem extends HTMLElement {
  sessionIDs: TabAndWindowID[];
}

/** it's partial.
 *  will need to go through index.tsx to gain tab and window ID.
 * when in local storage, session and isCurrent are undefined.
 * they will be added later and then convert to VideoInfo.
 */
interface PartialVideoInfo {
  [x: string]: {
    title: string;
    currTime: number;
    totalTime: number;
    sessions?: TabAndWindowID[];
    isCurrent?: boolean;    
  };
}

// interface VideoInfo extends PartialVideoInfo {
//   [x: string]: {
//     title: string;
//     currTime: number;
//     session: TabAndWindowID[];
//   };
// }

/** Video info variable that should be created after modifying after getting from storage */
type VideoInfo = {
  [key: string]: {
    title: string;
    currTime: number;
    totalTime: number;
    sessions: TabAndWindowID[];
    isCurrent: boolean;
  };
};

type renderItemFunc = (
  vidId: string,
  title: string,
  currTime: string,
  totalTime: string,
  perc: string,
  sessions: TabAndWindowID[],
  isCurrent: boolean
) => JSX.Element;

interface TabAndWindowID {
  tabId: number | undefined;
  windowId: number;
}

type RowProps = {
  title: string;
  currTime: string;
  totalTime: string;
  perc: string;
  vidId: string;
  sessions: TabAndWindowID[]
};

type AppProps = {
  vids: VideoInfo;
};

type ListProps = {
  items: VideoInfo;
  renderItem: renderItemFunc;
};

export {
  type TabContainerElem,
  type VideoInfo,
  type PartialVideoInfo,
  type TabAndWindowID,
  type RowProps,
  type AppProps,
  type ListProps,
  type renderItemFunc
};
