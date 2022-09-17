import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import logo from "../../public/images/logo/game_logo.png";
import Modal from "../../components/layouts/Modal";

import styles from "./index.module.scss";

const index: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div
      className={`${styles.wrapper} flex column justify-center align-center`}
    >
      <div>
        <Image src={logo} alt="logo" />
      </div>
      <Link href="/game/rooms">
        <div
          className={`${styles.start__btn} flex justify-center align-center fs-32 coreExtra`}
        >
          start
        </div>
      </Link>
      <button
        className={`${styles.explanation_btn} flex justify-center align-center fs-32 coreExtra`}
        type="button"
        onClick={toggleModal}
      >
        게임 설명
      </button>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className={`${styles.children} fs-32 coreExtra`}>
          <p>
            1. 랜덤한 유저가 지하철 노선 중 하나를 입력하면 게임이 시작됩니다.
          </p>
          <p>
            2. 유저들이 순서대로 해당 노선에 포함되는 지하철 역 이름을 제한시간
            내에 입력합니다.
          </p>
          <p>3. 1등이 가려질 때까지 위를 반복합니다.</p>
        </div>
      </Modal>
    </div>
  );
};

export default index;
