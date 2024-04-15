import { UnstoredListProps, UnstoredRowProps } from "modules/interfaces";
import { swalConfirm } from "modules/swal";
import { useRef, useState } from "react";
import { ReactComponent as TrashIcon } from "icons/trash.svg";
import { TrashButton } from "./Buttons";
function UnstoredList({ items, renderItem }: UnstoredListProps) {
  const [tabCount, setTabCount] = useState(items.length);

  const changeTabCount = (amount: number) => {
    setTabCount(tabCount + amount);
  };

  if (items.length == 0) {
    return <></>;
  }
  return (
    <>
      <div className="sub-header">
        <p className="msg-text">Unstored Opened Tabs ({tabCount})</p>
      </div>
      <hr></hr>
      {items.map((unstoredTab) => {
        const rowProps = unstoredTab as UnstoredRowProps;
        rowProps.changeTabCount = changeTabCount;
        return renderItem(rowProps);
      })}
    </>
  );
}

/** does not deal with dupes yet */
function UnstoredRow({
  title,
  vidId,
  tabId,
  windowId,
  changeTabCount,
}: UnstoredRowProps) {
  const listRef = useRef<any>(null);
  const hrRef = useRef<any>(null);

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
    if ((await swalConfirm("Do you want to close this tab?")).isConfirmed) {
      chrome.tabs.remove(tabId as number);
      listRef.current.remove();
      hrRef.current.remove();
      changeTabCount(-1);
    }
  };

  return (
    <>
    <li ref={listRef}>
      <a className="tabContainer" onClick={click}>
        <div className="iconDiv">
          <img
            className="thumb"
            src={`https://i.ytimg.com/vi/${vidId}/default.jpg`}
          />
        </div>
        <div className="tabContents">
          <h3 className="title">{title}</h3>
          <div className="arrange-horizontal">
            <TrashButton onClick={deleteVid} />
          </div>
        </div>
      </a>
    </li>
    <hr ref={hrRef}></hr>
    </>
  );
}

export { UnstoredList, UnstoredRow };
