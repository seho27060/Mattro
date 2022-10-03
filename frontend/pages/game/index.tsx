import type { NextPage } from "next";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import logo from "../../public/images/logo/game_logo.png";
import Modal from "../../components/layouts/Modal";
import styles from "./index.module.scss";
import useAudio from "../../components/useAudio";
import click from "../../public/sounds/click.mp3";

const Index: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [toggle] = useAudio(click);

  const onClickStart = () => {
    toggle();
    router.push("/game/main");
  };

  return (
    <div
      className={`${styles.wrapper} flex column justify-center align-center`}
    >
      <div>
        <Image src={logo} alt="logo" />
      </div>
      <div
        className={`${styles.start__btn} flex justify-center align-center fs-32 coreExtra`}
        onClick={onClickStart}
        aria-hidden="true"
      >
        start
      </div>
      <button
        className={`${styles.explanation_btn} flex justify-center align-center fs-32 coreExtra`}
        type="button"
        onClick={() => {
          toggle();
          toggleModal();
        }}
      >
        게임 설명
      </button>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className={`${styles.children} fs-32 coreExtra`}>
          <div className={styles.article}>
            1. 어떤 유저가 게임을 시작하고 지하철 노선 중 하나를 입력하면 게임이
            시작됩니다.
          </div>
          <div className={styles.article}>
            2. 유저들은 랜덤한 순서대로 해당 노선에 포함되는 지하철 역 이름을
            제한시간 내에 입력합니다.
          </div>
          <div className={styles.article}>
            3. 정답이 틀리거나 시간을 초과한 유저는 패배하고 나머지는
            승리합니다.
          </div>
          <div className={styles.article}>
            &#8251; 호선은 1 ~ 9 호선, 경의중앙선, 수인분당선, 신분당선,
            우아신설선, 신림선만 입력 가능합니다.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
