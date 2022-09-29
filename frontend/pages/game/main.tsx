/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import type { NextPage } from "next";
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

import { IUserList } from "../../constants/socketio";
import OpenRoomList from "../../components/game/OpenRoomList";
import RoomLobby from "../../components/game/RoomLobby";
import RoomStart from "../../components/game/RoomStart";
import styles from "./main.module.scss";

const socket =
  process.env.NODE_ENV === "development"
    ? io("ws://localhost:8000")
    : io("ws://j7c206.p.ssafy.io:8000");

const Main: NextPage = () => {
  const childRef = useRef<{
    setLine: (line: string) => void;
    toggleModal: (a: boolean) => void;
    clear: () => void;
  }>(null);
  const [roomName, setRoomName] = useState<string>("");
  // const [messages, setMessages] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isStartedLobby, setIsStartedLobby] = useState<boolean>(false);
  const [nowCnt, setNowCnt] = useState<number>(1);
  const [userList, setUserList] = useState<IUserList[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);
  const [isStartedGame, setIsStartedGame] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("익명");
  const [order, setOrder] = useState<IUserList[]>([]);
  const [turn, setTurn] = useState<IUserList | object>({});
  const [total, setTotal] = useState<string[]>([]);
  const [result, setResult] = useState({});
  const [now, setNow] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8000);

  const resetGame = useCallback(() => {
    setIsStartedLobby(false);
    setIsStartedGame(false);
    setOrder([]);
    setTurn({});
    setTotal([]);
    setResult({});
    setNow(0);
    setLimit(5000);
  }, []);

  useEffect(() => {
    socket.emit("room_change");
    socket.on("welcome", (roomName, newUser, newCount) => {
      setRoomName(roomName);
      setUserList((prev) => [...prev, newUser]);
      setNowCnt(newCount);
      socket.emit("iMHere", roomName);
    });
    socket.on("iMHere", (newUser) => {
      setUserList((prev) => {
        const filteredPrev = prev.filter((user) => user.id !== newUser.id);
        return [...filteredPrev, newUser];
      });
    });
    socket.on("bye", (socketId, newCount) => {
      setUserList((prev) => [...prev].filter((user) => user.id !== socketId));
      setNowCnt(newCount);
    });
    socket.on("room_change", (rooms) => {
      setRoomList(rooms);
    });
    socket.on("start_lobby", (canStart) => {
      setCanStart(canStart);
      setIsStartedLobby(true);
    });
    socket.on("start_game", (line, order) => {
      setIsStartedGame(true);
      childRef.current?.setLine(line);
      setTurn(order[0]);
      setOrder(order);
      setNow(0);
      // setLimit(limit);
    });
    socket.on("nickname", (socketId, nickname) => {
      setUserList((prev) => {
        const copy = [...prev];
        copy.forEach((user) => {
          if (user.id === socketId) {
            user.nickname = nickname;
          }
        });
        return copy;
      });
    });
    socket.on(
      "check_answer",
      (roomName, res, arr, answer, order, now, userListNum, socketId) => {
        childRef.current?.clear();
        if (res === "정답") {
          console.log("맞음!!");
          setTotal(arr);
          socket.emit(
            "correct",
            roomName,
            answer,
            order,
            now,
            userListNum,
            socketId
          );
        }
        if (res === "오답") {
          console.log("틀림!!");
          socket.emit("uncorrect", roomName, res, socketId);
        }
        if (res === "중복") {
          console.log("중복!!");
          socket.emit("uncorrect", roomName, res, socketId);
        }
      }
    );
    socket.on("correct", (answer, socketId, now, turn) => {
      setResult({ answer, socketId });
      setTimeout(() => {
        setResult({});
        setNow(now);
        setTurn(turn);
      }, 1000);
    });
    socket.on("uncorrect", (answer, socketId) => {
      setResult({ answer, socketId });
      childRef.current?.toggleModal(true);
      // setTimeout(() => {
      //   childRef.current?.toggleModal(true);
      // }, 1000);
      setTimeout(() => {
        resetGame();
      }, 3000);
    });
    socket.on("time_over", (order, now) => {
      setResult({
        answer: "시간초과",
        socketId: order[(now + 1) % order.length].id
      });
      childRef.current?.toggleModal(true);
      // setTimeout(() => {
      //   childRef.current?.toggleModal(true);
      // }, 1000);
      setTimeout(() => {
        resetGame();
      }, 3000);
    });
    socket.on("start_time_over", (socketId) => {
      setResult({
        answer: "시간초과",
        socketId
      });
      childRef.current?.toggleModal(true);
      // setTimeout(() => {
      //   childRef.current?.toggleModal(true);
      // }, 1000);
      setTimeout(() => {
        resetGame();
      }, 3000);
    });
    socket.on("who_out", () => {
      resetGame();
    });
    return () => {
      socket.off("welcome");
      socket.off("iMHere");
      socket.off("bye");
      socket.off("room_change");
      socket.off("start_lobby");
      socket.off("start_game");
      socket.off("nickname");
      socket.off("check_answer");
      socket.off("correct");
      socket.off("uncorrect");
      socket.off("time_over");
      socket.off("start_time_over");
      socket.off("who_out");
    };
  }, []);

  // const leave = (e: any) => {
  // setIsEntered(false);
  // resetGame();
  // socket.disconnect();
  // setTimeout(() => {
  //   router.push("/");
  // }, 10000);
  // e.preventDefault();
  // e.returnValue = "";
  // socket.emit("time_over", roomName, "시간초과", socket.id);
  // };

  // useEffect(() => {
  //   window.addEventListener("beforeunload", leave);
  //   return () => {
  //     window.removeEventListener("beforeunload", leave);
  //   };
  // }, []);

  // const [closeSession, setCloseSession] = useState(false);

  // const closeQuickView = () => {
  //   setCloseSession(true);
  // };

  // useEffect(() => {
  //   window.history.pushState(
  //     "fake-route",
  //     document.title,
  //     window.location.href
  //   );
  //   window.addEventListener("popstate", closeQuickView);
  //   return () => {
  //     window.removeEventListener("popstate", closeQuickView);
  //     if (window.history.state === "fake-route") {
  //       window.history.back();
  //     }
  //   };
  // }, []);
  return (
    <div className={styles.wrapper}>
      {socket && isEntered ? (
        isStartedLobby ? (
          <RoomStart
            userList={userList}
            socket={socket}
            roomName={roomName}
            canStart={canStart}
            isStartedGame={isStartedGame}
            ref={childRef}
            turn={turn}
            total={total}
            result={result}
            order={order}
            now={now}
            // limit={limit}
            // closeSession={closeSession}
            resetGame={resetGame}
            setIsEntered={setIsEntered}
          />
        ) : (
          <RoomLobby
            socket={socket}
            nowCnt={nowCnt}
            userList={userList}
            roomName={roomName}
            nickname={nickname}
            setNickname={setNickname}
          />
        )
      ) : (
        <OpenRoomList
          roomList={roomList}
          socket={socket}
          setIsEntered={setIsEntered}
        />
      )}
    </div>
  );
};

export default Main;
