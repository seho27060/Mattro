import React, {
  useEffect,
  useState,
  Dispatch,
  useRef,
  SetStateAction
} from "react";
import styles from "./QuestionCard.module.scss";
// import Stepbar from "./Stepbar";

type QuestionType = {
  start: number;
  moveNext: any;
  choices: string;
  setChoices: (chioce: string) => void;
  // setChoices: Dispatch<SetStateAction<string>>;
};

export default function QuestionCard({
  start,
  moveNext,
  choices,
  setChoices
}: QuestionType) {
  const aniRef = useRef<any>();
  const [quesList, setQuesList] = useState([
    { num: 0, question: "같이 갈 일행이 있나요?" },
    { num: 1, question: "자차로 방문하나요?" },
    { num: 2, question: "오늘은 특별한 날인가요?" },
    { num: 3, question: "한식 좋아하시나요?" },
    { num: 4, question: "육류 좋아하시나요?" }
  ]);

  const moveLeft = () => {
    if (aniRef.current.classList.contains(styles.ani)) {
      aniRef.current.classList.remove(styles.ani);
    }
    setTimeout(function () {
      aniRef.current.classList.add(styles.ani);
    }, 0);
  };

  useEffect(() => {
    // 처음 액션
    moveLeft();
  }, []);

  const clickAns = (answer: string) => {
    setChoices(choices + answer);
    moveNext(start);
    // setTimeout(() => {
    if (start < 4) moveLeft();
    // }, 0);
  };

  return (
    <div className={`${styles.card} flex`}>
      <div ref={aniRef} className={`${styles.container} flex column`}>
        <div className={`${styles.title} coreExtra`}>
          Q{quesList[start].num + 1}.
        </div>
        <div className={`${styles.ques} coreExtra fs-40`}>
          {quesList[start].question}
        </div>
        <div className={styles.select}>
          <button
            type="button"
            onClick={() => clickAns("1")}
            className="fs-32 notoBold flex align-center"
          >
            네
          </button>
          <button
            type="button"
            onClick={() => clickAns("0")}
            className="fs-32 notoBold flex align-center"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
