import React, { useState } from "react";
import LineCircle, { LineCircleProps } from "./LineCircle";
import styles from "./LineSearch.module.scss";

const LineSearch = () => {
  const [searchList, setSearchList] = useState([{ id: "LS", name: "신분당" }]);

  return (
    <div id="lineSearch">
      <input
        type="text"
        className={`fs-20 notoBold ${styles.input}`}
        placeholder="지하철 역 검색"
      />
      <ul>
        {searchList.map((lineInfo: LineCircleProps) => (
          <li key={lineInfo.id} className={`flex align-center ${styles.li}`}>
            <LineCircle id={lineInfo.id} name={lineInfo.name} />
            <span id="test" className="fs-16 notoBold flex align-center">
              양재시민의 숲
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineSearch;
