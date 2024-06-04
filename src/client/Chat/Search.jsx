import React, { useState, useEffect, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "../../css/Search.css";
import searchIcon from "../../icons/돋보기.png";

const {
  addUser,
  getUser,
  getUserRoom,
  putUserRoom,
} = require("../../indexedDB/User");
const { addRoom, getRoom, addUserRoom } = require("../../indexedDB/Room");

const JoinRoom = ({ name }) => {
  // 현재 사용자가 접속한 채팅방 내역들 보여줌
  const [rooms, setRooms] = useState([]);
  console.log("Join", name);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const getRooms = await getUserRoom(name);
        setRooms([...getRooms]);
        console.log("get rooms:", rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (name) {
      fetchRooms();
    }
  }, [name]);

  return (
    <div id="search-room">
      {rooms.map((room, index) => (
        <div className="open-box" key={index}>
          <Link
            onClick={(e) => {
              !name || !room ? e.preventDefault() : null;
            }}
            to={`/chat?name=${name}&room=${rooms[index]}`}
          >
            <button className="search-button" type="submit">
              {rooms[index]}
            </button>
          </Link>
          <div className="total-text"></div>
        </div>
      ))}
    </div>
  );
};

const Search = () => {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [showMakeRoom, setShowMakeRoom] = useState("");
  const roomNameRef = useRef(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const userName = query.get("name");
    if (userName) {
      setName(userName);
    }
  }, []);

  const handleClick = () => {
    const room = roomNameRef.current.value;
    setRoomName(room);
    findRoom(room);
  };

  const findRoom = useCallback(
    async (room) => {
      try {
        const _room = await getRoom(room);
        if (_room) {
          console.log("방을 찾았습니다.", room);
          setShowMakeRoom("find");
          setRooms((prevRooms) => [...prevRooms, room]);
          console.log(rooms);
        } else {
          // alert("방을 찾지 못했습니다.");
          console.log(_room);
          setShowMakeRoom("fail");
        }
      } catch (error) {
        // console.error("방이 없습니다.", error);
        setShowMakeRoom("fail");
        alert("방이 없습니다.");
      }
    },
    [rooms]
  );

  const MakeRoom = () => {
    const handleJoin = () => {
      //DB 추가
      putUserRoom(name, roomName);
      addUserRoom(roomName, name);
    };

    const handleMake = () => {
      //DB 추가
      addRoom(roomName, name); //Room 새로 만들기
      putUserRoom(name, roomName);
      addUserRoom(roomName, name);
    };

    let changePage = false;
    if (showMakeRoom === "find") {
      changePage = true;
    }

    return changePage ? ( // 존재하는 채팅방
      <div>
        <div className="open-box">
          <h1>{roomName}</h1>

          <Link
            onClick={(e) => (!name ? e.preventDefault() : null)}
            to={`/chat-main?name=${name}`}
          >
            <Button
              className="search-room"
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
              className="search-room"
              sx={{ borderColor: "#0A4A9B", color: "#0A4A9B" }}
              variant="outlined"
              onClick={handleJoin}
            >
              Join
            </Button>
          </Link>
        </div>
      </div>
    ) : (
      // 존재하지 않는 채팅방
      <div>
        <div className="open-box">
          <h1>{roomName}</h1>

          <Link
            onClick={(e) => (!name ? e.preventDefault() : null)}
            to={`/chat-main?name=${name}`}
          >
            <Button
              className="search-room"
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
              className="search-room"
              sx={{ borderColor: "#0A4A9B", color: "#0A4A9B" }}
              variant="outlined"
              onClick={handleMake}
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
        <div>
          <input className="search-input" ref={roomNameRef} />
          <Button
            className="search-button"
            sx={{
              borderColor: "#bebebe",
              color: "#bebebe",
            }}
            variant="outlined"
            startIcon={
              <img
                src={searchIcon}
                alt="검색 돋보기"
                style={{ width: 24, height: 24 }}
              />
            }
            onClick={handleClick}
          ></Button>
        </div>
        <div>참여방</div>
        <JoinRoom name={name} />
      </div>
      <div className="click-screen">
        {showMakeRoom !== "" && <MakeRoom roomName={roomName} />}
      </div>
    </div>
  );
};

export default Search;
