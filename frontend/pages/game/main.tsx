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
import useAudio from "../../components/useAudio";
import click from "../../public/sounds/click.mp3";
import gameMainMusic from "../../public/sounds/gameMainMusic.mp3";

const socket =
  process.env.NODE_ENV === "development"
    ? io("ws://localhost:8000")
    : io("wss://j7c206.p.ssafy.io", { path: "/node/socket.io" });

const Main: NextPage = () => {
  const [toggle] = useAudio(click);
  const [toggleBGM] = useAudio(gameMainMusic);
  let timeout: any;
  const roomStartRef = useRef<{
    setLine: (line: string) => void;
    toggleModal: (a: boolean) => void;
  }>(null);
  const openRoomListRef = useRef<{
    toggleIsFullModal: (a: boolean) => void;
    toggleIsStartedModal: (a: boolean) => void;
  }>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [roomList, setRoomList] = useState([]);
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isStartedLobby, setIsStartedLobby] = useState<boolean>(false);
  const [nowCnt, setNowCnt] = useState<number>(1);
  const [userList, setUserList] = useState<IUserList[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);
  const [isStartedGame, setIsStartedGame] = useState<boolean>(false);
  const [order, setOrder] = useState<IUserList[]>([]);
  const [turn, setTurn] = useState<IUserList | object>({});
  const [result, setResult] = useState({});
  const [now, setNow] = useState<number>(0);
  const [line, setLine] = useState<string>("2");
  const [limit, setLimit] = useState<number>(8000);
  const [startId, setStartId] = useState<string>("");
  const onChangeLine: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (isStartedGame) return;
    setLine(e.target.value);
    socket.emit("on_change_line", roomName, e.target.value);
  };

  const resetGame = useCallback(() => {
    setIsStartedLobby(false);
    setIsStartedGame(false);
    setOrder([]);
    setTurn({});
    setResult({});
    setNow(0);
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
    socket.on("room_change", (rooms) => {
      setRoomList(rooms);
    });
    socket.on("start_lobby", (canStart, socketId) => {
      setStartId(socketId);
      setCanStart(canStart);
      setIsStartedLobby(true);
    });
    socket.on("start_game", (line, order, limit) => {
      setIsStartedGame(true);
      setLine(line);
      setTurn(order[0]);
      setOrder(order);
      setNow(0);
      setLimit(limit);
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
      (roomName, res, answer, order, now, userListNum, socketId) => {
        if (res === "정답") {
          console.log("맞음!!");
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
      setNow(now);
      setTurn(turn);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setResult({});
      }, 1500);
    });
    socket.on("uncorrect", (answer, socketId) => {
      toggleBGM(false);
      setTurn({});
      setResult({ answer, socketId });
      roomStartRef.current?.toggleModal(true);
      setTimeout(() => {
        resetGame();
      }, 3000);
    });
    socket.on("time_over", (order, now) => {
      toggleBGM(false);
      setTurn({});
      setResult({
        answer: "시간초과",
        socketId: order[(now + 1) % order.length].id
      });
      roomStartRef.current?.toggleModal(true);
      setTimeout(() => {
        resetGame();
      }, 3000);
    });
    socket.on("start_time_over", (socketId) => {
      toggleBGM(false);
      setTurn({});
      setResult({
        answer: "시간초과",
        socketId
      });
      roomStartRef.current?.toggleModal(true);
      setTimeout(() => {
        resetGame();
      }, 3000);
    });
    socket.on("who_out", (socketId, newCnt) => {
      toggleBGM(false);
      setUserList((prev) => [...prev].filter((user) => user.id !== socketId));
      setNowCnt(newCnt);
      resetGame();
    });
    socket.on("on_change_line", (line) => {
      setLine(line);
    });
    socket.on("full", () => {
      openRoomListRef.current?.toggleIsFullModal(true);
    });
    socket.on("isStarted", () => {
      openRoomListRef.current?.toggleIsStartedModal(true);
    });
    socket.on("limit", (limit) => {
      setLimit(limit);
    });
    return () => {
      socket.off("welcome");
      socket.off("iMHere");
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
      socket.off("on_change_line");
      socket.off("full");
      socket.off("limit");
      socket.disconnect();
    };
  }, []);
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
            ref={roomStartRef}
            turn={turn}
            result={result}
            order={order}
            now={now}
            line={line}
            onChangeLine={onChangeLine}
            limit={limit}
            startId={startId}
            toggle={toggle}
            toggleBGM={toggleBGM}
          />
        ) : (
          userList &&
          userList.filter((user) => user.id === socket.id)?.[0]?.nickname && (
            <RoomLobby
              socket={socket}
              nowCnt={nowCnt}
              userList={userList}
              roomName={roomName}
              defaultNick={
                userList.filter((user) => user.id === socket.id)[0].nickname
              }
              toggle={toggle}
            />
          )
        )
      ) : (
        <OpenRoomList
          ref={openRoomListRef}
          roomList={roomList}
          socket={socket}
          setIsEntered={setIsEntered}
          toggle={toggle}
        />
      )}
    </div>
  );
};

export default Main;
