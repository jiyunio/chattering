const VERSION = 17;

const addRoom = (roomName, userName) => {
  let db;
  const req = indexedDB.open("roomDataBase", VERSION);

  req.onupgradeneeded = function (e) {
    console.log(`🤯 Upgrade!`);
    db = req.target.result;
    db.createObjectStore("Room", { keyPath: "id", autoIncrement: true });
  };

  req.onsuccess = function (e) {
    console.log(`🔥 Onsuccess`);
    db = e.target.result;
    console.log(`🔥`, db);
    const _room = {
      room: roomName,
      users: [userName],
    };

    const transaction = db.transaction("Room", "readwrite");
    const store = transaction.objectStore("Room");
    store.add(_room);
  };

  req.onerror = function (e) {
    console.log("onerror! doesnt work");
    console.dir(e);
  };
};

const getRoom = (room) => {
  //채팅방 정보 가져오기
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("roomDataBase", VERSION);

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;
      try {
        const transaction = db.transaction("Room");
        const store = transaction.objectStore("Room");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (e) {
          const cursor = e.target.result;
          console.log(cursor);
          if (cursor) {
            if (cursor.value.room === room) {
              const res = {
                room: cursor.value.room,
                users: cursor.value.users,
              };
              resolve(res); // 조건에 맞는 사용자를 찾았을 때
            } else {
              cursor.continue(); // 다음 객체로 이동
            }
          } else {
            resolve(false); // 사용자를 찾지 못했을 때
          }
        };

        cursorRequest.onerror = function (e) {
          console.log("Error getting user:", e);
          reject(e); // 오류 발생 시
        };
      } catch (e) {
        reject(e);
      }
    };

    req.onerror = function (e) {
      console.log("onerror! doesn't work");
      console.dir(e);
      reject(e);
    };
  });
};

const addUserRoom = (roomName, userName) => {
  //방에 들어가면 user 이름 추가
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("roomDataBase", VERSION); // 'RoomDataBase'가 아닌 'userDataBase'를 사용해야 합니다.

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;
      try {
        const transaction = db.transaction("Room", "readwrite");
        const store = transaction.objectStore("Room");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.value.room === roomName) {
              // 사용자를 찾았을 때
              const updateData = cursor.value;
              // room 배열에 roomName 추가
              if (!updateData.users.includes(userName)) {
                updateData.users.push(userName);
                // 데이터 업데이트
                const requestUpdate = cursor.update(updateData);
                requestUpdate.onsuccess = function () {
                  console.log("Room added successfully");
                  resolve(true); // 성공적으로 추가되었을 때 true 반환
                };
                requestUpdate.onerror = function (err) {
                  console.error("Error adding room", err);
                  reject(err); // 오류 발생 시
                };
              } else {
                console.log("Room already exists");
                resolve(false); // 이미 존재하는 방이면 false 반환
              }
            } else {
              cursor.continue(); // 다음 객체로 이동
            }
          } else {
            resolve(false); // 사용자를 찾지 못했을 때
          }
        };

        cursorRequest.onerror = function (e) {
          console.log("Error getting user:", e);
          reject(e); // 오류 발생 시
        };
      } catch (e) {
        console.error("Transaction failed", e);
        reject(e);
      }
    };

    req.onerror = function (e) {
      console.log("onerror! doesn't work");
      console.dir(e);
      reject(e);
    };
  });
};

const getUserRoom = (room) => {
  //채팅방 정보 가져오기
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("roomDataBase", VERSION);

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;
      try {
        const transaction = db.transaction("Room", "readonly");
        const store = transaction.objectStore("Room");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.value.room === room) {
              const res = {
                room: cursor.value.room,
                users: cursor.value.users,
              };
              resolve(res); // 조건에 맞는 사용자를 찾았을 때
            } else {
              cursor.continue(); // 다음 객체로 이동
            }
          } else {
            resolve(false); // 사용자를 찾지 못했을 때
          }
        };

        cursorRequest.onerror = function (e) {
          console.log("Error getting user:", e);
          reject(e); // 오류 발생 시
        };
      } catch (e) {
        reject(e);
      }
    };

    req.onerror = function (e) {
      console.log("onerror! doesn't work");
      console.dir(e);
      reject(e);
    };
  });
};

module.exports = { addRoom, getRoom, addUserRoom };
