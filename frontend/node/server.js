/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-self-assign */
/* eslint-disable no-param-reassign */
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import isAnswer from "./checkAnswer";

const app = express();

app.use(cors());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: true
  }
});

function publicRooms() {
  const { sids, rooms } = io.sockets.adapter;
  const res = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      res.push(key);
    }
  });
  return res;
}

function getAllRooms() {
  const res = [];
  publicRooms().forEach((roomName) => {
    res.push({
      roomName,
      size: howManyInRoom(roomName),
      isStarted: data.get(roomName).get("isStarted")
    });
  });
  return res;
}

function howManyInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

function getNickname(roomName) {
  let nickname = "익명";
  if (data.get(roomName).get("nicknameList").length > 0) {
    nickname = data.get(roomName).get("nicknameList").pop();
  }
  return nickname;
}

function shuffle(arr, socketId) {
  const userList = [...arr];
  const res = [];
  for (let i = 0; i < userList.length; i += 1) {
    if (userList[i].id === socketId) {
      res.push(userList.splice(i, 1)[0]);
    }
  }
  while (userList.length) {
    const randomIdx = Math.floor(Math.random() * userList.length);
    res.push(userList.splice(randomIdx, 1)[0]);
  }
  return res;
}

const data = new Map();

io.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    if (!data.get(roomName)) {
      data.set(roomName, new Map());
      data.get(roomName).set("userList", []);
      data
        .get(roomName)
        .set("nicknameList", ["4번 출구", "3번 출구", "2번 출구", "1번 출구"]);
      data.get(roomName).set("isStarted", false);
    }
    if (data.get(roomName).get("isStarted")) {
      socket.emit("isStarted");
      return;
    }
    if (howManyInRoom(roomName) >= 4) {
      socket.emit("full");
      return;
    }
    socket.data.nickname = getNickname(roomName);
    data.get(roomName).get("userList").push({
      id: socket.id,
      nickname: socket.data.nickname
    });
    socket.join(roomName);
    done();
    socket.emit("welcome", roomName, [...data.get(roomName).get("userList")]);
    socket
      .to(roomName)
      .emit("welcome", roomName, [...data.get(roomName).get("userList")]);
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomName) => {
      if (data.get(roomName)) {
        data.get(roomName).set("userList", [
          ...data
            .get(roomName)
            .get("userList")
            .filter((user) => user.id !== socket.id)
        ]);
        socket.to(roomName).emit("who_out", data.get(roomName).get("userList"));
        if (
          ["4번 출구", "3번 출구", "2번 출구", "1번 출구"].includes(
            socket.data.nickname
          )
        ) {
          data.get(roomName).get("nicknameList").push(socket.data.nickname);
        }
        data.get(roomName).set("isStarted", false);
      }
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("nickname", (roomName, nickname) => {
    socket.data.nickname = nickname;
    data
      .get(roomName)
      .get("userList")
      .forEach((user) => {
        if (user.id === socket.id) {
          user.nickname = nickname;
        }
      });
    const newUserList = data.get(roomName).get("userList");
    socket.emit("nickname", newUserList);
    socket.to(roomName).emit("nickname", newUserList);
  });
  socket.on("start_lobby", (roomName, socketId) => {
    data.get(roomName).set("isStarted", true);
    io.sockets.emit("room_change", getAllRooms());
    socket.to(roomName).emit("start_lobby", false, socketId);
    socket.emit("start_lobby", true, socketId);
  });
  socket.on("start_game", (socketId, roomName, line) => {
    data.get(roomName).set("answerList", []);
    data.get(roomName).set("now", 0);
    data.get(roomName).set("timeout", null);
    data.get(roomName).set("limit", 8000);
    data.get(roomName).set("clear", false);
    const order = shuffle(data.get(roomName).get("userList"), socket.id);
    data.get(roomName).set("order", order);
    data.get(roomName).set("order", order);
    const limit = data.get(roomName).get("limit");
    data.get(roomName).set("limit", limit);
    socket.to(roomName).emit("start_game", line, order, limit);
    socket.emit("start_game", line, order, limit);
    clearTimeout(data.get(roomName).get("timeout"));
    data.get(roomName).set("clear", true);
    const timeoutId = setTimeout(() => {
      socket.emit("start_time_over", socketId);
      socket.to(roomName).emit("start_time_over", socketId);
      data.get(roomName).set("clear", false);
    }, limit + 3800);
    data.get(roomName).set("timeout", timeoutId);
  });
  socket.on("room_change", () => {
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("answer", (roomName, line, answer, socketId) => {
    if (!data.get(roomName).get("clear")) {
      return;
    }
    clearTimeout(data.get(roomName).get("timeout"));
    data.get(roomName).set("clear", true);
    const res = isAnswer(line, answer, [
      ...data.get(roomName).get("answerList")
    ]);
    socket.emit("check_answer", roomName, res, answer, socketId);
    let limit = 8000;
    if (data.get(roomName).get("limit") > 4500) {
      limit =
        data.get(roomName).get("limit") -
        100 *
          ((data.get(roomName).get("now") + 1) /
            data.get(roomName).get("userList").length);
      data.get(roomName).set("limit", limit);
    } else {
      limit = data.get(roomName).get("limit") - 1;
      data.get(roomName).set("limit", limit);
    }
    socket.emit("limit", data.get(roomName).get("limit"));
    socket.to(roomName).emit("limit", data.get(roomName).get("limit"));
    const order = data.get(roomName).get("order");
    const now = data.get(roomName).get("now");
    const timeoutId = setTimeout(() => {
      socket.emit("time_over", order, now);
      socket.to(roomName).emit("time_over", order, now);
      data.get(roomName).set("clear", false);
    }, data.get(roomName).get("limit"));
    data.get(roomName).set("timeout", timeoutId);
  });
  socket.on("correct", (roomName, answer, socketId) => {
    data.get(roomName).get("answerList").push(answer);
    const next = data.get(roomName).get("now") + 1;
    data.get(roomName).set("now", next);
    const order = data.get(roomName).get("order");
    socket.emit(
      "correct",
      answer,
      socketId,
      order[next % data.get(roomName).get("userList").length]
    );
    socket
      .to(roomName)
      .emit(
        "correct",
        answer,
        socketId,
        order[next % data.get(roomName).get("userList").length]
      );
  });
  socket.on("uncorrect", (roomName, answer, socketId) => {
    clearTimeout(data.get(roomName).get("timeout"));
    socket.to(roomName).emit("uncorrect", answer, socketId);
    socket.emit("uncorrect", answer, socketId);
    data.get(roomName).set("isStarted", false);
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("time_over", (roomName, answer, socketId) => {
    clearTimeout(data.get(roomName).get("timeout"));
    socket.to(roomName).emit("uncorrect", answer, socketId);
    socket.emit("uncorrect", answer, socketId);
    data.get(roomName).set("isStarted", false);
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("on_change_line", (roomName, line) => {
    socket.to(roomName).emit("on_change_line", line);
  });
  socket.on("exit", (roomName) => {
    if (data.get(roomName)) {
      data.get(roomName).set("userList", [
        ...data
          .get(roomName)
          .get("userList")
          .filter((user) => user.id !== socket.id)
      ]);
      socket.to(roomName).emit("who_out", data.get(roomName).get("userList"));
      if (
        ["4번 출구", "3번 출구", "2번 출구", "1번 출구"].includes(
          socket.data.nickname
        )
      ) {
        data.get(roomName).get("nicknameList").push(socket.data.nickname);
      }
      data.get(roomName).set("isStarted", false);
    }
    io.sockets.emit("room_change", getAllRooms());
  });
});

const port = 8000;

httpServer.listen(port);
