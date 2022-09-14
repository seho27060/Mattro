import React, { useState } from "react";
import styles from "./LineSelectedBar.module.scss";

const LineSelectedBar = () => {
  const [selectedStation, setSeletedStation] = useState([
    { line: "L1", name: "노량진" },
    { line: "L2", name: "합정" },
    { line: "L2", name: "구로디지털단지" },
    { line: "LS", name: "판교" }
  ]);
  return (
    <div id="lineSelectedBar" className="flex align-center">
      <ul className={`flex ${styles.stations}`}>
        {selectedStation.map((station) => (
          <li
            key={station.name}
            className={`fs-20 notoBold flex align-center ${station.line} ${styles.station}`}
          >
            {station.name}
          </li>
        ))}
      </ul>
      <button
        className={`fs-20 notoBold flex align-center justify-center  ${styles.btn}`}
        type="button"
      >
        맛집 추천받기
      </button>
    </div>
  );
};

export default LineSelectedBar;
