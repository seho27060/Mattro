import React from "react";
import styles from "./LineCircle.module.scss";

export type LineCircleProps = {
  id: string;
  lineName: string;
};

const LineCircle = ({ id, lineName }: LineCircleProps) => {
  return (
    <span
      className={`${id} ${styles.circle} notoBold fs-10 flex align-center justify-center`}
    >
      {lineName}
    </span>
  );
};

export default LineCircle;
