import Image from "next/image";
import { useEffect } from "react";
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

  // 카카오톡 공유하기 기능
  const shareKakao = () => {
    const { Kakao, location } = window;

    if (!window.Kakao.isInitialized()) {
      // 공유하기 기능을 위해 initialize 마운트 될때 적용
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }

    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "[역삼역]우영우 김밥",
        description: "테스트 입니당",
        imageUrl: "https://picsum.photos/200/300",
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href
        }
      }
    });
  };

  return (
    <div className={`${styles.card} flex column align-center justify-center`}>
      <div className={`${styles.num} coreExtra fs-18 flex align-center`}>
        <p>1</p>
        <div className="coreBold fs-24 flex ">{storeName}</div>
      </div>

      <div className={`${styles.img} flex align-center justify-center`}>
        <Image src={temp} alt="food" className={styles.sub} />
      </div>
      <div className={styles.stars}>
        <span>
          <Image src={star} alt="star" className={styles.star} />
        </span>
        <span>
          <Image src={star} alt="star" className={styles.star} />
        </span>
        <span>
          <Image src={star} alt="star" className={styles.star} />
        </span>
        <span>
          <Image src={star} alt="star" className={styles.star} />
        </span>
        <span>
          <Image src={star} alt="star" className={styles.star} />
        </span>

        {/* {stars()} */}
      </div>
      <div className={`${styles.detail} flex column justify-center`}>
        <div className={`${styles.txt} flex  notoMid`}>
          <span>주소</span>
          <span>{address}</span>
        </div>
        <div className={`${styles.txt} flex fs-15 notoMid`}>
          <span>대표 메뉴</span>
          <span>{menu}</span>
        </div>
        <div className={`${styles.txt} flex fs-15 notoMid`}>
          <span>영업 시간</span>
          <span>{time}</span>
        </div>
        <div className={`${styles.txt} flex fs-15 notoMid`}>
          <span>가까운 역</span>
          <span>{nearStation}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={shareKakao}
        className="flex notoBold align-center justify-center"
      >
        <div className="flex align-center justify-center">
          <Image src={kakao} alt="kakao" className={styles.icon} />
        </div>
        <p className={styles.btn_txt}>카카오톡 공유하기</p>
      </button>
    </div>
  );
}
