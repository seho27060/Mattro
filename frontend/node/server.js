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

function whoInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName);
}

function howManyInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

let timeout;
let order;
let now;
let limit;
let clear = false;

io.on("connection", (socket) => {
  order = [];
  now = 0;
  limit = 8000;
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
    if (howManyInRoom(roomName) >= 4) {
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
    // 방 입장할 때마다 방 개수를 emit
    io.sockets.emit("room_change", publicRooms());
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
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
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
  socket.on("start_game", (socketId, roomName, line, newOrder) => {
    order = newOrder;
    socket.to(roomName).emit("start_game", line, order);
    socket.emit("start_game", line, order);
    clearTimeout(timeout);
    console.log("스타트게임 클리어");
    clear = true;
    console.log(
      "시간 체크 시작========",
      limit - 500 * Math.floor(now / order.length)
    );
    timeout = setTimeout(() => {
      console.log(
        "시간초과 =============",
        limit - 500 * Math.floor(now / order.length)
      );
      socket.emit("start_time_over", socketId);
      socket.to(roomName).emit("start_time_over", socketId);
      clear = false;
    }, limit - 500 * Math.floor(now / order.length));
  });
  socket.on("room_change", () => {
    socket.emit("room_change", publicRooms());
  });
  socket.on(
    "answer",
    (roomName, line, answer, arr, order, now, userListNum, socketId) => {
      clearTimeout(timeout);
      console.log("앤서 클리어");
      if (!clear) {
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
        limit - 500 * Math.floor(now / order.length)
      );
      clear = true;
      timeout = setTimeout(() => {
        console.log(
          "시간초과 =============",
          limit - 500 * Math.floor(now / order.length)
        );
        socket.emit("time_over", order, now);
        socket.to(roomName).emit("time_over", order, now);
        clear = false;
      }, limit - 500 * Math.floor(now / order.length));
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
    clearTimeout(timeout);
    console.log("언코렉트 클리어");
    socket.to(roomName).emit("uncorrect", answer, socketId);
    socket.emit("uncorrect", answer, socketId);
  });
  socket.on("time_over", (roomName, answer, socketId) => {
    clearTimeout(timeout);
    console.log("타임오버 클리어");
    socket.to(roomName).emit("uncorrect", answer, socketId);
    socket.emit("uncorrect", answer, socketId);
  });
});

const port = 8000;

httpServer.listen(port, () => {
  console.log(
    `Listening on http://localhost:${port} && Admin : https://admin.socket.io`
  );
});
