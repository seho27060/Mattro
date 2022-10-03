import { Socket } from "socket.io-client";

export interface IUserList {
  id: string;
  nickname: string;
  me: boolean;
}

export interface IRoomList {
  roomName: string;
  size: number;
  isStarted: boolean;
  isFull: boolean;
}

export interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  welcome: (nickname: string, newCount: number) => void;
  bye: (nickname: string, newCount: number) => void;
  new_message: (message: string) => void;
  room_change: (rooms: []) => void;
  welcome_count: (newCount: number) => void;
}

export interface ClientToServerEvents {
  enter_room: (roomName: string, done: () => void) => void;
  disconnecting: () => void;
  disconnect: () => void;
  new_message: (msg: string, room: object, done: () => void) => void;
  nickname: (roomName: string, nickname: string) => void;
  start_lobby: (roomName: string, socketId: string) => void;
  start_game: (
    socketId: string,
    roomName: string,
    line: string,
    order: IUserList[]
  ) => void;
  answer: (
    roomName: string,
    line: string,
    answer: string,
    order: IUserList[],
    now: number,
    userListNum: number,
    socketId: string
  ) => void;
  time_over: (roomName: string, answer: string, socketId: string) => void;
}

export type ISocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  nickname: string;
}
