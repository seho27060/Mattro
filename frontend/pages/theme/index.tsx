/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./index.module.scss";
import title from "../../public/images/theme_title.png";
import char from "../../public/images/gaonasi.png";
import chair1 from "../../public/images/chair_red.png";
import chair2 from "../../public/images/chair_two.png";
import textBox from "../../public/images/textbox.svg";

export default function themeMain() {
  const btnRef = useRef(null);
  const [throttle, setThrottle] = useState<boolean>(false);
  const [textAppear, setTextAppear] = useState<boolean>(false);
  const [foodNum, setFoodNum] = useState<number>(0);
  const coinAction = () => {
    if (throttle) return;
    if (!throttle) {
      setThrottle(true);
      const node = btnRef.current as any;
      node.classList.toggle(styles.animate);

      setTimeout(function () {
        node.classList.remove(styles.animate);
        setThrottle(false);
      }, 800);
    }
  };

  const textAction = () => {
    console.log(foodList);

    if (textAppear) setTextAppear(false);
    if (!textAppear) {
      setTextAppear(true);
      const random = Math.floor(Math.random() * 30);
      setFoodNum(random);
    }
  };

  const clickMe = () => {
    coinAction();
    textAction();
  };

  const foodList: Array<string> = [
    "족발",
    "국밥",
    "매운탕",
    "이자카야",
    "브런치",
    "닭볶음탕",
    "순대",
    "치킨",
    "닭발",
    "초밥",
    "채식",
    "갈비탕",
    "곱창",
    "냉면",
    "돈가스",
    "양갈비",
    "양꼬치",
    "햄버거",
    "만두",
    "막국수",
    "한정식",
    "떡볶이",
    "마라탕",
    "김치찜",
    "삼겹살",
    "소고기",
    "물회",
    "파스타",
    "스테이크",
    "와플"
  ];

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
          {textAppear && (
            <div
              className={`${styles.textBalloon} flex align-center justify-center`}
            >
              <Image src={textBox} alt="click" className={styles.balloonImg} />
              <p className="notoBold fs-24">{foodList[foodNum]}</p>
            </div>
          )}
          {!textAppear && (
            <div className={`${styles.dummy} flex align-center justify-center`}>
              <Image src={textBox} alt="click" className={styles.balloonDis} />
              <p className="notoBold fs-24">disappear</p>
            </div>
          )}
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
