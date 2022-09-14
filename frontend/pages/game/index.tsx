import type { NextPage } from "next";
import Link from "next/link";

import styles from "./index.module.scss";

const index: NextPage = () => {
  return (
    <div
      className={`${styles.wrapper} flex column justify-center align-center`}
    >
      <h1 className="fs-100">지하철 미니 게임</h1>
      <Link href="/game/rooms">
        <div className="fs-32 coreExtra flex justify-center align-center">
          start
        </div>
      </Link>
      <button
        className="fs-32 coreExtra flex justify-center align-center"
        type="button"
      >
        게임 설명
      </button>
    </div>
  );
};

export default index;
