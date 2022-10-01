/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./question.module.scss";
import QuestionCard from "../../components/theme/QuestionCard";
import Stepbar from "../../components/theme/Stepbar";
import { themeRecommend } from "../api/recommend";
import { setMaxListeners } from "events";

const question = () => {
  const [start, setStart] = useState<number>(0);
  const router = useRouter();
  const [choices, setChoices] = useState<string>("");
  // const [storeList, setStoreList] = useState<CardPropsType[]>([]);
  const [storeList, setStoreList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const moveLoading = () => {
    // api 호출
    async function getList() {
      const res = await themeRecommend(choices);
      // storeIdx 5개 담기
      setStoreList(res); // indec 배열 담기
      // list의 배열 5개를 join해서 보내기
      const storeIndex = res.join();
      router.push(`/theme/${choices}/${storeIndex}`);
    }
    getList();
  };

  useEffect(() => {
    if (start >= 5) moveLoading();
  }, [start]);

  // eslint-disable-next-line no-shadow
  const moveNext = (start: number) => {
    setStart(start + 1);
  };

  return (
    <div className={`${styles.question} flex justify-center`}>
      <div className={`${styles.contents} flex column`}>
        {start < 5 && (
          <>
            <QuestionCard
              start={start}
              moveNext={moveNext}
              choices={choices}
              setChoices={setChoices}
            />
            <Stepbar duration={start} choices={choices} />
          </>
        )}
      </div>
    </div>
  );
};

export default question;
