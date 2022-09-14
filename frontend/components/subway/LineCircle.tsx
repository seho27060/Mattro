import React from "react";
import styles from "./LineCircle.module.scss";

export type LineCircleProps = {
  id: string;
  name: string;
};

const LineCircle = ({ id, name }: LineCircleProps) => {
  return (
    <span
      className={`${id} ${styles.circle} notoBold fs-10 flex align-center justify-center`}
    >
      {name}
    </span>
  );
};

export default LineCircle;
