import React from "react";
import styles from "./Stepbar.module.scss";

export default function Stepbar() {
  const num = "1 / 10";
  return (
    <div className={`${styles.step} flex column`}>
      <div className={`${styles.num} notoBold fs-20`}>{num}</div>
      <div className={`${styles.bar} notoBold fs-20`}>
        <div />
      </div>
    </div>
  );
}
