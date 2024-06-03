import React, { useState } from "react";
import Chat from "./Chat";
import Search from "./Search";
import "../../css/Chatchat.css";

const ChatMain = () => {
  const [showSearchWindow, setSearchWindow] = useState("");

  const handleSearchClick = (event) => {
    event.preventDefault();
    if (showSearchWindow !== "search") {
      setSearchWindow("search");
    }
  };

  return (
    <div container>
      <aside className="side-bar">
        <section className="side-bar__icon-box">
          <section className="side-bar__icon-1">
            <div></div>
            <div></div>
            <div></div>
          </section>
        </section>
        <ul>
          <li>
            <a href="#" onClick={handleSearchClick}>
              Serch
            </a>
          </li>
          <li>
            <a href="#">menu3</a>
          </li>
          <li>
            <a href="#">menu4</a>
          </li>
        </ul>
      </aside>
      {showSearchWindow === "search" && <Search />}
    </div>
  );
};

export default ChatMain;
