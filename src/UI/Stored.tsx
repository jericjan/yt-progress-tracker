import { RowProps, ListProps } from "modules/interfaces";
import { formatTime } from "modules/mathStuff";
import { useRef } from "react";

function Row({
  title,
  currTime,
  totalTime,
  vidId,
  perc,
  sessions,
  isCurrent,
}: RowProps) {
  const listRef = useRef<any>(null);

  const click = async () => {
    // const matchedTabs = await findTab(vidId);

    const timedUrl = `https://youtu.be/${vidId}?t=${Math.floor(currTime)}`;

    if (sessions.length == 0) {
      //none found, open it
      chrome.tabs.create({
        url: timedUrl,
      });
    } else {
      // TODO: handle if more than one tab

      if (isCurrent) {
        // document.dispatchEvent(new CustomEvent("ytSetVideoTime", { detail: Math.floor(currTime) }));
        await chrome.tabs.sendMessage(
          sessions[0].tabId as number,
          Math.floor(currTime)
        );
      } else {
        const firstMatch = sessions[0];

        await chrome.tabs.update(firstMatch.tabId as number, {
          active: true,
        });
        await chrome.windows.update(firstMatch.windowId, {
          focused: true,
        });
      }
    }
  };

  const deleteVid = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this from storage?")) {
      // remove elem
      if (listRef.current) {
        listRef.current.remove();
      }

      // remove from storage
      await chrome.storage.local.remove(vidId);

      if (
        sessions.length > 0 &&
        confirm(
          "Do you also want to close all open tabs associated with this video?"
        )
      ) {
        for (const session of sessions) {
          chrome.tabs.remove(session.tabId as number);
        }
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
          <p className="time">{`${formatTime(currTime)} / ${formatTime(
            totalTime
          )} (${perc})`}</p>
          <p className="tab-count">{sessions.length}</p>
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

function List({ items, renderItem }: ListProps) {
  const vidIds = Object.keys(items);

  vidIds.sort((first, second) => {
    const firstState = items[first].isCurrent;
    const secondState = items[second].isCurrent;

    const firstSessCount = items[first].sessions.length;
    const secondSessCount = items[second].sessions.length;

    const firstEpoch = items[first].epoch;
    const secondEpoch = items[second].epoch;

    if (firstState == true && secondState == false) {
      return -1;
    } else if (firstState == false && secondState == true) {
      return 1;
    } else if (firstSessCount == secondSessCount) {
      return secondEpoch - firstEpoch;
    } else {
      return secondSessCount - firstSessCount;
    }
  });

  if (vidIds.length == 0) {
    return (
      <p className="msg-text">
        Nothing yet. Watch some videos so you can view your progress here.
      </p>
    );
  }

  return (
    <>
      <p className="msg-text">Saved Tabs</p>
      {vidIds.map((vidId) => {
        const contents = items[vidId];
        const { title, currTime, totalTime, sessions, isCurrent, epoch } =
          contents;
        return renderItem({
          vidId: vidId,
          title: title,
          currTime: currTime,
          totalTime: totalTime,
          perc: ((currTime / totalTime) * 100).toFixed(2) + "%",
          epoch: epoch,
          sessions: sessions,
          isCurrent: isCurrent,
        });
      })}
    </>
  );
}

export { Row, List };
