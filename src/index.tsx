import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const template = document.getElementById("li_template") as HTMLTemplateElement;
async () => {
  // const firstChild = template.content.firstElementChild as Element;
  var savedVods = await chrome.storage.local.get(null)
  console.log(savedVods)
  // const elem = firstChild.cloneNode(true);
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
