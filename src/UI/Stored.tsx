import { ListProps, PartialVideoInfo, RowProps } from "modules/interfaces";
import { formatTime } from "modules/mathStuff";
import { swalBasic, swalConfirm } from "modules/swal";
import { useEffect, useRef, useState } from "react";
import { ResetButton, TrashButton } from "./Buttons";

function Row({
  selected,
  title,
  currTime,
  totalTime,
  vidId,
  perc,
  sessions,
  isCurrent,
  changeVideoCount,
}: RowProps) {
  const listRef = useRef<any>(null);
  const hrRef = useRef<any>(null);
  const [currTimeState, setCurrTimeState] = useState(currTime);
  const [percState, setPercState] = useState(perc);
  const click = async () => {
    const timedUrl = `https://youtu.be/${vidId}?t=${Math.floor(currTime)}`;

    if (sessions.length == 0) {
      //none found, open it
      chrome.tabs.create({
        url: timedUrl,
      });
    } else {
      // TODO: handle if more than one tab

      const [firstTab, ...otherTabs] = sessions;

      if (sessions.length > 1) {
        if (
          (
            await swalConfirm(
              "There is more than one tab. Do you want to close the duplicates?",
              "Delete dupes?",
              "Yes",
              "No"
            )
          ).isConfirmed
        ) {
          for (const tab of otherTabs) {
            chrome.tabs.remove(tab.tabId as number);
          }
        }
      }

      if (isCurrent) {
        try {
          await chrome.tabs.sendMessage(
            firstTab.tabId as number,
            Math.floor(currTime)
          );
        } catch (error) {
          // swalBasic("Can't set time","You might have refreshed the extension. Please refresh the page.", "error")
          const confirm = await swalConfirm(
            "Due to the extension being refreshed, time cannot be set without also refreshing the page. Continue?",
            "Page refresh needed",
            "Refresh"
          );

          if (confirm.isConfirmed) {
            await chrome.tabs.update(firstTab.tabId as number, {
              url: timedUrl,
            });
          }
        }
      } else {
        await chrome.tabs.update(firstTab.tabId as number, {
          active: true,
        });
        await chrome.windows.update(firstTab.windowId, {
          focused: true,
        });
      }
    }
  };

  const deleteVid = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      e.shiftKey ||
      (await swalConfirm("Are you sure you want to delete this from storage?"))
        .isConfirmed
    ) {
      // decrements count
      changeVideoCount(-1);

      // remove elem
      listRef.current.remove();
      hrRef.current.remove();

      // remove from storage
      await chrome.storage.local.remove(vidId);

      if (
        sessions.length > 0 &&
        (e.shiftKey ||
          (
            await swalConfirm(
              "Do you also want to close all open tabs associated with this video?"
            )
          ).isConfirmed)
      ) {
        for (const session of sessions) {
          chrome.tabs.remove(session.tabId as number);
        }
      }
    }
  };

  const resetTime = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirm = await swalConfirm(
      "This will reset the saved time this for this video",
      "Are you sure?"
    );

    if (!confirm.isConfirmed) {
      return;
    }

    setCurrTimeState(0);
    setPercState("0%");
    const vidInfo: PartialVideoInfo = {
      [vidId]: {
        title: title,
        currTime: 0,
        totalTime: totalTime,
        epoch: Date.now(),
      },
    };
    chrome.storage.local.set(vidInfo);
  };

  useEffect(() => {
    if (selected) {
      listRef.current.scrollIntoView();
    }
  }, [selected]);

  return (
    <>
      <li ref={listRef}>
        <a
          className={`tabContainer ${selected ? "selected" : ""}`}
          onClick={click}
        >
          <div className="iconDiv">
            <img
              className="thumb"
              src={`https://i.ytimg.com/vi/${vidId}/default.jpg`}
            />
          </div>
          <div className="tabContents">
            <h3 className="title">{title}</h3>
            <p className="time">{`${formatTime(currTimeState)} / ${formatTime(
              totalTime
            )} (${percState})`}</p>
            <p className="tab-count">Tab Count: {sessions.length}</p>
            <div className="arrange-horizontal">
              <ResetButton onClick={resetTime} />
              <TrashButton onClick={deleteVid} />
            </div>
          </div>
        </a>
        <div className="progress-bar" style={{ width: percState }}></div>
      </li>
      <hr ref={hrRef}></hr>
    </>
  );
}

