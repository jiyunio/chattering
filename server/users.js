const users = [];

const addUser = ({ userId, userName, userRoom }) => {
  const id = userId;
  const name = userName;
  const room = userRoom;
  // const existingUser = users.find(
  //   (user) => user.room === room && user.name === name
  // );

  // if (!name || !room) {
  //   console.log("userId:", userId);
  //   console.log("userName: ", userName);
  //   return { error: "이름과 방이름이 필요합니다." };
  // }
  // if (existingUser) {
  //   console.log("userId:", id);
  //   console.log("userName: ", name);
  //   return { error: "이름이 이미 있습니다." };
  // }

  const user = { id, name, room };

  users.push(user);
  return { user };
};

const removeUser = (name) => {
  const index = users.findIndex((user) => user.name === name);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (name) => {
  return users.find((user) => user.name === name);
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
