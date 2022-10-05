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

const Result = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [choices, storeIndex]: any = router.query.params || [];
  const [foodList, setFoodList] = useState([]);
  // const [storeList, setStoreList] = useState<string[]>([]);

  // ==============================
  // carosel
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

  // 슬라이드 바뀔때마다 애니메이션
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      if (currentSlide < 0) {
        slideRef.current.style.transform = `translateX(${-currentSlide * 20}%)`;
      } else {
        slideRef.current.style.transform = `translateX(-${currentSlide * 20}%)`;
      }
    }
  }, [currentSlide]);

  // ===============================
  // 제일 처음 실행
  useEffect(() => {
    setIsLoading(true);
    if (storeIndex !== undefined) {
      // 즉시 실행 함수
      (async function () {
        //  api 호출
        const res = await indexRes(storeIndex);
        setFoodList(res);
      })();
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [storeIndex]);

  // url 확인
  // useEffect(() => {
  //   // 정규 표현식
  //   const numTest = /^[0-1]{5}$/;

  //   if (choices !== undefined) {
  //     if (numTest.test(choices) === false) {
  //       router.push("/404");
  //     }
  //     if (router.query.params?.length !== 2) {
  //       router.push("/404");
  //     }
  //   }
  // }, []);

  const again = () => {
    // api 재호출
    setIsLoading(true);
    (async function () {
      const res = await themeRecommend(choices);
      const index = res.join(",");
      router.push(`/theme/${choices}/${index}`);
    })();
  };

  return (
    <div className={`${styles.result} flex justify-center align-center`}>
      <div
        className={`${styles.contents} flex column align-center justify-center`}
      >
        {!isLoading && foodList && (
          <div className="flex column align-center justify-center">
            <div className={`${styles.title} coreBold`}>오늘의 추천 메뉴는</div>
            <div className="flex justify-center align-center">
              <div
                className={`${styles.container} flex align-center justify-center`}
                ref={slideRef}
              >
                {foodList.map(
                  ({
                    id,
                    mainImageURL,
                    menuImageUrl,
                    menuList,
                    name,
                    rating,
                    searchKeyword,
                    storURL,
                    storeIdx,
                    역명
                  }: storeDataType) => (
                    <div className={`${styles.ref} flex align-center`} key={id}>
                      <button
                        type="button"
                        className={`${styles.arrowPrevButton} flex align-center justify-center`}
                        onClick={() => prevSlide()}
                        // style={
                        //   currentSlide === 0 ? { opacity: 0 } : { opacity: "100%" }
                        // }
                      >
                        <Image
                          src={prevBtn}
                          alt="prev"
                          className={styles.icon}
                        />
                      </button>
                      <ResultCard
                        // key={storURL}
                        id={id}
                        mainImageURL={mainImageURL}
                        menuImageUrl={menuImageUrl}
                        menuList={menuList}
                        name={name}
                        rating={rating}
                        searchKeyword={searchKeyword}
                        storURL={storURL}
                        storeIdx={storeIdx}
                        역명={역명}
                        lineId={searchByName(역명)[0].lines[0].id}
                      />
                      <button
                        type="button"
                        className={`${styles.arrowNextButton} flex align-center justify-center`}
                        onClick={() => nextSlide()}
                        // style={
                        //   currentSlide === 4 ? { opacity: 0 } : { opacity: "100%" }
                        // }
                      >
                        <Image
                          alt="next"
                          src={prevBtn}
                          className={styles.icon}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
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
