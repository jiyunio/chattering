import React from "react";
import { Routes, Route } from "react-router-dom";
import "../src/css/main.css";
import SignUp from "./client/SignUp";
import Welcome from "./client/WelcomePage";
import SignIn from "./client/SignIn";
import Chat from "./client/Chat/Chat";
import ChatMain from "./client/Chat/ChatMain";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/chat" element={<Chat />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/chat-main" element={<ChatMain />}></Route>
        {/* <Route path="/chatting" element={<Chatting />}></Route> */}
      </Routes>
    </div>
  );
}
export default App;
