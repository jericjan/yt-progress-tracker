import { VIDEO_PLAYER_SELECTOR } from "./youtubeFuncs";
import { waitforElem } from "./elemFuncs";

const timeParam = new URLSearchParams(location.href).get("t");

if (timeParam) {
  const time = parseInt(timeParam);

  waitforElem(VIDEO_PLAYER_SELECTOR).then((e) => {
    (e as YT.Player).seekTo(time, true);
  });
}

export {};
