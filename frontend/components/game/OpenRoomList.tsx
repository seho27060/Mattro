/* eslint-disable react/display-name */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import Image from "next/image";

import station from "../../public/images/station.png";
import chair1 from "../../public/images/chair1.png";
import styles from "./OpenRoomList.module.scss";
import type { ISocket, IRoomList } from "../../constants/socketio";
import Modal from "../layouts/Modal";

interface Props {
  roomList: IRoomList[];
  socket: ISocket;
  setIsEntered: (a: boolean) => void;
  ref: React.ForwardedRef<unknown>;
}

const Rooms: React.FunctionComponent<Props> = forwardRef(
  ({ roomList, socket, setIsEntered }, ref) => {
    useImperativeHandle(ref, () => ({
      toggleIsFullModal,
      toggleIsStartedModal
    }));
    const modalRoomNameInput = useRef<HTMLInputElement>(null);
    const [roomName, setRoomName] = useState<string>("");
    const [isMakeRoomModalOpen, setIsMakeRoomModalOpen] =
      useState<boolean>(false);
    const toggleMakeRoomModal = () => setIsMakeRoomModalOpen((prev) => !prev);
    const [isFullModalOpen, setIsFullModalOpen] = useState<boolean>(false);
    const toggleIsFullModal = () => setIsFullModalOpen((prev) => !prev);

    const [isStartedModalOpen, setIsStartedModalOpen] =
      useState<boolean>(false);
    const toggleIsStartedModal = () => setIsStartedModalOpen((prev) => !prev);

    const onChangeRoomName: React.ChangeEventHandler<HTMLInputElement> = (
      e
    ) => {
      setRoomName(e.target.value);
    };
    const onMakeRoom: React.MouseEventHandler<HTMLButtonElement> = () => {
      if (roomName.trim() === "") return;
      socket.emit("enter_room", roomName, () => {
        setIsEntered(true);
      });
    };
    const onKeyUpEnterMakeRoom: React.KeyboardEventHandler<
      HTMLInputElement
    > = (e: { key: string }) => {
      if (e.key === "Enter") {
        if (roomName.trim() === "") return;
        socket.emit("enter_room", roomName, () => {
          setIsEntered(true);
        });
      }
    };
    const onEnterRoom = (e: any) => {
      if (e.currentTarget?.innerText?.split("\n")?.[1]) {
        socket.emit(
          "enter_room",
          e.currentTarget.innerText.split("\n")[1],
          () => {
            setIsEntered(true);
          }
        );
      }
    };
    useEffect(() => {
      if (isMakeRoomModalOpen) {
        if (modalRoomNameInput.current) {
          modalRoomNameInput.current.focus();
        }
      }
    }, [isMakeRoomModalOpen]);
    return (
      <div
        className={`${styles.wrapper} flex column justify-space-between align-center`}
      >
        <span className={styles.station}>
          <Image src={station} alt="station" />
        </span>
        <div className={styles.roomList}>
          {roomList.map((room) => (
            <div
              className={`${styles.room} flex align-center`}
              key={room.roomName}
              onClick={onEnterRoom}
              aria-hidden="true"
            >
              <p className="flex align-center fs-34 coreExtra">
                <span
                  className={`${styles.room__num} flex justify-center align-center fs-24 coreExtra`}
                >
                  {room.size}/4
                </span>
                <span>
                  {room.roomName && room.roomName.length > 10
                    ? `${room.roomName.slice(0, 10)}...`
                    : room.roomName}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.chair1}>
            <Image src={chair1} alt="chair1" />
          </span>

          <button
            className="fs-24 coreExtra"
            type="button"
            onClick={toggleMakeRoomModal}
          >
            방 만들기
          </button>
        </div>
        <Modal isOpen={isMakeRoomModalOpen} onClose={toggleMakeRoomModal}>
          <div className={`${styles.modal} flex column`}>
            <div className={`${styles.modal__content} flex`}>
              <span
                className={`${styles.modal__label} flex align-center justify-center fs-32 coreExtra`}
              >
                방 제목 :
              </span>
              <input
                className={`${styles.modal__input} flex align-center justify-center fs-32 coreExtra`}
                onKeyUp={onKeyUpEnterMakeRoom}
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
        <Modal isOpen={isFullModalOpen} onClose={toggleIsFullModal}>
          <div className="fs-32 coreExtra">방이 꽉 찼습니다.</div>
        </Modal>
        <Modal isOpen={isStartedModalOpen} onClose={toggleIsStartedModal}>
          <div className="fs-32 coreExtra">게임이 이미 시작했습니다.</div>
        </Modal>
      </div>
    );
  }
);

export default Rooms;
