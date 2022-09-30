import React from "react";
import styles from "./question.module.scss";
import QuestionCard from "../../components/theme/QuestionCard";
import Stepbar from "../../components/theme/Stepbar";

export default function question() {
  return (
    <div className={`${styles.question} flex justify-center`}>
      <div className={`${styles.contents} flex column`}>
        <QuestionCard />
        <Stepbar />
      </div>
    </div>
  );
}
