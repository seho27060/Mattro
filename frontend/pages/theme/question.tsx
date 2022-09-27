/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./question.module.scss";
import QuestionCard from "../../components/theme/QuestionCard";
import Stepbar from "../../components/theme/Stepbar";

const question = () => {
  const [start, setStart] = useState<number>(0);
  const router = useRouter();

  const moveLoading = () => {
    router.push("/theme/loading");
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
            <QuestionCard start={start} moveNext={moveNext} />
            <Stepbar duration={start} />
          </>
        )}
      </div>
    </div>
  );
};

export default question;
