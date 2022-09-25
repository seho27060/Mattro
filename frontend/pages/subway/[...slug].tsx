import React from "react";
import { GetServerSideProps } from "next";
import LineLoadingBar from "../../components/subway/LineLoadingBar";
import ResultCard from "../../components/theme/ResultCard";
import styles from "./result.module.scss";
import { UnusedLineIdType, UsedLineIdType } from "../../constants/lineType";
import { getLoadingData } from "../../constants/lineData";

type ResultType = {
  loadingBarData: string[];
  lineId: UnusedLineIdType;
  placeInd: string;
};

const Result = ({ loadingBarData, lineId, placeInd }: ResultType) => {
  return (
    <div className={`${styles.root} flex align-center justify-center`}>
      <div className={`${styles.wrapper} flex`}>
        {loadingBarData &&
          loadingBarData.map((data) => (
            <LineLoadingBar key={data} color={lineId} name={data} />
          ))}
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

export default Result;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [lineId, stationId, placeInd] = context.query.slug as [
    UsedLineIdType,
    string,
    string
  ];
  if (context.query.slug?.length !== 3) {
    return {
      notFound: true
    };
  }
  const loadingBarData = getLoadingData(lineId, stationId);
  return {
    props: {
      lineId,
      loadingBarData,
      placeInd
    }
  };
};
