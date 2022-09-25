/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import Image from "next/image";
import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import LineInfoList from "../../components/subway/LineCircleList";
import LineSearch from "../../components/subway/LineSearch";
import LineSelectedBar from "../../components/subway/LineSelectedBar";
import MetroMap from "../../components/subway/MetroMap";
import styles from "./subway.module.scss";
import PlusBtn from "../../public/icons/plus.svg";
import MinusBtn from "../../public/icons/minus.svg";
import lineInfos from "../../constants/lineInfo";
import { UsedLineIdType } from "../../constants/lineType";

type SelectedStationType = {
  name: string;
  cx: number;
  cy: number;
  lineId: UsedLineIdType | null;
  stationId: string;
};

const Index = () => {
  const [selectedLines, setSelectedLines] = useState<UsedLineIdType[]>(
    lineInfos.map((line) => line.id)
  );
  const [selectedStations, setSelectedStations] = useState<
    SelectedStationType[]
  >([]);
  const [selecting, setSelecting] = useState(true);
  const [stationInfo, setStationInfo] = useState<SelectedStationType>({
    cx: 0,
    cy: 0,
    name: "",
    lineId: null,
    stationId: ""
  });
  const [scaleSize, setScaleSize] = useState(1);
  const [searchId, setSearchId] = useState<string | null>(null);
  const router = useRouter();

  // 현재 선택된 라인
  const handleSelectedLines = (line: UsedLineIdType) => {
    const ind = selectedLines.indexOf(line);
    if (ind === -1) {
      setSelectedLines([...selectedLines, line]);
    } else {
      setSelectedLines(
        selectedLines.filter((selectedLine) => selectedLine !== line)
      );
    }
  };

  // 현재 선택된 라인 불투명조정
  const handleLineOpacity = (lineId: UsedLineIdType, opacity: 0.1 | 1) => {
    const lines = document.querySelectorAll<HTMLElement>(`.${lineId}`);
    lines.forEach((line) => {
      if (line.tagName !== "LI") {
        line.style.opacity = opacity.toString();
      }
    });
  };

  // id값으로 역이름 조회
  const findNameById = (lineID: UsedLineIdType) => {
    const text = document.querySelector(`.S${lineID}`);
    let name = "";
    text?.childNodes.forEach((node) => {
      name += (node as HTMLElement).innerHTML;
    });
    return name;
  };

  // 해당 라인 어딘지 추출
  const getLineIdByEle = (ele: Element): UsedLineIdType => {
    const lineData = ele.classList.value.match(/L[A-Z|1-9]{1,}/);
    if (lineData) {
      return lineData[0] as UsedLineIdType;
    }
    return "L1";
  };

  // 동그라미 토글
  const toggleCircle = (circle: SVGCircleElement) => {
    const { classList } = circle;
    const isSelected = classList.contains("isSelected");
    if (isSelected) {
      circle.classList.remove("isSelected");
    } else {
      circle.classList.add("isSelected");
    }
  };

  // 최종적으로 선택된역들
  const handleSelectedStations = () => {
    if (!stationInfo.name) return;
    // const ind = selectedStations.indexOf(stationInfo.name);
    let isInclude = false;
    selectedStations.forEach((station) => {
      if (JSON.stringify(station) === JSON.stringify(stationInfo)) {
        isInclude = true;
      }
    });
    if (!isInclude) {
      setSelectedStations((prev) => [...prev, stationInfo]);

      const newMarker = document.createElement("rect");
      newMarker.innerHTML = `
      <rect x="710" y="65" width="20" height="20">
      <path d="M28 0C12.52 0 0 12.52 0 28C0 34.96 2 41.48 5.64 47.36C9.44 53.52 14.44 58.8 18.28 64.96C20.16 67.96 21.52 70.76 22.96 74C24 76.2 24.84 80 28 80C31.16 80 32 76.2 33 74C34.48 70.76 35.8 67.96 37.68 64.96C41.52 58.84 46.52 53.56 50.32 47.36C54 41.48 56 34.96 56 28C56 12.52 43.48 0 28 0ZM28 39C22.48 39 18 34.52 18 29C18 23.48 22.48 19 28 19C33.52 19 38 23.48 38 29C38 34.52 33.52 39 28 39Z" fill="black"/>
      </rect>
      `;
      // newMarker.setAttribute("x", 710);
      // newMarker.setAttribute("y", 65);
      // newMarker.setAttribute("width", 20);
      // newMarker.setAttribute("height", 20);
      const markerGroup = document.querySelector(".selectedMarker");
      markerGroup?.appendChild(newMarker);
      console.log(newMarker, markerGroup);
    } else {
      setSelectedStations((prev) =>
        prev.filter(
          (station) => JSON.stringify(station) !== JSON.stringify(stationInfo)
        )
      );
    }
    setSelecting(false);
  };

  // 클릭 이벤트 핸들
  const clcikStation = (e: MouseEvent<SVGCircleElement | SVGTextElement>) => {
    let cx = 0;
    let cy = 0;
    let name = "";
    let lineId = null;
    let stationId = "";
    // 동그라미를 클릭했다면
    if (e.currentTarget.tagName === "circle") {
      const circle = e.currentTarget;

      // 환승역
      if (!circle.id) {
        const circleChilds = circle.parentElement?.childNodes;
        if (circleChilds) {
          circleChilds.forEach((cir, ind) => {
            if (ind !== 0) {
              cx += (cir as SVGCircleElement).cx.baseVal.value;
              cy += (cir as SVGCircleElement).cy.baseVal.value;
            }
          });
          cx /= circleChilds.length - 1;
          cy /= circleChilds.length - 1;
        }
        const id = e.currentTarget.parentElement?.classList.value
          .match(/M\d{4}/g)
          ?.map((id_) => id_.replace("M", ""))[0];
        if (id) {
          name = findNameById(id as UsedLineIdType);
          stationId = id;

          lineId = getLineIdByEle(e.currentTarget.parentElement as Element);
        }
        // 환승역이 아니면
      } else {
        toggleCircle(circle as SVGCircleElement);
        cx = (circle as SVGCircleElement).cx.baseVal.value;
        cy = (circle as SVGCircleElement).cy.baseVal.value;
        name = findNameById(
          e.currentTarget.id.replace("M", "") as UsedLineIdType
        );
        stationId = e.currentTarget.id.replace("M", "");
        lineId = getLineIdByEle(e.currentTarget);
      }
    } else if (e.currentTarget.tagName === "text") {
      const circleIds = e.currentTarget.classList.value
        .match(/S\d{4}/g)
        ?.map((id) => id.replace("S", ""));
      if (!circleIds) {
        return;
      }

      if (circleIds.length === 1) {
        const circle = document.querySelector(
          `.M${circleIds[0]}`
        ) as SVGCircleElement;
        toggleCircle(circle);
        cx = circle.cx.baseVal.value;
        cy = circle.cy.baseVal.value;
      } else {
        const circleChilds = document.querySelector(
          `.M${circleIds[0]}`
        )?.childNodes;
        if (circleChilds) {
          circleChilds.forEach((circle, ind) => {
            if (ind !== 0) {
              cx += (circle as SVGCircleElement).cx.baseVal.value;
              cy += (circle as SVGCircleElement).cy.baseVal.value;
            }
          });
          cx /= circleChilds.length - 1;
          cy /= circleChilds.length - 1;
        }
      }
      stationId = circleIds[0];
      name = findNameById(circleIds[0] as UsedLineIdType);
      lineId = getLineIdByEle(e.currentTarget);
    }
    setStationInfo({ cx, cy, name, lineId, stationId });
    setSelecting(false);
  };

  const recommendPlace = () => {
    const randomInd = Math.floor(Math.random() * selectedStations.length);
    const { lineId, stationId } = selectedStations[randomInd];
    router.push(`/subway/${lineId}/${stationId}/1`);
  };

  useEffect(() => {
    const circles = document.querySelectorAll("circle");
    const texts = document.querySelectorAll("text");
    circles.forEach((circle) =>
      circle.addEventListener("click", (e) => clcikStation(e as any))
    );
    texts.forEach((text) =>
      text.addEventListener("click", (e) => clcikStation(e as any))
    );
  }, []);

  useEffect(() => {
    const unSelectedLines = lineInfos
      .map((line) => line.id)
      .filter(
        (lineId: UsedLineIdType) =>
          selectedLines.findIndex((item) => item === lineId) === -1
      );
    unSelectedLines.map((line) => handleLineOpacity(line, 0.1));
    selectedLines.map((line) => handleLineOpacity(line, 1));
  }, [selectedLines]);

  useEffect(() => {
    console.log(selectedStations);
  }, [selectedStations]);

  useEffect(() => {
    if (selecting) handleSelectedStations();
    // setStationInfo({ cx: 0, cy: 0, name: "" });
    setSelecting(true);
  }, [selecting]);

  return (
    <div className={styles.subway}>
      <MetroMap scaleSize={scaleSize} searchId={searchId} />
      <div id="line-container" className="flex">
        <LineInfoList togggleSelectedLines={handleSelectedLines} />
        <LineSearch
          setSearchId={setSearchId}
          setScaleSize={setScaleSize}
          setSelectedLines={setSelectedLines}
        />
      </div>
      <div id="map-btn" className="flex column">
        <button
          type="button"
          onClick={() => setScaleSize((prev) => (prev >= 4 ? 4 : prev + 1))}
        >
          <Image src={PlusBtn} layout="responsive" alt="확대" />
        </button>
        <button
          type="button"
          onClick={() => setScaleSize((prev) => (prev <= 1 ? 1 : prev - 1))}
        >
          <Image src={MinusBtn} layout="responsive" alt="축소" />
        </button>
      </div>
      <div id="select-container" className="flex justify-center">
        {selectedStations.length !== 0 && (
          <button
            className={`fs-30 notoBold flex align-center justify-center  ${styles.btn}`}
            type="button"
            onClick={recommendPlace}
          >
            맛집 추천받기
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;
