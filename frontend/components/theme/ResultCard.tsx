import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./ResultCard.module.scss";
import temp from "../../public/images/foodTemp.jpeg";
import star_all from "../../public/images/star.png";
import star_half from "../../public/images/half_star.png";
import kakao from "../../public/images/kakao.svg";
import { storeDataType } from "../../constants/storeData";
import { lineNameById } from "../../constants/lineInfo";
import { UsedLineIdType } from "../../constants/lineType";

type ResultCardType = storeDataType & { lineId: UsedLineIdType };

const ResultCard = ({
  id,
  mainImageURL,
  menuImageUrl,
  menuList,
  name,
  rating,
  searchKeyword,
  storUrl,
  storeIdx,
  역명,
  lineId
}: ResultCardType) => {
  const [starView, setStarView] = useState<number>(0);
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
        title: name,
        description: searchKeyword,
        imageUrl: mainImageURL !== null ? mainImageURL : menuImageUrl,
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href
        }
      }
    });
  };
  useEffect(() => {
    // rating 계산
    const temp = rating.split("/").map(Number);
    setStarView(temp[0]);
  }, []);

  const repeatStar = () => {
    const star = [];
    for (let i = 1; i <= starView; i++) {
      star.push(
        <Image key={i} className={styles.stars} alt="star" src={star_all} />
      );
    }
    if (starView % 1 >= 0.5) {
      star.push(
        <Image
          key={"half"}
          className={styles.stars}
          alt="star"
          src={star_half}
        />
      );
    }
    star.push(
      <span
        style={{ color: "#5a5a5a", margin: " 0 12px" }}
        className="notoMid fs-16"
      >
        {starView}
      </span>
    );
    return star;
  };

  return (
    <div
      className={`${styles.card} ${lineId} flex column align-center justify-center`}
    >
      <div className={`${styles.num} coreExtra fs-18 flex align-center`}>
        <p className={lineId}>{lineNameById(lineId)}</p>
        <div className="coreBold fs-24 flex ">{name}</div>
      </div>

      <div className={`${styles.img} flex align-center justify-center`}>
        <Image
          src={mainImageURL || menuImageUrl || temp}
          alt="food"
          className={styles.sub}
          unoptimized
          width="400px"
          height="300px"
        />
      </div>
      <div className={`${styles.detail} flex column justify-center`}>
        <div className={`${styles.txt} flex  notoMid`}>
          <span>주소</span>
          <span>{searchKeyword}</span>
        </div>
        <div className={`${styles.txt} flex fs-15 notoMid`}>
          <span>대표 메뉴</span>
          <span>{menuList[0]}</span>
        </div>
        <div className={`${styles.txt} flex fs-15 notoMid`}>
          <span>가까운 역</span>
          <span>{역명}역</span>
        </div>
        <div className={`${styles.txt} flex fs-15 notoMid`}>
          <span>별점</span>
          <span className={`${styles.starBox} flex align-center`}>
            {repeatStar()}
          </span>
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
};
export default ResultCard;
