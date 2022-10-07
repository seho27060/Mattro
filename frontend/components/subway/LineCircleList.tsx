import React from "react";
import LineCircle from "./LineCircle";
import styles from "./LineCircleList.module.scss";
import lineInfos from "../../constants/lineInfo";
import { UsedLineIdType } from "../../constants/lineType";

type LineCircleListProps = {
  togggleSelectedLines: (line: UsedLineIdType) => void;
  setSelectedLines: (lines: UsedLineIdType[]) => void;
  selectedLinesSize: number;
};

const LineCircleList = ({
  togggleSelectedLines,
  setSelectedLines,
  selectedLinesSize
}: LineCircleListProps) => {
  const handleAllSelectLines = () => {
    if (selectedLinesSize === 14) {
      setSelectedLines([]);
    } else {
      setSelectedLines(lineInfos.map((line) => line.id));
    }
  };
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
            name={line.name}
            togggleSelectedLines={togggleSelectedLines}
          />
        </li>
      ))}
      <li key="all" className="flex align-center justify-center notoBold">
        <button
          type="button"
          className={`${selectedLinesSize === 14} notoBold fs-16`}
          onClick={handleAllSelectLines}
        >
          All
        </button>
      </li>
    </ul>
  );
};

export default LineCircleList;
