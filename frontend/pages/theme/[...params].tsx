import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ResultCard from "../../components/theme/ResultCard";
import styles from "./result.module.scss";
import Loading from "../../components/layouts/Loading";
import { indexRes, themeRecommend } from "../api/recommend";
import { storeDataType } from "../../constants/storeData";
import { searchByName } from "../../constants/lineData";
import prevBtn from "../../public/icons/prev.svg";
import nextBtn from "../../public/icons/prev.svg";
import { rootCertificates } from "tls";

const Result = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [choices, storeIndex]: any = router.query.params || [];
  const [foodList, setFoodList] = useState([]);
  const [storeList, setStoreList] = useState<string[]>([]);

  // ==============================
  // carosel
  const TOTAL_SLIDES = 4; // 전체 슬라이드의 개수 0-4번 인덱스 총 5개
  const [currentSlide, setCurrentSlide] = useState<number>(0); // 현재 보여주고 있는 슬라이드
  const slideRef = useRef<HTMLDivElement>(null);
  const nextSlide = () => {
    if (currentSlide >= 2) {
      setCurrentSlide(-2);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };
  const prevSlide = () => {
    if (currentSlide === -2) {
      setCurrentSlide(2);
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (slideRef.current) {
      console.log(currentSlide + "aaaa");
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      if (currentSlide < 0) {
        slideRef.current.style.transform = `translateX(${-currentSlide}00%)`;
      } else {
        slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
      }
    }
  }, [currentSlide]);

  // ===============================
  // 제일 처음 실행
  useEffect(() => {
    setIsLoading(true);
    // 즉시 실행 함수
    (async function () {
      //  api 호출
      const res = await indexRes(storeIndex);
      setFoodList(res);
    })();

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [storeIndex]);

  // useEffect(() => {
  //   // 정규 표현식
  //   const numTest = /^[0-1]{5}$/;

  //   if (numTest.test(choices) === false) {
  //     router.push("/404");
  //   }
  //   if (router.query.params?.length !== 2) {
  //     router.push("/404");
  //   }
  // }, []);
  const again = () => {
    // api 재호출
    setIsLoading(true);

    (async function () {
      const res = await themeRecommend(choices);
      console.log(res);
      setStoreList(res);
      const index = res.join();
      router.push(`/theme/${choices}/${index}`);
      // setIsFinished(true);
    })();
  };

  return (
    <div className={`${styles.result} flex justify-center`}>
      <div
        className={`${styles.contents} flex column align-center justify-center`}
      >
        {!isLoading && foodList && (
          <div className="flex column align-center justify-center">
            <div className={`${styles.title} fs-24 coreBold`}>오늘 당신은</div>
            <div className="flex justify-center align-center">
              <button
                type="button"
                className={`${styles.arrowPrevButton} flex align-center justify-center`}
                onClick={() => prevSlide()}
                // style={
                //   currentSlide === 0 ? { opacity: 0 } : { opacity: "100%" }
                // }
              >
                <Image src={prevBtn} alt="prev" className={styles.icon} />
              </button>
              <div
                className={`${styles.container} flex align-center justify-center`}
              >
                <div ref={slideRef} className="flex">
                  {foodList.map(
                    ({
                      id,
                      mainImageURL,
                      menuImageUrl,
                      menuList,
                      name,
                      rating,
                      searchKeyword,
                      storUrl,
                      storeIdx,
                      역명
                    }: storeDataType) => (
                      <ResultCard
                        key={id}
                        id={id}
                        mainImageURL={mainImageURL}
                        menuImageUrl={menuImageUrl}
                        menuList={menuList}
                        name={name}
                        rating={rating}
                        searchKeyword={searchKeyword}
                        storUrl={storUrl}
                        storeIdx={storeIdx}
                        역명={역명}
                        lineId={searchByName(역명)[0].lines[0].id}
                      />
                    )
                  )}
                </div>
              </div>
              <button
                type="button"
                className={`${styles.arrowNextButton} flex align-center justify-center`}
                onClick={() => nextSlide()}
                // style={
                //   currentSlide === 4 ? { opacity: 0 } : { opacity: "100%" }
                // }
              >
                <Image alt="next" src={prevBtn} className={styles.icon} />
              </button>
            </div>

            <div className={`${styles.btns} flex`}>
              <button
                onClick={() => {
                  again();
                }}
                type="button"
                className={`${styles.btn} notoBold `}
              >
                다른 메뉴 추천 받기
              </button>
              <button
                onClick={() => {
                  router.push("/");
                }}
                type="button"
                className={`${styles.btn} notoBold `}
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}
        {isLoading && <Loading />}
      </div>
    </div>
  );
};

export default Result;
