import type { NextPage } from "next";
import styles from "./index.module.scss";

const Home: NextPage = () => {
  return (
    <div className={`${styles.home}`}>
      <div className={`${styles.contents} flex column align-center`}>
        <div className={`${styles.subtitle} fs-50 coreExtra`}>
          지하철 노선별 맛집 추천
          <div />
        </div>
        <div className={`${styles.title} fs-100 coreHeavy`}>맛트로</div>
        <button type="button" className={`${styles.btn} fs-40 coreExtra`}>
          START
        </button>
      </div>
    </div>
  );
};

export default Home;
