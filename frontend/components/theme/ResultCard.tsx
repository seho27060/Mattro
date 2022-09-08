import Image from "next/image";
import styles from "./ResultCard.module.scss";
import temp from "../../public/images/foodTemp.jpeg";
import star from "../../public/images/star.png";

export default function ResultCard() {
  const storeName = "동대문 엽기 떡볶이";
  const address = "경기도 용인시 기흥구 탑실로 111-1111";
  const time = "오전 11시 ~ 오후 09시";
  const menu = "엽떡 오리지널 + 주먹밥";
  const nearStation = "역삼역";

  //   function stars() {
  //     const starArray = [];
  //     for (const i = 0; i < 5; i + 1) {
  //       starArray.push(<Image src={star} alt="star" />);
  //     }
  //     return starArray;
  //   }

  return (
    <div className={`${styles.card} flex column align-center`}>
      {/* <div className={styles.contents}> */}
      <div className={`${styles.num} coreExtra fs-24`}>1</div>
      <div className="coreBold fs-30">{storeName}</div>
      <div className={`${styles.img} flex align-center justify-center`}>
        <Image src={temp} alt="food" />
      </div>
      <div className={styles.stars}>
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        {/* {stars()} */}
      </div>
      <div className={`${styles.detail} flex column`}>
        <div className={`${styles.txt} flex fs-16 coreMid`}>
          <p>주소</p>
          <p>{address}</p>
        </div>
        <div className={`${styles.txt} flex fs-16 coreMid`}>
          <p>대표 메뉴</p>
          <p>{menu}</p>
        </div>
        <div className={`${styles.txt} flex fs-16 coreMid`}>
          <p>영업 시간</p>
          <p>{time}</p>
        </div>
        <div className={`${styles.txt} flex fs-16 coreMid`}>
          <p>가까운 역</p>
          <p>{nearStation}</p>
        </div>
      </div>
    </div>
    // </div>
  );
}
