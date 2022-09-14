import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./main.module.scss";
import title from "../../public/images/theme_title.png";
import char from "../../public/images/gaonasi.png";
import chair1 from "../../public/images/chair_red.png";
import chair2 from "../../public/images/chair_two.png";

export default function themeMain() {
  return (
    <div className={`${styles.theme} flex justify-center`}>
      <div className={`${styles.contents} flex column align-center`}>
        <div className={styles.title}>
          <Image src={title} alt="title" />
        </div>
        <p className="coreBold fs-36"> 오늘 끌리는 맛집은 어디?</p>
        <div className={`${styles.images} flex`}>
          <div>
            <Image src={chair2} alt="char" className="" />
          </div>
          <div>
            <Image src={char} alt="char" className="" />
          </div>
          <div>
            <Image src={chair1} alt="char" className="" />
          </div>
        </div>
        <nav className="flex justify-center">
          <Link href="/theme/question">
            <div className={`${styles.btn} fs-32 coreExtra`}>
              테마별 맛집 추천받기
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}

// export default themeMain;
