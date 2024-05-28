import React, { useState, useEffect } from "react";

// 함수 이름 'Main'을 명시적으로 선언
const Main = () => {
  const [word, setWord] = useState({ word: "아직 안 옴" });

  useEffect(() => {
    fetch("http://localhost:8080/sign-up")
      .then((response) => {
        return response.json(); // 'json' 메서드를 호출합니다.
      })
      .then((body) => {
        const newWord = { ...body };
        setWord(newWord);
        console.log(newWord);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []); // 의존성 배열을 추가하여 컴포넌트 마운트 시에만 실행되도록 합니다.

  return (
    <>
      <div>{word.word}</div>
      <div>프론트입니당</div>
    </>
  );
};

export default Main;
