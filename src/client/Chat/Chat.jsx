import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import TextContainer from "./Component/TextContainer";
import InfoBar from "./Component/InfoBar";
import Messages from "./Component/Messages";
import Input from "./Component/Input";
import "../../css/Chatchat.css";
import "../../css/Chat.css";

import "../../css/Chat.css";

const {
  addUser,
  getUser,
  getUserRoom,
  putUserRoom,
} = require("../../indexedDB/User");
const { addChat, getChat } = require("../../indexedDB/Chat");

const ENDPOINT = "http://localhost:5000";
const socket = io(ENDPOINT);

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const name = query.get("name");
    const room = query.get("room");

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      //서버로 name, room 값 전달
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, window.location.search]);

  useEffect(() => {
    getUser(room)
      .then((users) => {
        // 가져온 사용자 정보를 상태에 설정하거나 다른 처리를 할 수 있습니다.
        console.log("Room users:", users);
        setUsers(users); // 예시: 사용자 정보를 상태에 저장
      })
      .catch((error) => {
        console.log("Error fetching users:", error);
      });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    console.log("메시지 보내기 들어옴", 1);
    event.preventDefault();

    const data = {
      userId: name,
      socketId: socket.id,
      content: message,
      created: new Date(),
    };

    if (message) {
      addChat(room, data);
      socket.emit("sendMessage", { room, data }, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
