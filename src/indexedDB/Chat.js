const VERSION = 20;

const addChat = (roomName, data) => {
  console.log(data.socketId);
  //채팅방에 채팅 작성할 때
  let db;
  const req = indexedDB.open("chatDataBase", VERSION);

  req.onupgradeneeded = function (e) {
    console.log(`🤯 Upgrade!`);
    db = e.target.result;
    db.createObjectStore(roomName, {
      keyPath: data.socketId,
      autoIncrement: true,
    });
  };

  req.onsuccess = function (e) {
    console.log(`🔥 Onsuccess`);
    db = e.target.result;
    console.log(`🔥`, db);
    const chat = {
      userId: data.userId,
      content: data.content,
      created: data.created,
    };

    // 트랜잭션을 만들고 Object Store에 저장 (readwrite 데이터 쓸 때 사용)
    const objectStore = db
      .transaction(roomName, "readwrite")
      .objectStore(roomName);
    objectStore.add(chat);
  };

  req.onerror = function (e) {
    console.log("onerror! doesn't work");
    console.dir(e);
  };
};

const getChat = (roomName) => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("chatDataBase", VERSION);

    req.onsuccess = function (e) {
      console.log(`🔥 Onsuccess`);
      const db = e.target.result;

      const transaction = db.transaction(roomName);
      const store = transaction.objectStore(roomName);
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
