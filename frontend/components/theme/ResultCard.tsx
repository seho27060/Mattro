import Image from "next/image";
import styles from "./ResultCard.module.scss";
import temp from "../../public/images/foodTemp.jpeg";
import star from "../../public/images/star.png";
import kakao from "../../public/images/kakao.svg";

export default function ResultCard() {
  const storeName = "동대문 엽기 떡볶이";
  const address = "경기도 용인시 기흥구 탑실로 111-1111ssssss";
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

  const shareKakao = () => {
    console.log("kakao");
  };

  return (
    <div className={`${styles.card} flex column align-center justify-center`}>
      <div className={`${styles.num} coreExtra fs-24`}>1</div>
      <div className="coreBold fs-30">{storeName}</div>
      <div className={`${styles.img} flex align-center justify-center`}>
        <Image src={temp} alt="food" className={styles.sub} />
      </div>
      <div className={styles.stars}>
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        <Image src={star} alt="star" className={styles.star} />
        {/* {stars()} */}
      </div>
      <div className={`${styles.detail} flex column justify-center`}>
        <div className={`${styles.txt} flex fs-18 notoMid`}>
          <span>주소</span>
          <span>{address}</span>
        </div>
        <div className={`${styles.txt} flex fs-18 notoMid`}>
          <span>대표 메뉴</span>
          <span>{menu}</span>
        </div>
        <div className={`${styles.txt} flex fs-18 notoMid`}>
          <span>영업 시간</span>
          <span>{time}</span>
        </div>
        <div className={`${styles.txt} flex fs-18 notoMid`}>
          <span>가까운 역</span>
          <span>{nearStation}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={shareKakao}
        className="flex notoBold fs-20 align-center justify-center"
      >
        <Image src={kakao} alt="kakao" />
        <p>카카오톡 공유하기</p>
      </button>
    </div>
  );
}
