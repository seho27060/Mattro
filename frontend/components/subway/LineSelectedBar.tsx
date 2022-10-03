/* eslint-disable import/no-cycle */
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SelectedStationType } from "../../pages/subway";
import styles from "./LineSelectedBar.module.scss";
import { recommandIndexByStation } from "../../pages/api/recommend";

type LineSelectedBarProps = {
  selectedStations: SelectedStationType[];
  removeFromSelectedStations: (statation: SelectedStationType) => void;
};

const LineSelectedBar = ({
  selectedStations,
  removeFromSelectedStations
}: LineSelectedBarProps) => {
  const router = useRouter();
  const emptyRef = useRef<HTMLDivElement>(null);

  const recommendPlace = async () => {
    const randomInd = Math.floor(Math.random() * selectedStations.length);
    const { name, lineId, stationId } = selectedStations[randomInd];
    const storeIndex = await recommandIndexByStation(name);
    router.push(`/subway/${lineId[0]}/${stationId}/${storeIndex || "null"}`);
  };

  useEffect(() => {
    if (emptyRef.current) {
      emptyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedStations]);
  return (
    <div id="lineSelectedBar" className="flex align-center">
      <ul className={`flex ${styles.stations} align-center`}>
        {selectedStations.map((station) => (
          <li key={station.name}>
            <button
              type="button"
              className={`notoBold flex column align-center justify-center ${styles.station}`}
              onClick={() => removeFromSelectedStations(station)}
            >
              <div className={`${styles.circleContainer} flex`}>
                {station.lineId.map((id) => (
                  <div key={id} className={`${styles.circle} ${id}`} />
                ))}
              </div>
              {station.name}
            </button>
          </li>
        ))}
        <div ref={emptyRef} />
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
