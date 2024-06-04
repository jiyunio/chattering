const VERSION = 17;

const addUser = (data) => {
  //회원가입
  let db;
  const req = indexedDB.open("userDataBase", VERSION);

  req.onupgradeneeded = function (e) {
    console.log(`🤯 Upgrade!`);
    db = e.target.result;
    db.createObjectStore("User", { keyPath: "id", autoIncrement: true });
  };

  req.onsuccess = function (e) {
    console.log(`🔥 Onsuccess`);
    db = e.target.result;
    console.log(`🔥`, db);
    addItem();
  };

  req.onerror = function (e) {
    console.log("onerror! doesnt work");
    console.dir(e);
  };

  function addItem() {
    const _data = {
      userId: data.userId,
      userPw: data.userPw,
      room: [], // 처음에 들어갈 땐, 참여 채팅방 X
    };

    // 트랜잭션을 만들고 ObjectStore에 저장 (readwrite 데이터 쓸 때 사용)
    const objectStore = db.transaction("User", "readwrite").objectStore("User");
    objectStore.add(_data);
  }
};

const getUser = (userId) => {
  //로그인 유효성 검사 (존재하는 User인지)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("userDataBase", VERSION);

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;

      const transaction = db.transaction("User", "readonly");
      const store = transaction.objectStore("User");
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value.userId === userId) {
            const res = {
              userId: cursor.value.userId,
              userPw: cursor.value.userPw,
            };
            resolve(res); // 조건에 맞는 사용자를 찾았을 때
          } else {
            cursor.continue(); // 다음 객체로 이동
          }
        } else {
          resolve(null); // 사용자를 찾지 못했을 때
        }
      };

      cursorRequest.onerror = function (e) {
        console.log("Error getting user:", e);
        reject(e); // 오류 발생 시
      };
    };

    req.onerror = function (e) {
      console.log("onerror! doesn't work");
      console.dir(e);
      reject(e);
    };
  });
};

const getUserRoom = (userId) => {
  //사용자가 참여 중인 채팅방 전체 조회
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("userDataBase", VERSION);

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;

      const transaction = db.transaction("User", "readonly");
      const store = transaction.objectStore("User");
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value.userId === userId) {
            resolve(cursor.value.room); // 조건에 맞는 사용자를 찾았을 때
          }
        } else {
          resolve(false); // 사용자를 찾지 못했거나 roomName이 없는 경우
        }
      };

      cursorRequest.onerror = function (e) {
        console.log("Error getting user:", e);
        reject(e); // 오류 발생 시
      };
    };

    req.onerror = function (e) {
      console.log("onerror! doesn't work");
      console.dir(e);
      reject(e);
    };
  });
};

const putUserRoom = (userId, roomName) => {
  //사용자가 새로운 채팅방에 들어갈 때 사용자의 DB 채팅방 이름 추가하기
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("userDataBase", VERSION); // 'RoomDataBase'가 아닌 'userDataBase'를 사용해야 합니다.

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;
      try {
        const transaction = db.transaction("User", "readwrite");
        const store = transaction.objectStore("User");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (e) {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.value.userId === userId) {
              // 사용자를 찾았을 때
              const updateData = cursor.value;
              // room 배열에 roomName 추가
              if (!updateData.room.includes(roomName)) {
                updateData.room.push(roomName);
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

module.exports = { addUser, getUser, getUserRoom, putUserRoom };
