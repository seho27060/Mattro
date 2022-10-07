/* eslint-disable consistent-return */
import React from "react";
import styles from "./Ready.module.scss";

interface Props {
  isOpen: boolean;
  lineColor: string;
}

const Ready: React.FunctionComponent<Props> = ({ isOpen, lineColor }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={`${styles.body} ${lineColor}`}>
      <div className={styles.demo}>
        <div className={styles.demo__colored__blocks}>
          <div className={styles.demo__colored__blocks__rotater}>
            <div className={styles.demo__colored__blocks} />
            <div className={styles.demo__colored__blocks} />
            <div className={styles.demo__colored__blocks} />
          </div>
          <div
            className={`${styles.demo__colored__block__inner} ${lineColor}`}
          />
          <div className={`${styles.demo__text} ${lineColor}`}>Ready</div>
        </div>
        <div className={`${styles.demo__inner}`}>
          <svg className={`${styles.demo__numbers}`} viewBox="0 0 100 100">
            <defs>
              <path className="demo__num-path-1" d="M40,28 55,22 55,78" />
              <path
                className="demo__num-join-1-2"
                d="M55,78 55,83 a17,17 0 1,0 34,0 a20,10 0 0,0 -20,-10"
              />
              <path
                className="demo__num-path-2"
                d="M69,73 l-35,0 l30,-30 a16,16 0 0,0 -22.6,-22.6 l-7,7"
              />
              <path
                className="demo__num-join-2-3"
                d="M28,69 Q25,44 34.4,27.4"
              />
              <path
                className="demo__num-path-3"
                d="M30,20 60,20 40,50 a18,15 0 1,1 -12,19"
              />
            </defs>
            <path
              className={`${styles.demo__numbers__path} ${lineColor}`}
              d="M-10,20 60,20 40,50 a18,15 0 1,1 -12,19 
               Q25,44 34.4,27.4
               l7,-7 a16,16 0 0,1 22.6,22.6 l-30,30 l35,0 L69,73 
               a20,10 0 0,1 20,10 a17,17 0 0,1 -34,0 L55,83 
               l0,-61 L40,28"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Ready;
