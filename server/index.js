const http = require("http");
const express = require("express");
const app = express();
const router = require("./router");
const cors = require("cors");
app.use(cors());
app.use(router);
const server = http.createServer(app);
const io = require("socket.io")(server);
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

// on 메소드 : 현재 접속돼있는 클라이언트로부터 메시지를 수신하기 위해 사용
io.on("connection", async (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    console.log("client join", name, room);
    const { error, user } = addUser({
      userId: socket.id,
      userName: name,
      userRoom: room,
    });
    if (error) return callback(error);

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    return;
  });

  socket.on("sendMessage", ({ room, data }, callback) => {
    console.log("dddd", data);
    const _data = data;
    const user = _data.userId;

    io.to(room).emit("message", { user: _data.userId, text: _data.content });

    console.log("Sending message from user:", user);
    console.log("User room:", room);

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} 님이 떠났습니다.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () => console.log("서버 시작합니다."));
