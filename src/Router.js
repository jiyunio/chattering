import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatApp from "./client/app";
import SignUp from "./client/SignUp";
import Welcome from "./client/WelcomePage";
import SignIn from "./client/SignIn";
import Chatting from "./client/Chat/Chatting";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatApp />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/welcome" element={<Welcome />}></Route>
        <Route path="/chatting" element={<Chatting />}></Route>
      </Routes>
    </div>
  );
}
export default App;
