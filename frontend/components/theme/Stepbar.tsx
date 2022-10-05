import React from "react";
import styles from "./Stepbar.module.scss";

interface Props {
  duration: number;
}

const Stepbar: React.FunctionComponent<Props> = ({ duration }) => {
  const num = `${duration + 1} / 5`;
  const percent = (duration + 1) * 20;
  const name = `s${percent}`;

  return (
    <div className={`${styles.step} flex column`}>
      <div className={`${styles.num} notoBold fs-20`}>{num}</div>
      <div className={styles.bar}>
        <div className={name} style={{ width: `${percent}%` }} />
        <style jsx>
          {`
            .s20 {
              animation-name: bar_20;
            }
            .s40 {
              animation-name: bar_40;
            }
            .s60 {
              animation-name: bar_60;
            }
            .s80 {
              animation-name: bar_80;
            }
            .s100 {
              animation-name: bar_100;
            }
            @keyframes bar_20 {
              from {
                width: 0%;
              }
              to {
                width: 20%;
              }
            }
            @keyframes bar_40 {
              from {
                width: 20%;
              }
              to {
                width: 40%;
              }
            }
            @keyframes bar_60 {
              from {
                width: 40%;
              }
              to {
                width: 60%;
              }
            }
            @keyframes bar_80 {
              from {
                width: 60%;
              }
              to {
                width: 80%;
              }
            }
            @keyframes bar_100 {
              from {
                width: 80%;
              }
              to {
                width: 100%;
              }
          `}
        </style>
      </div>
    </div>
  );
};

export default Stepbar;
