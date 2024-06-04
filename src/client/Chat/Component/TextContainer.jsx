import React, { useState, useEffect } from "react";
import "../../../css/TextContainer.css";
import onlineIcon from "../../../icons/onlineIcon.png";
const { addRoom, getRoom, addUserRoom } = require("../../../indexedDB/Room");

const TextContainer = ({ room }) => {
  const [users, setUsers] = useState([]);
  console.log("room", room);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const _room = await getRoom(room);
        setUsers(_room.users);
        console.log("users", users);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (room) {
      console.log("fetch");
      fetchRooms();
    }
  }, [room]);

  return (
    <div className="textContainer">
      {users.length > 0 ? (
        <div>
          <div>참여자</div>
          <div className="activeContainer">
            <h2>
              {users.map((user) => (
                <div key={user} className="activeItem">
                  <img alt="Online Icon" src={onlineIcon} />
                  {user}
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
