import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import station from "../../public/images/station.png";
import chair1 from "../../public/images/chair1.png";
import styles from "./OpenRoomList.module.scss";
import type { ISocket } from "../../constants/socketio";
import Modal from "../layouts/Modal";

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
  // useEffect(() => {
  //   socket.emit("enter_room", "지하철 게임", () => {
  //     setIsEntered(true);
  //   });
  // }, []);
  const title = useRef<HTMLSpanElement>(null);
  const modalRoomNameInput = useRef<HTMLInputElement>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

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
        socket.emit("enter_room", title.current.textContent, () => {
          setIsEntered(true);
        });
      }
    }, [title.current]);

  useEffect(() => {
    if (isModalOpen) {
      if (modalRoomNameInput.current) {
        modalRoomNameInput.current.focus();
      }
    }
  }, [isModalOpen]);

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

        <button className="fs-24 coreExtra" type="button" onClick={toggleModal}>
          방 만들기
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className={`${styles.modal} flex column`}>
          <div className="flex">
            <span
              className={`${styles.modal__label} flex align-center justify-center fs-32 coreExtra`}
            >
              방 제목 :
            </span>
            <input
              className={`${styles.modal__input} flex align-center justify-center fs-32 coreExtra`}
              ref={modalRoomNameInput}
              value={roomName}
              onChange={onChangeRoomName}
            />
          </div>
          <button
            className={`${styles.modal__btn} fs-24 coreExtra`}
            type="button"
            onClick={onMakeRoom}
          >
            방 만들기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Rooms;
