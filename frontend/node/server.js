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
// const wss = new WebSocket.Server({ httpServer });
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
      size: data.get(roomName).get("size")
    });
  });
  return res;
}

function whoInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName);
}

function howManyInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

const data = new Map();

io.on("connection", (socket) => {
  // 소켓 연결 되자마자 강제로 어떤 방으로 입장시키기
  // io.socketsJoin("어떤");
  // socket.data.nickname = `Anonymous`;
  socket.data.nickname = `익명`;
  // socket.emit("room_change", publicRooms());
  socket.onAny((event) => {
    // console.log(io.sockets.adapter);
    console.log(`Socket Event : ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    if (!data.get(roomName)) {
      data.set(roomName, new Map());
    }
    if (data.get(roomName).get("isStarted")) {
      socket.emit("isStarted");
      return;
    }
    data.get(roomName).set("size", howManyInRoom(roomName));
    if (howManyInRoom(roomName) >= 4) {
      socket.emit("full");
      return;
    }
    const totalUser = whoInRoom(roomName);
    if (!totalUser) {
      socket.join(roomName);
    } else {
      for (let i = 0; i < totalUser.size; i += 1) {
        if (totalUser[i] === socket.id) {
          return;
        }
        socket.join(roomName);
      }
    }
    if (!data.get(roomName).get("size")) {
      data.get(roomName).set("size", 1);
    } else {
      data.get(roomName).set("size", data.get(roomName).get("size") + 1);
    }
    done();
    socket.emit(
      "welcome",
      roomName,
      { id: socket.id, nickname: socket.data.nickname },
      howManyInRoom(roomName)
    );
    socket
      .to(roomName)
      .emit(
        "welcome",
        roomName,
        { id: socket.id, nickname: socket.data.nickname },
        howManyInRoom(roomName)
      );
    // socket.emit("room_change", res);
    // 방 입장할 때마다 방 개수를 emit
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("iMHere", (roomName) => {
    socket.to(roomName).emit("iMHere", {
      id: socket.id,
      nickname: socket.data.nickname
    });
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.id, howManyInRoom(room) - 1);
      socket.emit("bye", socket.id, howManyInRoom(room) - 1);
      socket.to(room).emit("who_out");
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", getAllRooms());
  });
  socket.on("nickname", (roomName, nickname) => {
    socket.data.nickname = nickname;
    socket.emit("nickname", socket.id, nickname);
    socket.to(roomName).emit("nickname", socket.id, nickname);
  });
  socket.on("start_lobby", (roomName) => {
    socket.to(roomName).emit("start_lobby", false);
    socket.emit("start_lobby", true);
  });
  socket.on("start_game", (socketId, roomName, line, order) => {
    data.get(roomName).set("isStarted", true);
    data.get(roomName).set("order", order);
    data.get(roomName).set("now", 0);
    data.get(roomName).set("timeout", null);
    data.get(roomName).set("limit", 8000);
    data.get(roomName).set("clear", false);
    socket.to(roomName).emit("start_game", line, order);
    socket.emit("start_game", line, order);
    clearTimeout(data.get(roomName).get("timeout"));
    console.log("스타트게임 클리어");
    data.get(roomName).set("clear", true);
    console.log(
      "시간 체크 시작========",
      data.get(roomName).get("limit") -
        500 *
          Math.floor(
            data.get(roomName).get("now") /
              data.get(roomName).get("order").length
          )
    );
    const timeoutId = setTimeout(() => {
      console.log(
        "시간초과 =============",
        data.get(roomName).get("limit") -
          500 *
            Math.floor(
              data.get(roomName).get("now") /
                data.get(roomName).get("order").length
            )
      );
      socket.emit("start_time_over", socketId);
      socket.to(roomName).emit("start_time_over", socketId);
      data.get(roomName).set("clear", false);
    }, data.get(roomName).get("limit") - 500 * Math.floor(data.get(roomName).get("now") / data.get(roomName).get("order").length) + 3800);
    data.get(roomName).set("timeout", timeoutId);
  });
  socket.on("room_change", () => {
    socket.emit("room_change", getAllRooms());
  });
  socket.on(
    "answer",
    (roomName, line, answer, arr, order, now, userListNum, socketId) => {
      clearTimeout(data.get(roomName).get("timeout"));
      console.log("앤서 클리어");
      if (!data.get(roomName).get("clear")) {
        return;
      }
      const res = isAnswer(line, answer, arr);
      arr.push(answer);
      socket.emit(
        "check_answer",
        roomName,
        res,
        arr,
        answer,
        order,
        now,
        userListNum,
        socketId
      );
      socket
        .to(roomName)
        .emit(
          "check_answer",
          roomName,
          res,
          arr,
          answer,
          order,
          now,
          userListNum,
          socketId
        );
      console.log(
        "시간 체크 시작========",
        data.get(roomName).get("limit") -
          500 *
            Math.floor(
              data.get(roomName).get("now") /
                data.get(roomName).get("order").length
            )
      );
      data.get(roomName).set("clear", true);
      const timeoutId = setTimeout(() => {
        console.log(
          "시간초과 =============",
          data.get(roomName).get("limit") -
            500 *
              Math.floor(
                data.get(roomName).get("now") /
                  data.get(roomName).get("order").length
              )
        );
        socket.emit("time_over", order, now);
        socket.to(roomName).emit("time_over", order, now);
        data.get(roomName).set("clear", false);
      }, data.get(roomName).get("limit") - 500 * Math.floor(data.get(roomName).get("now") / data.get(roomName).get("order").length));
      data.get(roomName).set("timeout", timeoutId);
    }
  );
  socket.on(
    "correct",
    (roomName, answer, order, now, userListNum, socketId) => {
      now += 1;
      socket.emit("correct", answer, socketId, now, order[now % userListNum]);
      socket
        .to(roomName)
        .emit("correct", answer, socketId, now, order[now % userListNum]);
    }
  );
  socket.on("uncorrect", (roomName, answer, socketId) => {
    clearTimeout(data.get(roomName).get("timeout"));
    console.log("언코렉트 클리어");
    socket.to(roomName).emit("uncorrect", answer, socketId);
    socket.emit("uncorrect", answer, socketId);
    data.get(roomName).set("isStarted", false);
  });
  socket.on("time_over", (roomName, answer, socketId) => {
    clearTimeout(data.get(roomName).get("timeout"));
    console.log("타임오버 클리어");
    socket.to(roomName).emit("uncorrect", answer, socketId);
    socket.emit("uncorrect", answer, socketId);
    data.get(roomName).set("isStarted", false);
  });
  socket.on("on_change_line", (roomName, line) => {
    socket.to(roomName).emit("on_change_line", line);
  });
});

const port = 8000;

httpServer.listen(port, () => {
  console.log(
    `Listening on http://localhost:${port} && Admin : https://admin.socket.io`
  );
});
