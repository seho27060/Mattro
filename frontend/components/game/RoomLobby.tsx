/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./RoomLobby.module.scss";
import chair1 from "../../public/images/chair1.png";
import chair2 from "../../public/images/chair2.png";
import subway1 from "../../public/images/subway1.svg";
import subway2 from "../../public/images/subway2.svg";
import { ISocket, IUserList } from "../../constants/socketio";
import Modal from "../layouts/Modal";
import pencil from "../../public/images/pencil.svg";
import exit from "../../public/icons/exit.svg";

interface Props {
  socket: ISocket;
  userList: IUserList[];
  roomName: string;
  defaultNick: string;
  toggle: (a: boolean) => void;
  isMute: boolean;
}

const RoomLobby: React.FunctionComponent<Props> = ({
  socket,
  userList,
  roomName,
  defaultNick,
  toggle,
  isMute
}) => {
  const router = useRouter();
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [isEnterInput, setIsEnterInput] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [nickname, setNickname] = useState<string>(defaultNick);
  const onChangeNickname: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.target.value);
  };
  const onStartLobby: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (roomName) {
      toggle(isMute);
      socket.emit("start_lobby", roomName, socket.id);
    }
  };
  useEffect(() => {
    if (isModalOpen && nicknameRef?.current) {
      nicknameRef.current.focus();
    }
  }, [isModalOpen]);
  const onEnterKeyUp = (e: { key: string }) => {
    if (e.key === "Enter") {
      setIsEnterInput(true);
    }
  };
  useEffect(() => {
    if (isEnterInput) {
      toggle(isMute);
      socket.emit("nickname", roomName, nickname);
      toggleModal();
    }
  }, [isEnterInput]);
  const onClickExit = () => {
    socket.disconnect();
    socket.emit("exit", roomName);
    router.push("/game");
  };
  return (
    <div
      className={`${styles.wrapper} flex column justify-space-between align-center`}
    >
      <button className={`${styles.exit}`} type="button" onClick={onClickExit}>
        <Image src={exit} alt="exit" />
      </button>
      <h2 className="flex justify-space-between align-center">
        <div className={`${styles.room__num__title} flex align-center`}>
          <span
            className={`${styles.room__num} flex justify-center align-center coreExtra fs-20`}
          >
            {userList.length}/4
          </span>
          <span className={`${styles.room__title} coreExtra fs-28`}>
            {roomName && roomName.length > 9
              ? `${roomName.slice(0, 9)}...`
              : roomName}
          </span>
        </div>
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
                className={`${styles.username} flex justify-center align-center notoBold`}
                onClick={() => {
                  if (user.id === socket.id) {
                    toggleModal();
                  }
                }}
                aria-hidden="true"
              >
                <span className={`${styles.username__nickname}`}>
                  {user.nickname}님
                </span>
                <div
                  className={
                    user.id === socket.id
                      ? styles.edit__visible
                      : styles.edit__invisible
                  }
                >
                  <Image src={pencil} alt="pencil" />
                </div>
              </div>
              <span
                className={`${
                  user.id === socket.id
                    ? styles.me__visible
                    : styles.me__invisible
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
        <div className={`${styles.modal} flex`}>
          <span
            className={`${styles.modal__label} flex align-center justify-center fs-32 coreExtra`}
          >
            닉네임 :
          </span>
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
      </Modal>
    </div>
  );
};

export default RoomLobby;
