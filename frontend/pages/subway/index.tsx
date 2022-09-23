/* eslint-disable no-param-reassign */
import Image from "next/image";
import { useEffect, useState, MouseEvent } from "react";
import LineInfoList from "../../components/subway/LineCircleList";
import LineSearch from "../../components/subway/LineSearch";
import LineSelectedBar from "../../components/subway/LineSelectedBar";
import MetroMap from "../../components/subway/MetroMap";
import styles from "./subway.module.scss";
import PlusBtn from "../../public/icons/plus.svg";
import MinusBtn from "../../public/icons/minus.svg";
import lineInfos from "../../constants/lineInfo";
import { UsedLineIdType } from "../../constants/lineType";

const Index = () => {
  const [selectedLines, setSelectedLines] = useState<UsedLineIdType[]>(
    lineInfos.map((line) => line.id)
  );
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(true);
  const [stationInfo, setStationInfo] = useState({ cx: 0, cy: 0, name: "" });
  const [scaleSize, setScaleSize] = useState(1);
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

  const handleLineOpacity = (lineId: UsedLineIdType, opacity: 0.1 | 1) => {
    const lines = document.querySelectorAll<HTMLElement>(`.${lineId}`);
    lines.forEach((line) => {
      if (line.tagName !== "LI") {
        line.style.opacity = opacity.toString();
      }
    });
  };

  const findNameById = (lineID: UsedLineIdType) => {
    const text = document.querySelector(`.S${lineID}`);
    let name = "";
    text?.childNodes.forEach((node) => {
      name += (node as HTMLElement).innerHTML;
    });
    return name;
    // return (text?.childNodes[0] as HTMLElement).innerHTML;
  };
  const toggleCircle = (circle: SVGCircleElement) => {
    const { classList } = circle;
    const isSelected = classList.contains("isSelected");
    if (isSelected) {
      circle.classList.remove("isSelected");
    } else {
      circle.classList.add("isSelected");
    }
  };

  const handleSelectedStations = () => {
    if (!stationInfo.name) return;
    const ind = selectedStations.indexOf(stationInfo.name);
    if (ind === -1) {
      setSelectedStations((prev) => [...prev, stationInfo.name]);
    } else {
      setSelectedStations((prev) =>
        prev.filter((station) => station !== stationInfo.name)
      );
    }
  };

  const clcikStation = (e: MouseEvent<SVGCircleElement | SVGTextElement>) => {
    let cx = 0;
    let cy = 0;
    let name = "";

    if (e.currentTarget.tagName === "circle") {
      const circle = e.currentTarget;
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
        if (id) name = findNameById(id as UsedLineIdType);
      } else {
        toggleCircle(circle as SVGCircleElement);
        cx = (circle as SVGCircleElement).cx.baseVal.value;
        cy = (circle as SVGCircleElement).cy.baseVal.value;
        name = findNameById(
          e.currentTarget.id.replace("M", "") as UsedLineIdType
        );
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

      name = findNameById(circleIds[0] as UsedLineIdType);
    }
    setStationInfo({ cx, cy, name });
    setSelecting(false);
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
      <MetroMap scaleSize={scaleSize} />
      <div id="line-container" className="flex">
        <LineInfoList togggleSelectedLines={handleSelectedLines} />
        <LineSearch />
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
        {/* <LineSelectedBar selectedStation={selectedStations} /> */}
      </div>
    </div>
  );
};

export default Index;
