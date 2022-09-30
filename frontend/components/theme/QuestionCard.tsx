import React from "react";
import styles from "./QuestionCard.module.scss";

export default function QuestionCard() {
  const num = 0;
  const ques = "오늘의 날씨는";
  const select1 = "비가 추적추적 내리는 날";
  const select2 = "햇볕 쨍쨍 내리쬐는 날";
  return (
    <div className={styles.card}>
      <div className={`${styles.title} coreExtra fs-60`}>Q{num}.</div>
      <div className={`${styles.ques} coreExtra fs-40`}>{ques}</div>
      <div className={styles.select}>
        <button type="button" className="fs-32 notoBold flex align-center">
          {select1}
        </button>
        <button type="button" className="fs-32 notoBold flex align-center">
          {select2}
        </button>
      </div>
    </div>
  );
}
