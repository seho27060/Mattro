import React from "react";
import LineLoadingBar from "../../components/subway/LineLoadingBar";
import ResultCard from "../../components/theme/ResultCard";
import styles from "./result.module.scss";

const result = () => {
  return (
    <div className={`${styles.root} flex align-center justify-center`}>
      <div className={`${styles.wrapper} flex`}>
        <LineLoadingBar color="LS" name="강남1" />
        <LineLoadingBar color="LS" name="강남" />
        <LineLoadingBar color="LS" name="양재" />
        <LineLoadingBar color="LS" name="양재시민의 숲" />
        <LineLoadingBar color="LS" name="청계산입구" />
        <LineLoadingBar color="LS" name="판교" />
      </div>
      <div className={styles.dimmer} />
      <div className={`${styles.card} flex column align-center`}>
        <ResultCard />
        <button className="notoBold fs-24" type="button">
          다시시작하기
        </button>
      </div>
    </div>
  );
};

export default result;
