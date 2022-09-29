/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import styles from "./RoomLobby.module.scss";
import chair1 from "../../public/images/chair1.png";
import chair2 from "../../public/images/chair2.png";
import subway1 from "../../public/images/subway1.svg";
import subway2 from "../../public/images/subway2.svg";
import { ISocket, IUserList } from "../../constants/socketio";
import Modal from "../layouts/Modal";

interface Props {
  socket: ISocket;
  nowCnt: number;
  userList: IUserList[];
  roomName: string;
  nickname: string;
  setNickname: (a: string) => void;
}

const RoomLobby: React.FunctionComponent<Props> = ({
  socket,
  nowCnt,
  userList,
  roomName,
  nickname,
  setNickname
}) => {
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const onChangeNickname: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.target.value);
  };
  const onStartLobby: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (roomName) {
      socket.emit("start_lobby", roomName);
    }
  };
  useEffect(() => {
    if (isModalOpen && nicknameRef?.current) {
      nicknameRef.current.focus();
    }
  }, [isModalOpen]);
  const onEnterKeyUp = (e: { key: string }) => {
    if (e.key === "Enter") {
      socket.emit("nickname", roomName, nickname);
      toggleModal();
    }
  };
  useEffect(() => {
    if (nickname === "익명") {
      setIsModalOpen(true);
    }
  }, [nickname]);
  return (
    <div className={`${styles.wrapper} flex align-center`}>
      <h2 className="align-center coreExtra fs-30">
        <span
          className={`${styles.room__num} flex justify-center align-center coreExtra fs-28`}
        >
          {nowCnt}/4
        </span>
        <span className={`${styles.room__title}`}>
          {roomName.length > 9 ? `${roomName.slice(0, 9)}...` : roomName}
        </span>
        <span className={`${styles.subway1}`}>
          <Image src={subway1} alt="subway1" />
        </span>
      </h2>
      <div className={`${styles.userList}`}>
        {userList.map((user) => {
          return (
            <div
              className={`${styles.user} flex column justify-center align-center fs-32`}
              key={user.id}
            >
              <span className={`${styles.subway2}`}>
                <Image src={subway2} alt="subway2" />
              </span>
              <div
                className={`${styles.username} notoBold`}
                onClick={() => {
                  if (user.id === socket.id) {
                    toggleModal();
                  }
                }}
                aria-hidden="true"
              >
                {user.nickname}님
              </div>
              <span
                className={`${
                  user.id === socket.id ? styles.visible : styles.invisible
                } flex justify-center align-center notoBold fs-20`}
              >
                나
              </span>
            </div>
          );
        })}
      </div>
      <footer className={styles.footer}>
        <span className={styles.chair1}>
          <Image src={chair1} alt="chair1" />
        </span>
        <button
          className={`${styles.startBtn} flex align-center justify-center coreExtra fs-32`}
          type="button"
          onClick={onStartLobby}
        >
          start
        </button>
        <span className={styles.chair2}>
          <Image src={chair2} alt="chair1" />
        </span>
      </footer>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className={`${styles.children} fs-32 coreExtra`}>
          <div>
            <span className={styles.modal__label}>닉네임 :</span>
            <input
              onKeyUp={onEnterKeyUp}
              ref={nicknameRef}
              className={`${styles.modal__input} fs-32 coreExtra`}
              type="text"
              required
              maxLength={6}
              value={nickname}
              onChange={onChangeNickname}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomLobby;
