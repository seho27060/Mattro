import React from "react";
import styles from "./Stepbar.module.scss";

interface Props {
  //
  duration: number;
}

const Stepbar: React.FunctionComponent<Props> = ({ duration }) => {
  const num = `${duration + 1} / 5`;
  // const percent = {duration + 1} * 20;
  return (
    <div className={`${styles.step} flex column`}>
      <div className={`${styles.num} notoBold fs-20`}>{num}</div>
      <div className={styles.bar}>{/* <div style = {width : /> */}</div>
    </div>
  );
};

export default Stepbar;
