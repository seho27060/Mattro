/* eslint-disable import/no-cycle */
import React from "react";
import { useRouter } from "next/router";
import { SelectedStationType } from "../../pages/subway";
import styles from "./LineSelectedBar.module.scss";

type LineSelectedBarProps = {
  selectedStations: SelectedStationType[];
};

const LineSelectedBar = ({ selectedStations }: LineSelectedBarProps) => {
  const router = useRouter();

  const recommendPlace = () => {
    const randomInd = Math.floor(Math.random() * selectedStations.length);
    const { lineId, stationId } = selectedStations[randomInd];
    router.push(`/subway/${lineId}/${stationId}/1`);
  };

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
        onClick={recommendPlace}
      >
        맛집 추천받기
      </button>
    </div>
  );
};

export default LineSelectedBar;
