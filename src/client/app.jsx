import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../css/style.css";

const socket = io.connect();

const UsersList = ({ users }) => (
  <div className="users">
    <h3>참여자들</h3>
    <ul>
      {users.map((user, i) => (
        <li key={i}>{user}</li>
      ))}
    </ul>
  </div>
);

const Message = ({ user, text }) => (
  <div className="message">
    <strong>{user} :</strong>
    <span>{text}</span>
  </div>
);

const MessageList = ({ messages }) => (
  <div className="messages">
    <h2>채팅방</h2>
    {messages.map((message, i) => (
      <Message key={i} user={message.user} text={message.text} />
    ))}
  </div>
);

const MessageForm = ({ onMessageSubmit, user }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = { user, text };
    onMessageSubmit(message);
    setText("");
  };

  return (
    <div className="message_form">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="메시지 입력"
          className="textinput"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <h3></h3>
      </form>
    </div>
  );
};

const ChangeNameForm = ({ onChangeName }) => {
  const [newName, setNewName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onChangeName(newName);
    setNewName("");
  };

  return (
    <div className="change_name_form">
      <h3>아이디 변경</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="변경할 아이디 입력"
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
        />
      </form>
    </div>
  );
};

const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const initialize = (data) => {
      const { users, name } = data;
      setUsers(users);
      setUser(name);
    };

    const messageReceive = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const userJoined = (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    };

    const userLeft = (user) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u !== user));
    };

    const userChangedName = ({ oldName, newName }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user === oldName ? newName : user))
      );
      if (user === oldName) {
        setUser(newName);
      }
    };

    socket.on("init", initialize);
    socket.on("send:message", messageReceive);
    socket.on("user:join", userJoined);
    socket.on("user:left", userLeft);
    socket.on("change:name", userChangedName);

    return () => {
      socket.off("init", initialize);
      socket.off("send:message", messageReceive);
      socket.off("user:join", userJoined);
      socket.off("user:left", userLeft);
      socket.off("change:name", userChangedName);
    };
  }, [user]);

  const handleMessageSubmit = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit("send:message", message);
  };

  const handleChangeName = (newName) => {
    const oldName = user;
    socket.emit("change:name", { name: newName }, (result) => {
      if (!result) {
        return alert("There was an error changing your name");
      }
      setUsers((prevUsers) => {
        const index = prevUsers.indexOf(oldName);
        const updatedUsers = [...prevUsers];
        updatedUsers.splice(index, 1, newName);
        return updatedUsers;
      });
      setUser(newName);
    });
  };

  return (
    <div>
      <div className="center">
        <UsersList users={users} />
        <ChangeNameForm onChangeName={handleChangeName} />
        <MessageList messages={messages} />
        <MessageForm onMessageSubmit={handleMessageSubmit} user={user} />
      </div>
    </div>
  );
};

export default ChatApp;
