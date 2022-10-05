import { useRouter } from "next/router";
import React from "react";
import styles from "./404page.module.scss";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className={`${styles.back} flex`}>
      <button
        type="button"
        className={`${styles.btn} flex align-center justify-center notoBold`}
        onClick={() => router.push("/")}
      >
        홈으로 이동하기
      </button>
    </div>
  );
};

export default NotFound;
