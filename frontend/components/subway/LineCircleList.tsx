import React from "react";
import LineCircle from "./LineCircle";
import styles from "./LineCircleList.module.scss";
import lineInfos from "../../constants/lineInfo";

const LineCircleList = () => {
  return (
    <ul id="lineCircleList" className={`${styles.infoListRect} flex`}>
      {lineInfos.map((line) => (
        <li
          id={line.id}
          key={line.id}
          className="infoLi flex align-center justify-center"
        >
          <LineCircle id={line.id} name={line.name} />
        </li>
      ))}
    </ul>
  );
};

export default LineCircleList;
