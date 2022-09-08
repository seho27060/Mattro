import React from "react";
import Link from "next/link";
import styles from "./main.module.scss";

export default function themeMain() {
  return (
    <div className={`${styles.theme} flex justify-center`}>
      <div className={`${styles.contents} flex column`}>
        <nav>
          <Link href="/">
            <a className={`${styles.btn} fs-32 coreExtra`}>
              테마별 맛집 추천받기
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
}

// export default themeMain;
