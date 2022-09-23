import type { NextPage } from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../public/images/logo/logo.png";
import train from "../public/images/train.png";
import styles from "./index.module.scss";

const Home: NextPage = () => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const startClick = () => {
    setClicked(true);
    setTimeout(function () {
      router.push("/theme/main");
    }, 3000);
  };

  return (
    <div className={`${styles.home}`}>
      <div className={`${styles.contents} flex column align-center`}>
        <div className={`${styles.subtitle} fs-40 coreExtra`}>
          지하철 노선별 맛집 추천
          <div />
        </div>
        <div
          className={`${styles.title} fs-100 coreHeavy flex align-center justify-center`}
        >
          <Image src={logo} alt="logo" className={styles.logo} />
        </div>
        <button
          type="button"
          onClick={() => {
            startClick();
          }}
          className={`${styles.btn} fs-40 coreExtra`}
        >
          START
        </button>
        <div className={clicked ? styles.train_out : styles.train}>
          <Image src={train} alt="train" className="styles.img" />
        </div>
      </div>
    </div>
  );
};

export default Home;
