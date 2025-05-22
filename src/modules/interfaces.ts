
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
    epoch: number;
    sessions?: TabAndWindowID[];
    isCurrent?: boolean;
  };
}

/** Video info variable that should be created after modifying after getting from storage */
type VideoInfo = {
  [key: string]: {
    title: string;
    currTime: number;
    totalTime: number;
    epoch: number;
    sessions: TabAndWindowID[];
    isCurrent: boolean;
  };
};

type renderItemFunc = (props: RowProps) => JSX.Element;

/**basically looks the same as {@link VideoInfo} except no nesting and an extra key */
type RowProps = {
  selected: boolean;
  vidId: string;
  title: string;
  currTime: number;
  totalTime: number;
  perc: string;
  epoch: number;
  sessions: TabAndWindowID[];
  isCurrent: boolean;
  changeVideoCount: (amount: number) => void;
};

type ListProps = {
  items: VideoInfo;
  renderItem: renderItemFunc;
};

interface TabAndWindowID {
  tabId: number | undefined;
  windowId: number;
}

type AppProps = {
  vids: VideoInfo;
  unstored: UnstoredTab[];
};

type renderUnstoredItemFunc = (props: UnstoredRowProps) => JSX.Element;

type UnstoredListProps = {
  items: UnstoredTab[];
  renderItem: renderUnstoredItemFunc;
};

interface UnstoredTab extends TabAndWindowID {
  title: string;
  vidId: string;
}

interface UnstoredRowProps extends UnstoredTab {
  changeTabCount: (amount: number) => void;
}

export type TrashProps = {
  onClick: (e: React.MouseEvent) => Promise<void>;
};

export type ResetProps = {
  onClick: (e: React.MouseEvent) => Promise<void>;
};

export type ButtonWithTextProps = {
  props: {
    color: string;
    type: "left" | "right";
    offset: `${number}%`;
    text: string;
    Component: React.ElementType;
    onClick: (e: React.MouseEvent) => Promise<void>;
  };
};

export {
  type AppProps,
  type ListProps, type PartialVideoInfo, type RowProps, type TabAndWindowID, type TabContainerElem, type UnstoredListProps,
  type UnstoredRowProps, type UnstoredTab, type VideoInfo, type renderItemFunc
};

