import React, { useState } from "react";
import LineCircle, { LineCircleProps } from "./LineCircle";
import styles from "./LineSearch.module.scss";

const LineSearch = () => {
  const [searchList, setSearchList] = useState<
    (LineCircleProps & { stationName: string })[]
  >([
    // { id: "LS", lineName: "신분당", stationName: "양재시민의 숲" },
    // { id: "L2", lineName: "2", stationName: "홍대" },
    // { id: "L6", lineName: "6", stationName: "동대입구" }
  ]);

  return (
    <div id="lineSearch">
      {/* <input
        type="text"
        className={`fs-20 notoBold ${styles.input}`}
        placeholder="지하철 역 검색"
      />
      <ul className={`${styles.ul}`}>
        {searchList.map((lineInfo) => (
          <li key={lineInfo.id} className={`flex align-center ${styles.li}`}>
            <LineCircle id={lineInfo.id} lineName={lineInfo.lineName} />
            <span id="test" className="notoBold flex align-center">
              {lineInfo.stationName}
            </span>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default LineSearch;
