/* eslint-disable react/display-name */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, {
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
  toggle: (a: boolean) => void;
  ref: React.ForwardedRef<unknown>;
}

const Rooms: React.FunctionComponent<Props> = forwardRef(
  ({ roomList, socket, setIsEntered, toggle }, ref) => {
    useImperativeHandle(ref, () => ({
      toggleIsFullModal,
      toggleIsStartedModal
    }));
    const modalRoomNameInput = useRef<HTMLInputElement>(null);
    const [roomName, setRoomName] = useState<string>("");
    const [isMakeRoomModalOpen, setIsMakeRoomModalOpen] =
      useState<boolean>(false);
    const toggleMakeRoomModal = () => {
      toggle(true);
      setIsMakeRoomModalOpen((prev) => !prev);
    };
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
      toggle(true);
      socket.emit("enter_room", roomName, () => {
        setIsEntered(true);
      });
    };
    const onKeyUpEnterMakeRoom: React.KeyboardEventHandler<
      HTMLInputElement
    > = (e: { key: string }) => {
      if (e.key === "Enter") {
        if (roomName.trim() === "") return;
        toggle(true);
        socket.emit("enter_room", roomName, () => {
          setIsEntered(true);
        });
      }
    };
    const onEnterRoom = (e: any) => {
      if (e.currentTarget?.innerText?.split("\n")?.[1]) {
        toggle(true);
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
              className={`${styles.room} flex justify-space-between align-center`}
              key={room.roomName}
              onClick={onEnterRoom}
              aria-hidden="true"
            >
              <div className={`${styles.room__num__name} flex`}>
                <span
                  className={`${styles.room__num} flex justify-center align-center coreExtra fs-28`}
                >
                  {room.size}/4
                </span>
                <span
                  className={`${styles.room__name} flex justify-center align-center coreExtra fs-32`}
                >
                  {room.roomName && room.roomName.length > 9
                    ? `${room.roomName.slice(0, 9)}...`
                    : room.roomName}
                </span>
              </div>
              <div className={`${styles.room__status}`}>
                {room.isStarted && (
                  <span
                    className={`${styles.room__isStarted} flex justify-center align-center coreExtra fs-20`}
                  >
                    게임중
                  </span>
                )}
              </div>
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
          <div className={`${styles.modal__warning} fs-32 coreExtra`}>
            방이 꽉 찼습니다.
          </div>
        </Modal>
        <Modal isOpen={isStartedModalOpen} onClose={toggleIsStartedModal}>
          <div className={`${styles.modal__warning} fs-32 coreExtra`}>
            게임이 이미 시작했습니다.
          </div>
        </Modal>
      </div>
    );
  }
);

export default Rooms;