function List({ items, renderItem }: ListProps) {
  const [vidIds, setVidIds] = useState(() => {
    const lmao = Object.keys(items);
    lmao.sort((first, second) => {
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
    return lmao;
  });
  const [videoCount, setVideoCount] = useState(vidIds.length);
  const [selectedVidId, setSelectedVidId] = useState("");

  const changeVideoCount = (amount: number) => {
    setVideoCount(videoCount + amount);
  };

  if (vidIds.length == 0) {
    return (
      <p className="msg-text">
        No progress saved yet. Watch some videos so you can view your progress
        here.
      </p>
    );
  }

  useEffect(() => {
    function cycleId(direction: "next" | "prev") {
      if (direction == "next") {
        return vidIds[
          Math.min(vidIds.length - 1, vidIds.indexOf(selectedVidId) + 1)
        ];
      } else if (direction == "prev") {
        return vidIds[Math.max(0, vidIds.indexOf(selectedVidId) - 1)];
      } else {
        throw new Error("Invalid direction");
      }
    }

    async function keyCheck(e: KeyboardEvent) {
      let newVidId = "";
      if (e.key == "j") {
        console.log("DOWN");

        if (selectedVidId == "") {
          newVidId = vidIds[0];
        } else {
          newVidId = cycleId("next");
        }
        setSelectedVidId(newVidId);
      } else if (e.key == "k") {
        console.log("UP");

        if (selectedVidId == "") {
          newVidId = vidIds[0];
        } else {
          newVidId = cycleId("prev");
        }
        setSelectedVidId(newVidId);
      } else if (e.key == "d") {
        if (selectedVidId == "") {
          return;
        }
        console.log("DELETE");

        changeVideoCount(-1);

        await chrome.storage.local.remove(selectedVidId);
        for (const session of items[selectedVidId].sessions) {
          chrome.tabs.remove(session.tabId as number);
        }

        newVidId = cycleId("next");
        if (newVidId == selectedVidId) {
          newVidId = cycleId("prev");
          if (newVidId == selectedVidId) {
            newVidId = "";
          }
        }

        setVidIds((vidIds) => {
          const newVidIds = [...vidIds];
          const deleted = newVidIds.splice(vidIds.indexOf(selectedVidId), 1);
          console.log(`Deleted: ${deleted}`);
          return newVidIds;
        });

        setSelectedVidId(newVidId)
      }
    }
    console.log("Added key listener")
    document.addEventListener("keyup", keyCheck);

    return function () {
      console.log("Removed key listener")
      document.removeEventListener("keyup", keyCheck);
    };
  }, [vidIds, selectedVidId]);

  return (
    <>
      <div className="sub-header">
        <p className="msg-text ">Saved Videos ({videoCount})</p>
      </div>
      <hr></hr>
      {vidIds.map((vidId) => {
        let selected = false;
        if (selectedVidId == vidId) {
          selected = true;
        }
        const contents = items[vidId];
        const { title, currTime, totalTime, sessions, isCurrent, epoch } =
          contents;
        return renderItem({
          selected: selected,
          vidId: vidId,
          title: title,
          currTime: currTime,
          totalTime: totalTime,
          perc: ((currTime / totalTime) * 100).toFixed(2) + "%",
          epoch: epoch,
          sessions: sessions,
          isCurrent: isCurrent,
          changeVideoCount: changeVideoCount,
        });
      })}
    </>
  );
}

export { List, Row };
