import React from "react";
import styles from "./LineLoadingBar.module.scss";

type LineLoadingBarProps = {
  name: string;
  color: string;
};

const LineLoadingBar = ({ name, color }: LineLoadingBarProps) => {
  return (
    <div className={`${styles.wrapper} flex align-center justify-center`}>
      <div className={`${color} flex align-center justify-center`}>
        <p
          className={`notoBold flex align-center justify-center ${styles.circle} ${color}`}
        >
          {name}
        </p>
      </div>
    </div>
  );
};

export default LineLoadingBar;
