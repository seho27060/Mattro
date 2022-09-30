/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable react/display-name */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect
} from "react";

import styles from "./RoomStart.module.scss";
import { IUserList, ISocket } from "../../constants/socketio";
import Modal from "../layouts/Modal";
import Ready from "./Ready";

interface Props {
  userList: IUserList[];
  socket: ISocket;
  roomName: string;
  canStart: boolean;
  isStartedGame: boolean;
  turn: any;
  total: string[];
  result: any;
  order: IUserList[];
  now: number;
  line: string;
  onChangeLine: React.ChangeEventHandler<HTMLInputElement>;
  ref: React.ForwardedRef<unknown>;
}

const lineToColor = (line: string): string => {
  if (
    line === "1" ||
    line === "2" ||
    line === "3" ||
    line === "4" ||
    line === "5" ||
    line === "6" ||
    line === "7" ||
    line === "8" ||
    line === "9"
  ) {
    return line;
  }
  if (line === "경의중앙") {
    return "K";
  }
  if (line === "수인분당") {
    return "B";
  }
  if (line === "신분당") {
    return "S";
  }
  if (line === "우아신설") {
    return "W";
  }
  if (line === "신림") {
    return "SL";
  }
  return "";
};

const shuffle = (arr: IUserList[], socketId: string) => {
  const res = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].id === socketId) {
      res.push(arr.splice(i, 1)[0]);
    }
  }
  while (arr.length) {
    const randomIdx = Math.floor(Math.random() * arr.length);
    res.push(arr.splice(randomIdx, 1)[0]);
  }
  return res;
};

const RoomStart: React.FunctionComponent<Props> = forwardRef(
  (
    {
      userList,
      socket,
      roomName,
      canStart,
      isStartedGame,
      turn,
      total,
      result,
      order,
      now,
      line,
      onChangeLine
    },
    ref
  ) => {
    const timeoutReturn: { current: NodeJS.Timeout | null } = useRef(null);
    const clear = () => {
      console.log("시간초과 클리어========");
      clearTimeout(timeoutReturn.current as NodeJS.Timeout);
    };
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const toggleModal = () => {
      console.log("콘솔 켜져라 얍");
      setIsModalOpen(true);
    };
    const inputLineRef = useRef<HTMLInputElement>(null);
    const inputAnswerRef = useRef<HTMLInputElement>(null);
    // const lineRef = useRef<any>(null);
    // const circleRef = useRef<HTMLDivElement>(null);
    // const answerRef = useRef<HTMLDivElement>(null);
    const [answer, setAnswer] = useState<string>("");
    const [isReadyOpen, setIsReadyOpen] = useState<boolean>(false);
    useImperativeHandle(ref, () => ({
      toggleModal,
      clear
    }));
    const onChangeAnswer: React.ChangeEventHandler<HTMLInputElement> =
      useCallback((e) => {
        setAnswer(e.target.value);
      }, []);
    const onStartGame: React.MouseEventHandler<HTMLButtonElement> | undefined =
      useCallback(() => {
        if (!roomName) return;
        if (inputLineRef?.current) {
          if (
            [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "경의중앙",
              "수인분당",
              "신분당",
              "우아신설",
              "신림"
            ].includes(inputLineRef.current.value)
          ) {
            socket.emit(
              "start_game",
              socket.id,
              roomName,
              inputLineRef.current.value,
              shuffle([...userList], socket.id)
            );
          }
        }
      }, [roomName]);
    const onSubmitAnswer = (answer: string) => {
      if (isReadyOpen) return;
      socket.emit(
        "answer",
        roomName,
        line,
        answer,
        total,
        order,
        now,
        userList.length,
        socket.id
      );
      setAnswer("");
    };
    useEffect(() => {
      if (socket.id === turn.id) {
        if (inputAnswerRef?.current) {
          inputAnswerRef.current.focus();
        }
      }
    }, [turn]);
    const onEnterKeyUp = (e: { key: string }) => {
      if (answer && e.key === "Enter") {
        onSubmitAnswer(answer);
      }
    };
    useEffect(() => {
      if (inputLineRef?.current) {
        inputLineRef.current.focus();
      }
    }, []);
    useEffect(() => {
      if (isStartedGame) {
        setIsReadyOpen(true);
        setTimeout(() => {
          setIsReadyOpen(false);
        }, 3800);
      }
    }, [isStartedGame]);
    return (
      <div className={`${styles.wrapper} flex column align-center`}>
        <h2 className="flex justify-center align-center coreExtra fs-34">
          {turn && (
            <div>
              {isStartedGame ? (
                <div>
                  <span
                    className={`${
                      socket.id === turn.id ? styles.isTurn : styles.isNotTurn
                    }`}
                  >
                    {turn.nickname}
                  </span>
                  <span>님 차례</span>
                </div>
              ) : (
                <span>호선을 선택해주세요.</span>
              )}
            </div>
          )}
        </h2>
        <div className={`${styles.userList}`}>
          {order.map((user) => (
            <div key={user.id} className="flex column">
              <div
                className={`${
                  result.socketId === user.id ? styles.result : styles.empty
                } flex align-center justify-center coreExtra fs-24`}
              >
                <span>{result.answer}</span>
              </div>
              <div
                className={`${styles.user} flex justify-center align-center coreExtra fs-24`}
              >
                <span>{user.nickname}님</span>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${
            styles.line
          } flex justify-center align-center L${lineToColor(line)}`}
        >
          <div
            className={`${
              styles.circle
            } flex justify-center align-center L${lineToColor(line)}`}
          >
            {isStartedGame ? (
              <div className={`${styles.answer} flex align-center`}>
                <span
                  className={`${
                    styles.answer__station
                  } flex justify-center align-center coreExtra fs-48 L${lineToColor(
                    line
                  )}`}
                >
                  {line}
                </span>
                <input
                  onKeyUp={onEnterKeyUp}
                  ref={inputAnswerRef}
                  className={`${styles.answer__content} coreExtra fs-60`}
                  value={answer}
                  onChange={onChangeAnswer}
                  disabled={socket.id !== turn.id}
                />
              </div>
            ) : (
              <input
                ref={inputLineRef}
                className={`${styles.line__content} coreExtra fs-60`}
                value={line}
                onChange={onChangeLine}
              />
            )}
            {isStartedGame ? (
              <span className="coreExtra fs-60">역</span>
            ) : (
              <span className="coreExtra fs-60">(호)선</span>
            )}
          </div>
        </div>
        <div className={`${styles.footer} flex align-center justify-center`}>
          <button
            className={`${
              !isStartedGame && canStart ? styles.visible : styles.invisible
            } coreExtra fs-80`}
            type="button"
            onClick={onStartGame}
          >
            Start!
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <div className={`${styles.children} fs-32 coreExtra`}>
            <div>
              {isModalOpen && (
                <div>{result.socketId === socket.id ? "패배" : "승리"}</div>
              )}
            </div>
          </div>
        </Modal>
        <Ready isOpen={isReadyOpen} lineColor={`L${lineToColor(line)}`} />
      </div>
    );
  }
);

export default RoomStart;
