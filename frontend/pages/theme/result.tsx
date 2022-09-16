import React from "react";
import ResultCard from "../../components/theme/ResultCard";
import styles from "./result.module.scss";

export default function themeMain() {
  const food = "떡볶이";
  return (
    <div className={`${styles.result} flex justify-center`}>
      <div className={`${styles.contents} flex column align-center`}>
        <div className={`${styles.title} fs-24 coreBold flex align-center`}>
          <div>이번역은</div>
          <div className={`${styles.food} coreExtra`}>
            <span>{food}</span> 역
          </div>
          <div>입니다.</div>
        </div>
        <ResultCard />
        <div className={`${styles.btns} flex`}>
          <button type="button" className={`${styles.btn} notoBold fs-16`}>
            다른 메뉴 추천 받기
          </button>
          <button type="button" className={`${styles.btn} notoBold fs-16`}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
