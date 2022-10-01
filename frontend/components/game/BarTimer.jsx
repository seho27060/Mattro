/* eslint-disable react/prop-types */
import { useEffect } from "react";
import styles from "./BarTimer.module.scss";

const BarTimer = ({ limit, line }) => {
  const start = Date.now();
  const end = start + limit;
  const getPercentage = (now) => {
    const diff = now - start;
    return ((limit - diff) / limit) * 100;
  };
  const progressBar = (percentage) => {
    const progress = document.querySelector(".progress__inner");
    if (progress) {
      progress.style = `width: ${`${percentage}%`}`;
    }
  };
  const myFunction = () => {
    const now = Date.now();
    const percentage = getPercentage(now);
    progressBar(percentage);
    if (end > now + 30) {
      window.requestAnimationFrame(myFunction);
    }
  };
  useEffect(() => {
    window.requestAnimationFrame(myFunction);
  }, [limit]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.progress}>
        <div className={`${styles.progress__inner} progress__inner L${line}`} />
      </div>
    </div>
  );
};

export default BarTimer;
