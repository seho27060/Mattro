import Image from "next/image";
import React from "react";
import LineInfoList from "../../components/subway/LineCircleList";
import LineSearch from "../../components/subway/LineSearch";
import LineSelectedBar from "../../components/subway/LineSelectedBar";
import MetroMap from "../../components/subway/MetroMap";
import styles from "./subway.module.scss";
import PlusBtn from "../../public/icons/plus.svg";
import MinusBtn from "../../public/icons/minus.svg";

const index = () => {
  return (
    <div className={styles.subway}>
      <MetroMap />
      <div id="line-container" className="flex">
        <LineInfoList />
        <LineSearch />
      </div>
      <div id="map-btn" className="flex column">
        <button type="button">
          <Image src={PlusBtn} alt="확대" />
        </button>
        <button type="button">
          <Image src={MinusBtn} alt="축소" />
        </button>
      </div>
      <div id="select-container" className="flex justify-center">
        <LineSelectedBar />
      </div>
    </div>
  );
};

export default index;
