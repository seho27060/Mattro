import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import LineLoadingBar from "../../components/subway/LineLoadingBar";
import ResultCard from "../../components/theme/ResultCard";
import styles from "./result.module.scss";
import { UsedLineIdType } from "../../constants/lineType";
import { getLoadingData } from "../../constants/lineData";
import { recommandByStoreIndex } from "../api/recommend";
import { storeDataType } from "../../constants/storeData";

type ResultType = {
  loadingBarData: string[];
  lineId: UsedLineIdType;
  placeInd: string;
};

const Result = ({ loadingBarData, lineId, placeInd }: ResultType) => {
  const [storeData, setStoreData] = useState<storeDataType | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (placeInd !== "null") {
      (async () => {
        const res = await recommandByStoreIndex(placeInd);
        const {
          id,
          mainImageURL,
          menuImageUrl,
          menuList,
          name,
          rating,
          searchKeyword,
          storUrl,
          storeIdx,
          역명
        } = res;
        setStoreData({
          id,
          mainImageURL,
          menuImageUrl,
          menuList,
          name,
          rating,
          searchKeyword,
          storUrl,
          storeIdx,
          역명
        });
      })();
    }
  }, []);
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
        {storeData && (
          <ResultCard
            id={storeData.id}
            mainImageURL={storeData.mainImageURL}
            menuImageUrl={storeData.menuImageUrl}
            menuList={storeData.menuList}
            name={storeData.name}
            rating={storeData.rating}
            searchKeyword={storeData.searchKeyword}
            storUrl={storeData.storUrl}
            storeIdx={storeData.storeIdx}
            역명={storeData.역명}
            lineId={lineId}
          />
        )}
        {!storeData && (
          <div className={`${styles.noData} notoBold fs-40`}>
            해당 역에 추천 맛집이 없어요!
          </div>
        )}
        <button
          className={`${styles.button} ${lineId} notoBold fs-24`}
          type="button"
          onClick={() => router.push("/subway")}
        >
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
