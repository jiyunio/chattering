import ReactDOM from "react-dom";
import React from "react";
import reportWebVitals from "./reportWebVitals.js";
import Router from "./Router.js";
import { BrowserRouter } from "react-router-dom";
import "./css/sign.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </BrowserRouter>
);
reportWebVitals();
