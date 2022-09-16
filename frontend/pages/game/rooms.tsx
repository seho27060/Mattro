import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "./rooms.module.scss";
import station from "../../public/images/station.png";
import chair1 from "../../public/images/chair1.png";

const roomList = [
  { id: 1, number: 0, title: "방 제목 111111111111" },
  { id: 2, number: 1, title: "방 제목 222" },
  { id: 3, number: 2, title: "방 제목 333" },
  { id: 4, number: 3, title: "방 제목 444" },
  { id: 5, number: 4, title: "방 제목 555" },
  { id: 6, number: 0, title: "방 제목 666" }
];

const Rooms: NextPage = () => {
  return (
    <div className={`${styles.wrapper} flex column align-center`}>
      <span className={styles.station}>
        <Image src={station} alt="station" />
      </span>
      <div className={styles.roomList}>
        {roomList.map((room) => (
          <Link href="/game/room/1" key={room.id}>
            <div className={`${styles.room} flex align-center`}>
              <p className="flex align-center fs-34 coreExtra">
                <span className="flex justify-center align-center fs-24 coreExtra">
                  {room.number}/4
                </span>
                {room.title.length > 10
                  ? `${room.title.slice(0, 10)}...`
                  : room.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.chair1}>
          <Image src={chair1} alt="chair1" />
        </span>
        <button className="fs-24 coreExtra" type="button">
          방 만들기
        </button>
      </div>
    </div>
  );
};

export default Rooms;
