/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./index.module.scss";
import title from "../../public/images/theme_title.png";
import char from "../../public/images/gaonasi.png";
import chair1 from "../../public/images/chair_red.png";
import chair2 from "../../public/images/chair_two.png";

export default function themeMain() {
  const btnRef = useRef(null);

  const clickMe = () => {
    const node = btnRef.current as any;
    node.classList.toggle(styles.animate);

    setTimeout(function () {
      node.classList.remove(styles.animate);
    }, 800);
  };

  return (
    <div className={`${styles.theme} flex justify-center`}>
      <div className={`${styles.contents} flex column align-center`}>
        <div className="flex column align-center">
          <div className={styles.title}>
            <Image src={title} alt="title" />
          </div>
          <p className="coreBold fs-36"> 오늘 끌리는 맛집은 어디?</p>
        </div>

        <div className={`${styles.box} flex column align-center`}>
          <div className={`${styles.images} flex`}>
            <div>
              <Image src={chair2} alt="char" className="" />
            </div>
            <button
              type="button"
              ref={btnRef}
              onClick={clickMe}
              id="button"
              className={`${styles.confetti_button} flex column`}
            >
              <div className="notoBold fs-20"> click me </div>
              <Image src={char} alt="char" />
            </button>
            <div>
              <Image src={chair1} alt="char" className="" />
            </div>
          </div>

          <nav className="flex justify-center">
            <Link href="/theme/question">
              <div
                className={`${styles.btn} fs-32 coreExtra flex align-center justify-center`}
              >
                테마별 맛집 추천받기
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
