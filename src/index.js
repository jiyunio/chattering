import ReactDOM from "react-dom";
import React from "react";
import reportWebVitals from "./reportWebVitals.js";
import ChatApp from "./client/app.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>
);

reportWebVitals();
