import React, { useState, useEffect } from "react";
import "../../../css/TextContainer.css";
import onlineIcon from "../../../icons/onlineIcon.png";
import { UserCircleIcon } from "@heroicons/react/24/outline";
const { addRoom, getRoom, addUserRoom } = require("../../../indexedDB/Room");

const TextContainer = ({ room }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("패치들어옴");
      try {
        console.log("패치 들어옴", room);
        const _room = await getRoom(room);
        setUsers(room.users);
        console.log(usres);
        console.log("Fetched room:", _room);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (room) {
      fetchRooms();
    }
  }, [room]);

  return (
    <div className="textContainer">
      {users.length > 0 ? (
        <div>
          <h1>People currently chatting:</h1>
          <div className="activeContainer">
            <h2>
              {users.map(({ user, index }) => (
                <div key={index} className="activeItem">
                  {user[index]}
                  <img alt="Online Icon" src={onlineIcon} />
                </div>
              ))}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TextContainer;
