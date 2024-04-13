import { UnstoredListProps, UnstoredRowProps } from "modules/interfaces";
import { useRef } from "react";

function UnstoredList({ items, renderItem }: UnstoredListProps) {
  if (items.length == 0) {
    return <></>;
  }
  return (
    <>
      <p className="msg-text">Unstored Opened Tabs</p>
      {items.map((unstoredTab) => {
        return renderItem(unstoredTab);
      })}
    </>
  );
}

/** does not deal with dupes yet */
function UnstoredRow({ title, vidId, tabId, windowId }: UnstoredRowProps) {
  const listRef = useRef<any>(null);

  const click = async () => {
    await chrome.tabs.update(tabId as number, {
      active: true,
    });
    await chrome.windows.update(windowId, {
      focused: true,
    });
  };

  const deleteVid = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Do you want to close tab(s)?")) {
      chrome.tabs.remove(tabId as number);
      if (listRef.current) {
        listRef.current.remove();
      }
    }
  };

  return (
    <li ref={listRef}>
      <a className="tabContainer" onClick={click}>
        <div className="iconDiv">
          <img
            className="icon"
            src={`https://i.ytimg.com/vi/${vidId}/default.jpg`}
          />
        </div>
        <div className="tabContents">
          <h3 className="title">{title}</h3>
          <button
            onClick={(e) => {
              deleteVid(e);
            }}
          >
            Delete
          </button>
        </div>
      </a>
    </li>
  );
}

export {UnstoredList, UnstoredRow}