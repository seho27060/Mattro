/* eslint-disable import/no-cycle */
import React from "react";
import { SelectedStationType } from "../../pages/subway";
import styles from "./LineSelectedBar.module.scss";

type LineSelectedBarProps = {
  selectedStations: SelectedStationType[];
};

const LineSelectedBar = ({ selectedStations }: LineSelectedBarProps) => {
  return (
    <div id="lineSelectedBar" className="flex align-center">
      <ul className={`flex ${styles.stations} align-center`}>
        {selectedStations.map((station) => (
          <li
            key={station.name}
            className={`notoBold flex column align-center justify-center ${styles.station}`}
          >
            <div className={`${styles.circleContainer} flex`}>
              {station.lineId.map((id) => (
                <div key={id} className={`${styles.circle} ${id}`} />
              ))}
            </div>
            {station.name}
          </li>
        ))}
      </ul>
      <button
        className={`fs-24 notoBold flex align-center justify-center  ${styles.btn}`}
        type="button"
      >
        맛집 추천받기
      </button>
    </div>
  );
};

export default LineSelectedBar;
