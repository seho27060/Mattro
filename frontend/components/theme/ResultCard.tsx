import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  storURL,
  storeIdx,
  역명,
  lineId
}: ResultCardType) => {
  const router = useRouter();
  const [starView, setStarView] = useState<number>(0);

  const [address, setAddress] = useState<string>("");
  // 카카오톡 공유하기 기능
  const shareKakao = () => {
    let url = null;
    if (router.pathname === "/theme/[...params]") {
      const [choices, storeIndex]: any = router.query.params;
      // url 재정비, 현재 선택된 값을 2번째 요소에 집어넣기
      const list = storeIndex.split(",");
      const newList = list.filter(function (data: string) {
        return data !== storeIdx;
      });

      newList.splice(2, 0, storeIdx);
      const res = newList.join(",");
      url = `theme/${choices}/${res}`;
    } else {
      url = router.asPath;
    }

    const { Kakao, location } = window;

    // 공유하기 기능을 위해 initialize 마운트 될때 적용
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: name,
        description: address,
        imageUrl: mainImageURL !== null ? mainImageURL : menuImageUrl,
        link: {
          mobileWebUrl: `https://j7c206.p.ssafy.io/${url}`,
          webUrl: `https://j7c206.p.ssafy.io/${url}`
        }
      }
    });
  };

  useEffect(() => {
    // rating 계산
    const temp = rating.split("/").map(Number);
    setStarView(temp[0]);

    const str = searchKeyword.split(" ");
    str.shift();
    setAddress(str.join(" "));
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
        <Image key={name} className={styles.stars} alt="star" src={star_half} />
      );
    }
    star.push(
      <span
        key={rating}
        style={{ color: "#5a5a5a", margin: " 0 12px" }}
        className={`${styles.rating} notoMid`}
      >
        {starView}
      </span>
    );
    return star;
  };

  const moveMap = () => {
    if (storURL !== undefined) {
      window.open(storURL);
    } else {
      alert("이동할 수 있는 url이 없습니다");
    }
  };

  return (
    <div
      className={`${styles.card} ${lineId} flex column align-center justify-center`}
    >
      <div
        onClick={moveMap}
        className={`${styles.num} coreExtra fs-18 flex align-center`}
      >
        <p className={`${lineId} flex align-center justify-center`}>
          {lineNameById(lineId)}
        </p>
        <div className="coreBold fs-24 flex">{name}</div>
      </div>

      <div
        onClick={moveMap}
        className={`${styles.img} flex align-center justify-center`}
      >
        <Image
          src={mainImageURL || menuImageUrl || temp}
          alt="food"
          className={styles.sub}
          unoptimized
          width="250"
          height="200"
        />
      </div>
      <div className={`${styles.detail} flex column justify-center`}>
        <div className={`${styles.txt} flex  notoMid`}>
          <span>주소</span>
          <span>{address}</span>
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
