import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import station from "../../public/images/station.png";
import chair1 from "../../public/images/chair1.png";
import styles from "./OpenRoomList.module.scss";
import type { ISocket } from "../../pages/game/api/socketio";

interface Props {
  roomList: string[];
  socket: ISocket;
  setIsEntered: (a: boolean) => void;
}

const Rooms: React.FunctionComponent<Props> = ({
  roomList,
  socket,
  setIsEntered
}) => {
  useEffect(() => {
    socket.emit("enter_room", "지하철 게임", () => {
      setIsEntered(true);
    });
  }, []);
  const title = useRef<HTMLSpanElement>(null);
  const [roomName, setRoomName] = useState<string>("");
  const onChangeRoomName: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setRoomName(e.target.value);
    }, []);
  const onMakeRoom: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      if (roomName.trim() === "") return;
      socket.emit("enter_room", roomName, () => {
        setIsEntered(true);
      });
    }, [roomName]);

  const onEnterRoom: React.MouseEventHandler<HTMLSpanElement> =
    useCallback(() => {
      if (title.current?.textContent) {
        socket.emit("enter_room", title.current?.textContent, () => {
          setIsEntered(true);
        });
      }
    }, [title.current]);

  return (
    <div className={`${styles.wrapper} flex column align-center`}>
      <span className={styles.station}>
        <Image src={station} alt="station" />
      </span>
      <div className={styles.roomList}>
        {roomList.map((room) => (
          <div
            className={`${styles.room} flex align-center`}
            key={room}
            onClick={onEnterRoom}
            aria-hidden="true"
          >
            <p className="flex align-center fs-34 coreExtra">
              <span
                className={`${styles.room__num} flex justify-center align-center fs-24 coreExtra`}
              >
                {0}/4
              </span>
              <span ref={title}>
                {room.length > 10 ? `${room.slice(0, 10)}...` : room}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.chair1}>
          <Image src={chair1} alt="chair1" />
        </span>
        <input
          style={{ border: "1px solid black" }}
          value={roomName}
          onChange={onChangeRoomName}
        />
        <button className="fs-24 coreExtra" type="button" onClick={onMakeRoom}>
          방 만들기
        </button>
      </div>
    </div>
  );
};

export default Rooms;
