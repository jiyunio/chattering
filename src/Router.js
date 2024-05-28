import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./client/Main";
import ChatApp from "./client/app";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/main" element={<Main />}></Route>
        <Route path="/" element={<ChatApp />}></Route>
      </Routes>
    </div>
  );
}
export default App;
