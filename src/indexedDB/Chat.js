const VERSION = 27;

const addChat = (roomName, data) => {
  let db;
  const req = indexedDB.open("ChatDataBase", VERSION);

  req.onupgradeneeded = function (e) {
    console.log(`🤯 Upgrade!`);
    db = e.target.result;
    db.createObjectStore(roomName, {
      keyPath: "id",
      autoIncrement: true,
    });
  };

  req.onsuccess = function (e) {
    console.log(`🔥 Onsuccess`);
    db = e.target.result;
    console.log(`🔥`, db);
    addItem();
  };

  req.onerror = function (e) {
    console.error("Error opening database", e.target.errorCode);
  };

  function addItem() {
    const _data = {
      userId: data.userId,
      content: data.content,
      created: data.created,
    };

    const objectStore = db
      .transaction(roomName, "readwrite")
      .objectStore(roomName);
    objectStore.add(_data);
  }
};

const getChat = (roomName) => {
  const room = roomName;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("ChatDataBase", VERSION);

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;

      const transaction = db.transaction(room);
      const store = transaction.objectStore(room);
      const cursorRequest = store.openCursor();
      const chatMessages = [];

      cursorRequest.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          chatMessages.push(cursor.value);
          cursor.continue(); // 다음 객체로 이동
        } else {
          resolve(chatMessages); // 모든 채팅 내용을 반환
        }
      };

      cursorRequest.onerror = function (e) {
        console.log("Error getting chats:", e);
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

module.exports = { addChat, getChat };
