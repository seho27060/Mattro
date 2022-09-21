import React, { useState } from "react";
import LineCircle from "./LineCircle";
import styles from "./LineCircleList.module.scss";
import lineInfos from "../../constants/lineInfo";
import { UsedLineIdType } from "../../constants/lineType";

type LineCircleListProps = {
  togggleSelectedLines: (line: UsedLineIdType) => void;
};

const LineCircleList = ({ togggleSelectedLines }: LineCircleListProps) => {
  return (
    <ul
      id="lineCircleList"
      className={`${styles.infoListRect} flex justify-center`}
    >
      {lineInfos.map((line) => (
        <li
          id={line.id}
          key={line.id}
          className="infoLi flex align-center justify-center"
        >
          <LineCircle
            id={line.id}
            lineName={line.name}
            togggleSelectedLines={togggleSelectedLines}
          />
        </li>
      ))}
    </ul>
  );
};

export default LineCircleList;
