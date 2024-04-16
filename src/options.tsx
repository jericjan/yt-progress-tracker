import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./options.css";
import { swalConfirm, swalBasic } from "modules/swal";
import anime from "animejs";

function Options() {
  useEffect(() => {
    anime({
      targets: "#big-ass-button",
      translateY: [
        { value: "131vh", easing: "steps(1)" },
        { value: "0vh", easing: "easeOutElastic" },
      ],
      scaleY: [
        { value: "5", easing: "steps(1)" },
        { value: "1", easing: "easeOutElastic" },
      ],
      rotate: [
        { value: "0", delay: 1500 },
        { value: "360", duration: 1000, easing: "easeInOutBack" },
      ],
      "background-color": [
        { value: "#eceff4", delay: 2250, easing: "easeOutSine" },
        { value: "#ff5757", duration: 500 },
        { value: "#eceff4", duration: 500 },
      ],
      opacity: [{value: 0, duration: 0}, {value: 1,duration: 3000}],
      easing: "linear",
      duration: 3000,
    });

    return function () {
      anime.remove("#big-ass-button");
    };
  }, []);

  const click = () => {
    swalConfirm(
      "All video progress data will be deleted.",
      "Are you sure?",
      "Yes, delete it!"
    ).then((result) => {
      if (result.isConfirmed) {
        swalConfirm(
          "Think about it.",
          "Are you REALLY sure?",
          "Yes, I'm sure."
        ).then((result) => {
          if (result.isConfirmed) {
            chrome.storage.local.clear();
            swalBasic("Deleted!", "Progress data has been wiped.", "success");
          }
        });
      }
    });
  };

  return (
    <>
      <button id="big-ass-button" onClick={click}>
        Clear Data
      </button>
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
