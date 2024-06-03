import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "../../css/Search.css";

const {
  addUser,
  getUser,
  getUserRoom,
  putUserRoom,
} = require("../../indexedDB/User");
const { addRoom, getRoom, addUserRoom } = require("../../indexedDB/Room");

const Search = () => {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [showMakeRoom, setShowMakeRoom] = useState(false);
  const roomNameRef = useRef(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setName(query.get("name"));
  }, []);

  const handleClick = () => {
    const room = roomNameRef.current.value;
    setRoomName(room);
    findRoom(room);
  };

  const handleButton = () => {
    addRoom(roomName, name);
    putUserRoom(name, roomName);
  };

  const findRoom = async (room) => {
    try {
      const _room = await getRoom(room);
      if (_room) {
        console.log("방을 찾았습니다.", room);
        setShowMakeRoom(false);
        setRooms([...rooms, { room: _room.room, total: _room.users.length }]);
        console.log(rooms);
      } else {
        alert("방을 찾지 못했습니다.");
        console.log(_room);
        setShowMakeRoom(true);
      }
    } catch (error) {
      console.error("방이 없습니다.", error);
      setShowMakeRoom(true);
      alert("방이 없습니다.");
    }
  };
  const MakeRoom = () => {
    return (
      <div>
        <div className="open-box">
          <div>{roomName}</div>

          <Link
            onClick={(e) => (!name ? e.preventDefault() : null)}
            to={`/chat-main?name=${name}`}
          >
            <Button
              sx={{ borderColor: "#0A4A9B", color: "#0A4A9B" }}
              variant="outlined"
            >
              Cancle
            </Button>
          </Link>
          <Link
            onClick={(e) => {
              !name | !roomName ? e.preventDefault() : null;
            }}
            to={`/chat?name=${name}&room=${roomName}`}
          >
            <Button
              sx={{ borderColor: "#0A4A9B", color: "#0A4A9B" }}
              variant="outlined"
              onClick={handleButton}
            >
              Make
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="room-container">
      <div className="search-screen">
        <p>Chatting Room</p>
        <input className="search-input" ref={roomNameRef} />
        <button onClick={handleClick}>search</button>
        <div id="search-room">
          {rooms.map((room, index) => (
            <div className="room-box" key={index}>
              <Link
                onClick={(e) => {
                  !name || !room ? e.preventDefault() : null;
                }}
                to={`/chat?name=${name}&room=${room.room}`}
                // 지역변수의 room 값을 가져와야 함 (채팅방이 여러개라면)
              >
                <button className="search-button" type="submit">
                  {room.room} {room.total}
                </button>
              </Link>
              <div className="total-text"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="click-screen">
        {showMakeRoom && <MakeRoom roomName={roomName} />}
      </div>
    </div>
  );
};

export default Search;
