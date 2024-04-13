import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./options.css";
import { swalConfirm, swalBasic } from "modules/swal";

function Options() {
  const click = () => {
    swalConfirm(
      "Are you sure?",
      "All video progress data will be deleted.",
      "Yes, delete it!"
    ).then((result) => {
      if (result.isConfirmed) {
        swalConfirm(
          "Are you REALLY sure?",
          "Think about it.",
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
