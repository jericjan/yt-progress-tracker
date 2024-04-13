interface TabContainerElem extends HTMLElement {
  sessionIDs: TabAndWindowID[];
}

/** it's partial.
 *  will need to go through index.tsx to gain tab and window ID.
 * when in local storage, session and isCurrent are undefined.
 * they will be added later and then convert to {@link VideoInfo}.
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

// type renderItemFunc = (
//   title: string,
//   currTime: number,
//   totalTime: number,
//   perc: string,
//   vidId: string,
//   sessions: TabAndWindowID[],
//   isCurrent: boolean
// ) => JSX.Element;

type renderItemFunc = (
  props: RowProps
) => JSX.Element;

/**basically looks the same as {@link VideoInfo} expect no nesting and an extra key */
type RowProps = {
  vidId: string;
  title: string;
  currTime: number;
  totalTime: number;
  perc: string;
  sessions: TabAndWindowID[]
  isCurrent: boolean;
};


interface TabAndWindowID {
  tabId: number | undefined;
  windowId: number;
}



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
