/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { UsedLineIdType, UsedLinNameType } from "../../constants/lineType";
import styles from "./LineCircle.module.scss";

export type LineCircleProps = {
  id: UsedLineIdType;
  lineName: UsedLinNameType;
  togggleSelectedLines: null | ((line: UsedLineIdType) => void);
};
const LineCircle = ({
  id,
  lineName,
  togggleSelectedLines
}: LineCircleProps) => {
  const toggleCircle = () => {
    if (togggleSelectedLines) {
      togggleSelectedLines(id);
    }
  };
  return (
    <span
      className={`${id} ${styles.circle} notoBold fs-10 flex align-center justify-center`}
      onClick={toggleCircle}
    >
      {lineName}
    </span>
  );
};

export default LineCircle;
