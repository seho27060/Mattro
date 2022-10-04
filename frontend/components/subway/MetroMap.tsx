/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unknown-property */
import React, {
  useEffect,
  useRef,
  useState,
  MouseEvent,
  TouchEvent
} from "react";
import styles from "./MetroMap.module.scss";

type MetroMapProps = {
  prevScale: number;
  scaleSize: number;
  searchId: string | null;
};
const MetroMap = ({ scaleSize, searchId, prevScale }: MetroMapProps) => {
  const wrraperRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const movePosition = (posX: number, posY: number) => {
    if (wrraperRef.current) {
      wrraperRef.current.style.left = `${
        (wrraperRef.current.style.left.replace("px", "") as unknown as number) -
        posX
      }px`;
      wrraperRef.current.style.top = `${
        (wrraperRef.current.style.top.replace("px", "") as unknown as number) -
        posY
      }px`;
    }
  };

  const startDrag = (e: MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setDragging(true);
  };

  const drag = (e: MouseEvent<HTMLDivElement>) => {
    if (dragging && wrraperRef.current) {
      e.preventDefault();
      movePosition(position.x - e.clientX, position.y - e.clientY);
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };
  const endDrag = () => {
    setDragging(false);
  };

  const startTouch = (e: TouchEvent<HTMLDivElement>) => {
    setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setDragging(true);
  };

  const touchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (dragging && wrraperRef.current) {
      // e.preventDefault();
      movePosition(
        position.x - e.touches[0].clientX,
        position.y - e.touches[0].clientY
      );
      setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };
  const endTouch = () => {
    setDragging(false);
  };
  useEffect(() => {
    if (wrraperRef.current && searchId) {
      const circle = document.querySelector(`.M${searchId}`);
      if (!circle || !window) return;

      let nextLeft = 0;
      let nextTop = 0;
      // 데탑
      if (window.innerWidth > 1024) {
        nextLeft = (800 - (circle.getAttribute("cx") as unknown as number)) * 4;
        nextTop =
          (475 - (circle.getAttribute("cy") as unknown as number)) *
          (window.innerHeight > 754 ? 4 : 2);
      } else {
        nextLeft = 800 - (circle.getAttribute("cx") as unknown as number);
        nextTop = 475 - (circle.getAttribute("cy") as unknown as number);
      }
      movePosition(
        (wrraperRef.current.style.left.replace("px", "") as unknown as number) -
          nextLeft,
        (wrraperRef.current.style.top.replace("px", "") as unknown as number) -
          nextTop
      );
      console.log(nextLeft, nextTop);
      const rectList: SVGRectElement[] = [];
      const labelGroup = document.querySelector(`.label-group`);
      const text = document.querySelector(`.S${searchId}`) as SVGTextElement;
      if (text && text.firstElementChild && labelGroup) {
        for (let i = 0; i < text.childNodes.length; i += 1) {
          const tspan = text.childNodes[i] as SVGTSpanElement;
          let xOffset = 0;
          const labelWidth = (8 * tspan.innerHTML.length) as unknown as string;
          if (text.style.textAnchor === "middle") {
            xOffset = +labelWidth / 2;
          }
          if (text.style.textAnchor === "end") {
            xOffset = +labelWidth;
          }
          // if (tspan && labelGroup) {
          const rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          rect.setAttributeNS(
            null,
            "x",
            `${
              1 * (tspan.getAttributeNS(null, "x") as unknown as number) +
              1 * (tspan.getAttributeNS(null, "dx") as unknown as number) -
              xOffset
            }`
          );
          rect.setAttributeNS(
            null,
            "y",
            `${
              1 * (text.getAttributeNS(null, "y") as unknown as number) +
              1 * (tspan.getAttributeNS(null, "dy") as unknown as number) -
              6
            }`
          );

          if (tspan.classList.value.match(/fdx\d+/g)) {
            const fdx = tspan.classList.value.match(/fdx\d+/g) as string[];
            rect.setAttributeNS(null, "x", `${fdx[0].replace("fdx", "")}`);
          }

          if (tspan.classList.value.match(/fdy\d+/g)) {
            const fdy = tspan.classList.value.match(/fdy\d+/g) as string[];
            rect.setAttributeNS(null, "y", `${fdy[0].replace("fdy", "")}`);
          }

          rect.setAttributeNS(null, "fill", "#ffeb00");
          rect.setAttributeNS(null, "width", labelWidth);

          if (tspan.classList.value.match(/fdw\d+/g)) {
            const fdw = tspan.classList.value.match(/fdw\d+/g) as string[];
            rect.setAttributeNS(null, "width", `${fdw[0].replace("fdw", "")}`);
          }
          rect.setAttributeNS(null, "height", "6"); // `${6 * text.childNodes.length}`);
          labelGroup.insertAdjacentElement("afterbegin", rect);
          rectList.push(rect);
          // }
        }
        // eslint-disable-next-line consistent-return
        return () => {
          rectList.forEach((r) => {
            labelGroup.removeChild(r);
          });
        };
      }
    }
  }, [searchId]);

  useEffect(() => {
    if (wrraperRef.current) {
      if (scaleSize === 4 && prevScale !== 3) return;
      movePosition(
        (wrraperRef.current.style.left.replace("px", "") as unknown as number) -
          ((wrraperRef.current.style.left.replace(
            "px",
            ""
          ) as unknown as number) /
            prevScale) *
            scaleSize,
        (wrraperRef.current.style.top.replace("px", "") as unknown as number) -
          ((wrraperRef.current.style.top.replace(
            "px",
            ""
          ) as unknown as number) /
            prevScale) *
            scaleSize
      );
    }
  }, [prevScale, scaleSize]);
  return (
    <div id="metroMap">
      <div
        className={styles.wrraper}
        onMouseDown={startDrag}
        onMouseMove={drag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={startTouch}
        onTouchMove={touchMove}
        onTouchEnd={endTouch}
        ref={wrraperRef}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          aria-hidden="true"
          // id="metro-map"
          // viewBox="0 0 1525 1000"
          viewBox="0 0 1500 1000"
          className={styles.map}
          style={{ transform: `scale(${scaleSize})` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 2440 1600"
            width="100%"
          >
            <path
              d="M 65 305 H 370 V 430 H 500 L 850 780 H 940 V 888 H 1480 L 1560 808 H 1830 L 1910 888 H 2010 L 2090 808 V 620 H 2300 M 940 860 H 850 L 730 740 H 800"
              fill="none"
              stroke="#d3effb"
              strokeWidth="23"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          {/* <!-- 경로        --> */}
          <g
            className="line"
            fill="none"
            stroke="#052f93"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path className="path L1" strokeWidth="3" d="M 620 65 H 645 " />
            <path
              className="path L1 P19161915 P19151916"
              strokeWidth="3"
              d="M 645 65 H 680 "
            />
            <path
              className="path L1 P19151914 P19141915"
              strokeWidth="3"
              d="M 680 65 H 710 "
            />
            <path
              className="path L1 P19141913 P19131914"
              strokeWidth="3"
              d="M 710 65 H 742.5 "
            />
            <path
              className="path L1 P19131912 P19121913"
              strokeWidth="3"
              d="M 742.5 65 H 775 "
            />
            <path
              className="path L1 P19121911 P19111912"
              strokeWidth="3"
              d="M 775 65 H 805 "
            />
            <path
              className="path L1 P19111910 P19101911"
              strokeWidth="3"
              d="M 805 65 H 840 "
            />
            <path
              className="path L1 P19101909 P19091910"
              strokeWidth="3"
              d="M 840 65 H 870 "
            />
            <path
              className="path L1 P19091908 P19081909"
              strokeWidth="3"
              d="M 870 65 H 902.5 "
            />
            <path
              className="path L1 P19081907 P19071908"
              strokeWidth="3"
              d="M 902.5 65 H 935 "
            />
            <path
              className="path L1 P19071906 P19061907"
              strokeWidth="3"
              d="M 935 65 H 965 "
            />
            <path
              className="path L1 P19061905 P19051906"
              strokeWidth="3"
              d="M 965 65 H 992.5 "
            />
            <path
              className="path L1 P19051904 P19041905"
              strokeWidth="3"
              d="M 992.5 65 H 1030 "
            />
            <path
              className="path L1 P19041903 P19031904"
              strokeWidth="3"
              d="M 1030 65 H 1065 Q 1070 65 1070 70 V 80 "
            />
            <path
              className="path L1 P19031902 P19021903"
              strokeWidth="3"
              d="M 1070 80 V 100 "
            />
            <path
              className="path L1 P19021901 P19011902"
              strokeWidth="3"
              d="M 1070 100 V 120 "
            />
            <path
              className="path L1 P19011022 P10221901"
              strokeWidth="3"
              d="M 1070 120 V 155 "
            />
            <path
              className="path L1 P10221021 P10211022"
              strokeWidth="3"
              d="M 1070 155 V 172.5 "
            />
            <path
              className="path L1 P10211020 P10201021"
              strokeWidth="3"
              d="M 1070 172.5 V 190 "
            />
            <path
              className="path L1 P10201019 P10191020"
              strokeWidth="3"
              d="M 1070 190 V 210 "
            />
            <path
              className="path L1 P10191018 P10181019"
              strokeWidth="3"
              d="M 1070 210 V 225 "
            />
            <path
              className="path L1 P10181017 P10171018"
              strokeWidth="3"
              d="M 1070 225 V 235 Q 1070 240 1065 245 "
            />
            <path
              className="path L1 P10171016 P10161017"
              strokeWidth="3"
              d="M 1065 245 L 1050 260 "
            />
            <path
              className="path L1 P10161015 P10151016"
              strokeWidth="3"
              d="M 1050 260 L 1040 270 Q 1035 275 1030 275 "
            />
            <path
              className="path L1 P10150158 P01581015"
              strokeWidth="3"
              d="M 1030 275 H 995 "
            />
            <path
              className="path L1 P01580157 P01570158"
              strokeWidth="3"
              d="M 995 275 H 960 "
            />
            <path
              className="path L1 P01570156 P01560157"
              strokeWidth="3"
              d="M 960 275 H 930 "
            />
            <path
              className="path L1 P01560159 P01590156"
              strokeWidth="3"
              d="M 930 275 H 900 "
            />
            <path
              className="path L1 P01590155 P01550159"
              strokeWidth="3"
              d="M 900 275 H 865 "
            />
            <path
              className="path L1 P01550154 P01540155"
              strokeWidth="3"
              d="M 865 275 H 795 "
            />
            <path
              className="path L1 P01540153 P01530154"
              strokeWidth="3"
              d="M 795 275 H 715 "
            />
            <path
              className="path L1 P01530152 P01520153"
              strokeWidth="3"
              d="M 715 275 L 680 310 "
            />
            <path
              className="path L1 P01520151 P01510152"
              strokeWidth="3"
              d="M 680 310 L 660 330 Q 655 335 655 340 V 345 "
            />
            <path
              className="path L1 P01510150 P01500151"
              strokeWidth="3"
              d="M 655 345 V 400 "
            />
            <path
              className="path L1 P01501002 P10020150"
              strokeWidth="3"
              d="M 655 400 V 440 "
            />
            <path
              className="path L1 P10021003 P10031002"
              strokeWidth="3"
              d="M 655 440 V 545 "
            />
            <path
              className="path L1 P10031004 P10041003"
              strokeWidth="3"
              d="M 655 545 V 560 Q 655 565 650 565 H 590 "
            />
            <path
              className="path L1 P10041005 P10051004"
              strokeWidth="3"
              d="M 590 565 H 539 Q 534.5000000000014 565 529 560 L 512.5 545 "
            />
            <path
              className="path L1 P10051032 P10321005"
              strokeWidth="3"
              d="M 512.5 545 L 480 515 H 475 "
            />
            <path
              className="path L1 P10321006 P10061032"
              strokeWidth="3"
              d="M 475 515 L 460 530 "
            />
            <path
              className="path L1 P10061007 P10071006"
              strokeWidth="3"
              d="M 460 530 L 440 550 "
            />
            <path
              className="path L1 P10071701 P17011007"
              strokeWidth="3"
              d="M 440 550 L 415 575 "
            />
            <path
              className="path L1 P17011813 P18131701"
              strokeWidth="3"
              d="M 415 575 L 400 590 "
            />
            <path
              className="path L1 P18131801 P18011813"
              strokeWidth="3"
              d="M 400 590 Q 395 595 390 595 H 380 "
            />
            <path
              className="path L1 P18011802 P18021801"
              strokeWidth="3"
              d="M 380 595 H 355 "
            />
            <path
              className="path L1 P18021821 P18211802"
              strokeWidth="3"
              d="M 355 595 H 340 Q 335 595 330 600 "
            />
            <path
              className="path L1 P18211803 P18031821"
              strokeWidth="3"
              d="M 330 600 L 305 625 "
            />
            <path
              className="path L1 P18031814 P18141803"
              strokeWidth="3"
              d="M 305 625 L 285 645 "
            />
            <path
              className="path L1 P18141804 P18041814"
              strokeWidth="3"
              d="M 285 645 L 265 665 Q 260 670 255 670 "
            />
            <path
              className="path L1 P18041822 P18221804"
              strokeWidth="3"
              d="M 255 670 H 222.5 "
            />
            <path
              className="path L1 P18221805 P18051822"
              strokeWidth="3"
              d="M 222.5 670 H 195 "
            />
            <path
              className="path L1 P18051815 P18151805"
              strokeWidth="3"
              d="M 195 670 H 167.5 "
            />
            <path
              className="path L1 P18151806 P18061815"
              strokeWidth="3"
              d="M 167.5 670 H 140 "
            />
            <path
              className="path L1 P18061807 P18071806"
              strokeWidth="3"
              d="M 140 670 H 115 "
            />
            <path
              className="path L1 P18071808 P18081807"
              strokeWidth="3"
              d="M 115 670 H 105 Q 95 670 95 680 V 697.5 "
            />
            <path
              className="path L1 P18081816 P18161808"
              strokeWidth="3"
              d="M 95 697.5 V 715 "
            />
            <path
              className="path L1 P18161809 P18091816"
              strokeWidth="3"
              d="M 95 715 V 735 "
            />
            <path
              className="path L1 P18091823 P18231809"
              strokeWidth="3"
              d="M 95 735 V 760 "
            />
            <path
              className="path L1 P18231810 P18101823"
              strokeWidth="3"
              d="M 95 760 V 790 Q 95 800 105 800 H 125 "
            />
            <path
              className="path L1 P18101817 P18171810"
              strokeWidth="3"
              d="M 125 800 H 155 "
            />
            <path
              className="path L1 P18171811 P18111817"
              strokeWidth="3"
              d="M 155 800 H 185 "
            />
            <path
              className="path L1 P18111812 P18121811"
              strokeWidth="3"
              d="M 185 800 H 220 "
            />
            <path
              className="path L1 P17011702 P17021701"
              strokeWidth="3"
              d="M 415 575 L 415 640 "
            />
            <path
              className="path L1 P17021714 P17141702"
              strokeWidth="3"
              d="M 415 640 V 685 "
            />
            <path
              className="path L1 P17141703 P17031714"
              strokeWidth="3"
              d="M 415 685 V 720 "
            />
            <path
              className="path L1 P17501703 P17031750"
              strokeWidth="3"
              d="M 390 700 L 405 715 Q 410 720 415 720 "
            />
            <path
              className="path L1 P17031704 P17041703"
              strokeWidth="3"
              d="M 415 720 H 470 "
            />
            <path
              className="path L1 P17041705 P17051704"
              strokeWidth="3"
              d="M 470 720 H 510 Q 515 720 515 725 V 750 "
            />
            <path
              className="path L1 P17051706 P17061705"
              strokeWidth="3"
              d="M 515 750 V 790 "
            />
            <path
              className="path L1 P17061707 P17071706"
              strokeWidth="3"
              d="M 515 790 V 830 "
            />
            <path
              className="path L1 P17071708 P17081707"
              strokeWidth="3"
              d="M 515 830 V 860 "
            />
            <path
              className="path L1 P17081709 P17091708"
              strokeWidth="3"
              d="M 515 860 V 890 Q 515 895 520 900 L 530 910 "
            />
            <path
              className="path L1 P17091729 P17291709"
              strokeWidth="3"
              d="M 530 910 L 550 930 "
            />
            <path
              className="path L1 P17291710 P17101729"
              strokeWidth="3"
              d="M 550 930 L 565 945 Q 570 950 575 950 H 585 "
            />
            <path
              className="path L1 P17101711 P17111710"
              strokeWidth="3"
              d="M 585 950 H 620 "
            />
            <path
              className="path L1 P17111712 P17121711"
              strokeWidth="3"
              d="M 620 950 H 647.5 "
            />
            <path
              className="path L1 P17121713 P17131712"
              strokeWidth="3"
              d="M 647.5 950 H 670 "
            />
            <path
              className="path L1 P17131715 P17151713"
              strokeWidth="3"
              d="M 670 950 H 697.5 "
            />
            <path
              className="path L1 P17151716 P17161715"
              strokeWidth="3"
              d="M 697.5 950 H 730 "
            />
            <path
              className="path L1 P17161717 P17171716"
              strokeWidth="3"
              d="M 730 950 H 760 "
            />
            <path
              className="path L1 P17171718 P17181717"
              strokeWidth="3"
              d="M 760 950 H 795 "
            />
            <path
              className="path L1 P17181719 P17191718"
              strokeWidth="3"
              d="M 795 950 H 825 "
            />
            <path
              className="path L1 P17191720 P17201719"
              strokeWidth="3"
              d="M 825 950 H 855 "
            />
            <path
              className="path L1 P17201721 P17211720"
              strokeWidth="3"
              d="M 855 950 H 885 "
            />
            <path
              className="path L1 P17211722 P17221721"
              strokeWidth="3"
              d="M 885 950 H 917.5 "
            />
            <path
              className="path L1 P17221723 P17231722"
              strokeWidth="3"
              d="M 917.5 950 H 950 "
            />
            <path
              className="path L1 P17231724 P17241723"
              strokeWidth="3"
              d="M 950 950 H 980 "
            />
            <path
              className="path L1 P17241725 P17251724"
              strokeWidth="3"
              d="M 980 950 H 1010 "
            />
            <path
              className="path L1 P17251726 P17261725"
              strokeWidth="3"
              d="M 1010 950 H 1040 "
            />
            <path
              className="path L1 P17261727 P17271726"
              strokeWidth="3"
              d="M 1040 950 H 1070 "
            />
            <path
              className="path L1 P17271728 P17281727"
              strokeWidth="3"
              d="M 1070 950 H 1100 "
            />
            <path
              className="path L1 P17281401 P14011728"
              strokeWidth="3"
              d="M 1100 950 H 1130 "
            />
            <path
              className="path L1 P14011402 P14021401"
              strokeWidth="3"
              d="M 1130 950 H 1165 "
            />
            <path
              className="path L1 P14021403 P14031402"
              strokeWidth="3"
              d="M 1165 950 H 1197.5 "
            />
            <path
              className="path L1 P14031404 P14041403"
              strokeWidth="3"
              d="M 1197.5 950 H 1230 "
            />
            <path
              className="path L1 P14041405 P14051404"
              strokeWidth="3"
              d="M 1230 950 H 1270 "
            />
            <path
              className="path L1 P14051407 P14071405"
              strokeWidth="3"
              d="M 1270 950 H 1310 "
            />
            <path
              className="path L1 P14071408 P14081407"
              strokeWidth="3"
              d="M 1310 950 H 1350 "
            />
            <path className="path L1" strokeWidth="3" d="M 1350 950 H 1390 " />
            <path
              className="path L1 P17161749 P17491716"
              strokeWidth="3"
              d="M 730 950 L 730 920 "
            />
            <g className="path L1">
              <rect
                x="615"
                y="60"
                width="10"
                height="10"
                fill="#052f93"
                stroke="#052f93"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="620"
                y="68"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                1
              </text>
              <rect
                x="225"
                y="765"
                width="10"
                height="10"
                fill="#052f93"
                stroke="#052f93"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="230"
                y="773"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                1
              </text>
              <rect
                x="1385"
                y="945"
                width="10"
                height="10"
                fill="#052f93"
                stroke="#052f93"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1390"
                y="953"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                1
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#10a643"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path L2 P02000249 P02490200"
              strokeWidth="2"
              d="M 290 460 L 325 495 "
            />
            <path
              className="path L2 P02490248 P02480249"
              strokeWidth="2"
              d="M 325 495 L 345 515 "
            />
            <path
              className="path L2 P02480247 P02470248"
              strokeWidth="2"
              d="M 345 515 L 365 535 "
            />
            <path
              className="path L2 P02470234 P02340247"
              strokeWidth="2"
              d="M 365 535 L 375 545 Q 380 550 385 550 H 435 "
            />
            <path
              className="path L2 P02340235 P02350234"
              strokeWidth="3"
              d="M 435 550 V 550 L 420 535 Q 415 530 415 525 V 500 "
            />
            <path
              className="path L2 P02350236 P02360235"
              strokeWidth="3"
              d="M 415 500 V 460 "
            />
            <path
              className="path L2 P02360237 P02370236"
              strokeWidth="3"
              d="M 415 460 V 450 Q 415 445 420 445 H 460 "
            />
            <path
              className="path L2 P02370238 P02380237"
              strokeWidth="3"
              d="M 460 445 H 510 "
            />
            <path
              className="path L2 P02380239 P02390238"
              strokeWidth="3"
              d="M 510 445 H 520 Q 525 445 530 440 L 550 420 V 410 "
            />
            <path
              className="path L2 P02390240 P02400239"
              strokeWidth="3"
              d="M 550 410 V 382.5 "
            />
            <path
              className="path L2 P02400241 P02410240"
              strokeWidth="3"
              d="M 550 382.5 V 370 "
            />
            <path
              className="path L2 P02410242 P02420241"
              strokeWidth="3"
              d="M 550 370 V 355 "
            />
            <path
              className="path L2 P02420243 P02430242"
              strokeWidth="3"
              d="M 550 355 Q 550 345 560 345 H 605 "
            />
            <path
              className="path L2 P02430201 P02010243"
              strokeWidth="3"
              d="M 605 345 H 655 "
            />
            <path
              className="path L2 P02010202 P02020201"
              strokeWidth="3"
              d="M 655 345 H 690 "
            />
            <path
              className="path L2 P02020203 P02030202"
              strokeWidth="3"
              d="M 690 345 H 720 "
            />
            <path
              className="path L2 P02030204 P02040203"
              strokeWidth="3"
              d="M 720 345 H 790 "
            />
            <path
              className="path L2 P02040205 P02050204"
              strokeWidth="3"
              d="M 790 345 H 850 V 340 "
            />
            <path
              className="path L2 P02050206 P02060205"
              strokeWidth="3"
              d="M 850 340 V 345 H 900 "
            />
            <path
              className="path L2 P02060207 P02070206"
              strokeWidth="3"
              d="M 900 345 H 940 Q 945 345 950 350 L 960 360 "
            />
            <path
              className="path L2 P02070208 P02080207"
              strokeWidth="3"
              d="M 960 360 L 990 390 "
            />
            <path
              className="path L2 P02080209 P02090208"
              strokeWidth="3"
              d="M 990 390 L 1020 420 "
            />
            <path
              className="path L2 P02090210 P02100209"
              strokeWidth="3"
              d="M 1020 420 L 1035 435 "
            />
            <path
              className="path L2 P02100211 P02110210"
              strokeWidth="3"
              d="M 1035 435 L 1055 455 "
            />
            <path
              className="path L2 P02110212 P02120211"
              strokeWidth="3"
              d="M 1055 455 L 1080 480 Q 1085 485 1090 485 H 1165 "
            />
            <path
              className="path L2 P02120213 P02130212"
              strokeWidth="3"
              d="M 1165 485 H 1175 Q 1185 485 1190 490 L 1200 500 "
            />
            <path
              className="path L2 P02130214 P02140213"
              strokeWidth="3"
              d="M 1200 500 L 1230 530 "
            />
            <path
              className="path L2 P02140215 P02150214"
              strokeWidth="3"
              d="M 1230 530 L 1250 550 Q 1255 555 1255 560 V 585 "
            />
            <path
              className="path L2 P02150216 P02160215"
              strokeWidth="3"
              d="M 1255 585 V 635 "
            />
            <path
              className="path L2 P02160217 P02170216"
              strokeWidth="3"
              d="M 1255 635 V 675 Q 1255 680 1250 680 H 1237.5 "
            />
            <path
              className="path L2 P02170218 P02180217"
              strokeWidth="3"
              d="M 1237.5 680 H 1145 "
            />
            <path
              className="path L2 P02180219 P02190218"
              strokeWidth="3"
              d="M 1145 680 H 1085 "
            />
            <path
              className="path L2 P02190220 P02200219"
              strokeWidth="3"
              d="M 1085 680 H 1015 "
            />
            <path
              className="path L2 P02200221 P02210220"
              strokeWidth="3"
              d="M 1015 680 H 970 "
            />
            <path
              className="path L2 P02210222 P02220221"
              strokeWidth="3"
              d="M 970 680 H 920 "
            />
            <path
              className="path L2 P02220223 P02230222"
              strokeWidth="3"
              d="M 920 680 H 860 "
            />
            <path
              className="path L2 P02230224 P02240223"
              strokeWidth="3"
              d="M 860 680 H 805 "
            />
            <path
              className="path L2 P02240225 P02250224"
              strokeWidth="3"
              d="M 805 680 H 760 "
            />
            <path
              className="path L2 P02250226 P02260225"
              strokeWidth="3"
              d="M 760 680 H 705 "
            />
            <path
              className="path L2 P02260227 P02270226"
              strokeWidth="3"
              d="M 705 680 H 677.5 "
            />
            <path
              className="path L2 P02270228 P02280227"
              strokeWidth="3"
              d="M 677.5 680 H 635 "
            />
            <path
              className="path L2 P02280229 P02290228"
              strokeWidth="3"
              d="M 635 680 H 585 "
            />
            <path
              className="path L2 P02290230 P02300229"
              strokeWidth="3"
              d="M 585 680 H 545 "
            />
            <path
              className="path L2 P02300231 P02310230"
              strokeWidth="3"
              d="M 545 680 H 500 "
            />
            <path
              className="path L2 P02310232 P02320231"
              strokeWidth="3"
              d="M 500 680 H 470 Q 460 680 460 670 "
            />
            <path
              className="path L2 P02320233 P02330232"
              strokeWidth="3"
              d="M 460 670 V 640 "
            />
            <path
              className="path L2 P02330234 P02340233"
              strokeWidth="3"
              d="M 460 640 V 580 Q 460 575 455 570 L 435 550 "
            />
            <path
              className="path L2 P02110244 P02440211"
              strokeWidth="2"
              d="M 1055 455 L 1055 420 "
            />
            <path
              className="path L2 P02440245 P02450244"
              strokeWidth="2"
              d="M 1055 420 V 400 Q 1055 395 1050 390 L 975 315 "
            />
            <path
              className="path L2 P02450250 P02500245"
              strokeWidth="2"
              d="M 975 315 L 955 295 "
            />
            <path
              className="path L2 P02500246 P02460250"
              strokeWidth="2"
              d="M 955 295 L 935 275 H 930 "
            />
            <g className="path L2" />
          </g>
          <g
            className="line"
            fill="none"
            stroke="#ea8406"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path className="path L3" strokeWidth="3" d="M 40 175 H 80 " />
            <path
              className="path L3 P19581957 P19571958"
              strokeWidth="3"
              d="M 80 175 H 120 "
            />
            <path
              className="path L3 P19571956 P19561957"
              strokeWidth="3"
              d="M 120 175 H 157.5 "
            />
            <path
              className="path L3 P19561955 P19551956"
              strokeWidth="3"
              d="M 157.5 175 H 194.5 "
            />
            <path
              className="path L3 P19551954 P19541955"
              strokeWidth="3"
              d="M 194.5 175 H 230 "
            />
            <path
              className="path L3 P19541953 P19531954"
              strokeWidth="3"
              d="M 230 175 H 265 "
            />
            <path
              className="path L3 P19531952 P19521953"
              strokeWidth="3"
              d="M 265 175 H 287.5 "
            />
            <path
              className="path L3 P19521951 P19511952"
              strokeWidth="3"
              d="M 287.5 175 H 315 "
            />
            <path
              className="path L3 P19511948 P19481951"
              strokeWidth="3"
              d="M 315 175 H 340 "
            />
            <path
              className="path L3 P19481950 P19501948"
              strokeWidth="3"
              d="M 340 175 H 365 "
            />
            <path
              className="path L3 P19500309 P03091950"
              strokeWidth="3"
              d="M 365 175 H 391 "
            />
            <path
              className="path L3 P03090310 P03100309"
              strokeWidth="3"
              d="M 391 175 H 419 "
            />
            <path
              className="path L3 P03100311 P03110310"
              strokeWidth="3"
              d="M 419 175 H 440 "
            />
            <path
              className="path L3 P03110312 P03120311"
              strokeWidth="3"
              d="M 440 175 H 500 "
            />
            <path
              className="path L3 P03120313 P03130312"
              strokeWidth="3"
              d="M 500 175 H 542.5 "
            />
            <path
              className="path L3 P03130314 P03140313"
              strokeWidth="3"
              d="M 542.5 175 H 575 "
            />
            <path
              className="path L3 P03140315 P03150314"
              strokeWidth="3"
              d="M 575 175 H 605 "
            />
            <path
              className="path L3 P03150316 P03160315"
              strokeWidth="3"
              d="M 605 175 H 615 Q 620 175 625 180 L 645 200 "
            />
            <path
              className="path L3 P03160317 P03170316"
              strokeWidth="3"
              d="M 645 200 L 670 225 "
            />
            <path
              className="path L3 P03170318 P03180317"
              strokeWidth="3"
              d="M 670 225 L 690 245 "
            />
            <path
              className="path L3 P03180319 P03190318"
              strokeWidth="3"
              d="M 690 245 L 720 275 H 715 "
            />
            <path
              className="path L3 P03190320 P03200319"
              strokeWidth="3"
              d="M 715 275 H 720 V 345 "
            />
            <path
              className="path L3 P03200321 P03210320"
              strokeWidth="3"
              d="M 720 345 L 775 400 "
            />
            <path
              className="path L3 P03210322 P03220321"
              strokeWidth="3"
              d="M 775 400 L 810 435 "
            />
            <path
              className="path L3 P03220323 P03230322"
              strokeWidth="3"
              d="M 810 435 L 850 475 "
            />
            <path
              className="path L3 P03230324 P03240323"
              strokeWidth="3"
              d="M 850 475 L 855 480 Q 860 485 860 490 V 500 "
            />
            <path
              className="path L3 P03240325 P03250324"
              strokeWidth="3"
              d="M 860 500 V 530 "
            />
            <path
              className="path L3 P03250326 P03260325"
              strokeWidth="3"
              d="M 860 530 V 570 "
            />
            <path
              className="path L3 P03260327 P03270326"
              strokeWidth="3"
              d="M 860 570 V 590 "
            />
            <path
              className="path L3 P03270328 P03280327"
              strokeWidth="3"
              d="M 860 590 V 610 "
            />
            <path
              className="path L3 P03280329 P03290328"
              strokeWidth="3"
              d="M 860 610 V 645 "
            />
            <path
              className="path L3 P03290330 P03300329"
              strokeWidth="3"
              d="M 860 645 V 680 "
            />
            <path
              className="path L3 P03300331 P03310330"
              strokeWidth="3"
              d="M 860 680 L 880 700 "
            />
            <path
              className="path L3 P03310332 P03320331"
              strokeWidth="3"
              d="M 880 700 L 900 720 Q 905 725 910 725 H 920 "
            />
            <path
              className="path L3 P03320333 P03330332"
              strokeWidth="3"
              d="M 920 725 H 960 "
            />
            <path
              className="path L3 P03330334 P03340333"
              strokeWidth="3"
              d="M 960 725 H 1015 "
            />
            <path
              className="path L3 P03340335 P03350334"
              strokeWidth="3"
              d="M 1015 725 H 1065 "
            />
            <path
              className="path L3 P03350336 P03360335"
              strokeWidth="3"
              d="M 1065 725 H 1110 "
            />
            <path
              className="path L3 P03360337 P03370336"
              strokeWidth="3"
              d="M 1110 725 H 1175 "
            />
            <path
              className="path L3 P03370338 P03380337"
              strokeWidth="3"
              d="M 1175 725 H 1220 "
            />
            <path
              className="path L3 P03380339 P03390338"
              strokeWidth="3"
              d="M 1220 725 H 1240 Q 1245 725 1250 730 L 1285 765 "
            />
            <path
              className="path L3 P03390340 P03400339"
              strokeWidth="3"
              d="M 1285 765 L 1332.5 717.5 "
            />
            <path
              className="path L3 P03400341 P03410340"
              strokeWidth="3"
              d="M 1332.5 717.5 L 1375 675 "
            />
            <path
              className="path L3 P03410342 P03420341"
              strokeWidth="3"
              d="M 1375 675 L 1410 640 "
            />
            <g className="path L3">
              <rect
                x="35"
                y="170"
                width="10"
                height="10"
                fill="#ea8406"
                stroke="#ea8406"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="40"
                y="178"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                3
              </text>
              <rect
                x="1385"
                y="630"
                width="10"
                height="10"
                fill="#ea8406"
                stroke="#ea8406"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1390"
                y="638"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                3
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#00a8e6"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path L4"
              strokeWidth="3"
              d="M 1310 60 L 1290 80 "
            />
            <path
              className="path L4 P04050406 P04060405"
              strokeWidth="3"
              d="M 1290 80 L 1270 100 "
            />
            <path
              className="path L4 P04060408 P04080406"
              strokeWidth="3"
              d="M 1270 100 L 1250 120 "
            />
            <path
              className="path L4 P04080409 P04090408"
              strokeWidth="3"
              d="M 1250 120 L 1230 140 "
            />
            <path
              className="path L4 P04090410 P04100409"
              strokeWidth="3"
              d="M 1230 140 L 1220 150 Q 1215 155 1210 155 H 1195 "
            />
            <path
              className="path L4 P04100411 P04110410"
              strokeWidth="3"
              d="M 1195 155 H 1150 "
            />
            <path
              className="path L4 P04110412 P04120411"
              strokeWidth="3"
              d="M 1150 155 H 1070 "
            />
            <path
              className="path L4 P04120413 P04130412"
              strokeWidth="3"
              d="M 1070 155 H 1030 "
            />
            <path
              className="path L4 P04130414 P04140413"
              strokeWidth="3"
              d="M 1030 155 H 1000 "
            />
            <path
              className="path L4 P04140415 P04150414"
              strokeWidth="3"
              d="M 1000 155 H 955 "
            />
            <path
              className="path L4 P04150416 P04160415"
              strokeWidth="3"
              d="M 955 155 H 915 "
            />
            <path
              className="path L4 P04160417 P04170416"
              strokeWidth="3"
              d="M 915 155 H 880 "
            />
            <path
              className="path L4 P04170418 P04180417"
              strokeWidth="3"
              d="M 880 155 Q 865 155 865 170 "
            />
            <path
              className="path L4 P04180419 P04190418"
              strokeWidth="3"
              d="M 865 170 V 200 "
            />
            <path
              className="path L4 P04190420 P04200419"
              strokeWidth="3"
              d="M 865 200 V 230 "
            />
            <path
              className="path L4 P04200421 P04210420"
              strokeWidth="3"
              d="M 865 230 V 275 "
            />
            <path
              className="path L4 P04210422 P04220421"
              strokeWidth="3"
              d="M 865 275 V 330 Q 865 335 860 340 L 850 350 "
            />
            <path
              className="path L4 P04220423 P04230422"
              strokeWidth="3"
              d="M 850 350 L 805 395 Q 800 400 795 400 H 780 "
            />
            <path
              className="path L4 P04230424 P04240423"
              strokeWidth="3"
              d="M 780 400 H 745 "
            />
            <path
              className="path L4 P04240425 P04250424"
              strokeWidth="3"
              d="M 745 400 H 715 "
            />
            <path
              className="path L4 P04250426 P04260425"
              strokeWidth="3"
              d="M 715 400 H 655 "
            />
            <path
              className="path L4 P04260427 P04270426"
              strokeWidth="3"
              d="M 655 400 L 690 435 "
            />
            <path
              className="path L4 P04270428 P04280427"
              strokeWidth="3"
              d="M 690 435 L 700 445 Q 705 450 705 455 V 475 "
            />
            <path
              className="path L4 P04280429 P04290428"
              strokeWidth="3"
              d="M 705 475 V 515 "
            />
            <path
              className="path L4 P04290430 P04300429"
              strokeWidth="3"
              d="M 705 515 V 545 "
            />
            <path
              className="path L4 P04300431 P04310430"
              strokeWidth="3"
              d="M 705 545 V 600 "
            />
            <path
              className="path L4 P04310432 P04320431"
              strokeWidth="3"
              d="M 705 600 V 640 "
            />
            <path
              className="path L4 P04320433 P04330432"
              strokeWidth="3"
              d="M 705 640 V 680 "
            />
            <path
              className="path L4 P04330434 P04340433"
              strokeWidth="3"
              d="M 705 680 V 705 "
            />
            <path
              className="path L4 P04341450 P14500434"
              strokeWidth="3"
              d="M 705 705 V 725 "
            />
            <path
              className="path L4 P14501451 P14511450"
              strokeWidth="3"
              d="M 705 725 V 730 Q 705 735 700 740 L 695 745 "
            />
            <path
              className="path L4 P14511452 P14521451"
              strokeWidth="3"
              d="M 695 745 L 675 765 "
            />
            <path
              className="path L4 P14521453 P14531452"
              strokeWidth="3"
              d="M 675 765 L 665 775 Q 660 780 655 780 "
            />
            <path
              className="path L4 P14531454 P14541453"
              strokeWidth="3"
              d="M 655 780 H 620 "
            />
            <path
              className="path L4 P14541455 P14551454"
              strokeWidth="3"
              d="M 620 780 H 600 Q 595 780 590 785 L 575 800 "
            />
            <path
              className="path L4 P14551456 P14561455"
              strokeWidth="3"
              d="M 575 800 L 555 820 "
            />
            <path
              className="path L4 P14561457 P14571456"
              strokeWidth="3"
              d="M 555 820 L 535 840 "
            />
            <path
              className="path L4 P14571458 P14581457"
              strokeWidth="3"
              d="M 535 840 L 515 860 "
            />
            <path
              className="path L4 P14581751 P17511458"
              strokeWidth="3"
              d="M 515 860 L 495 880 "
            />
            <path
              className="path L4 P17511763 P17631751"
              strokeWidth="3"
              d="M 495 880 L 475 900 "
            />
            <path
              className="path L4 P17631752 P17521763"
              strokeWidth="3"
              d="M 475 900 Q 475 900 455 920 "
            />
            <path
              className="path L4 P17521753 P17531752"
              strokeWidth="3"
              d="M 455 920 L 435 940 Q 430 945 425 945 H 410 "
            />
            <path
              className="path L4 P17531754 P17541753"
              strokeWidth="3"
              d="M 410 945 H 380 "
            />
            <path
              className="path L4 P17541755 P17551754"
              strokeWidth="3"
              d="M 380 945 H 350 "
            />
            <path
              className="path L4 P17551756 P17561755"
              strokeWidth="3"
              d="M 350 945 H 320 "
            />
            <path
              className="path L4 P17561757 P17571756"
              strokeWidth="3"
              d="M 320 945 H 290 "
            />
            <path
              className="path L4 P17571758 P17581757"
              strokeWidth="3"
              d="M 290 945 H 260 "
            />
            <path
              className="path L4 P17581759 P17591758"
              strokeWidth="3"
              d="M 260 945 H 230 "
            />
            <path
              className="path L4 P17591760 P17601759"
              strokeWidth="3"
              d="M 230 945 H 195 "
            />
            <path
              className="path L4 P17601761 P17611760"
              strokeWidth="3"
              d="M 195 945 H 155 "
            />
            <path
              className="path L4 P17611762 P17621761"
              strokeWidth="3"
              d="M 155 945 H 100 "
            />
            <g className="path L4">
              <rect
                x="1305"
                y="55"
                width="10"
                height="10"
                fill="#00a8e6"
                stroke="#00a8e6"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1310"
                y="63"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                4
              </text>
              <rect
                x="90"
                y="957.5"
                width="10"
                height="10"
                fill="#00a8e6"
                stroke="#00a8e6"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="95"
                y="965.5"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                4
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#a95094"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path className="path L5" strokeWidth="3" d="M 210 225 V 275 " />
            <path
              className="path L5 P25112512 P25122511"
              strokeWidth="3"
              d="M 210 275 V 310 "
            />
            <path
              className="path L5 P25122513 P25132512"
              strokeWidth="3"
              d="M 210 310 V 350 "
            />
            <path
              className="path L5 P25132514 P25142513"
              strokeWidth="3"
              d="M 210 350 V 377.5 "
            />
            <path
              className="path L5 P25142515 P25152514"
              strokeWidth="3"
              d="M 210 377.5 V 402.5 "
            />
            <path
              className="path L5 P25152516 P25162515"
              strokeWidth="3"
              d="M 210 402.5 V 429 "
            />
            <path
              className="path L5 P25162517 P25172516"
              strokeWidth="3"
              d="M 210 429 V 455 Q 210 460 215 460 H 225 "
            />
            <path
              className="path L5 P25172518 P25182517"
              strokeWidth="3"
              d="M 225 460 H 255 "
            />
            <path
              className="path L5 P25182519 P25192518"
              strokeWidth="3"
              d="M 255 460 H 290 "
            />
            <path
              className="path L5 P25192520 P25202519"
              strokeWidth="3"
              d="M 290 460 H 320 "
            />
            <path
              className="path L5 P25202521 P25212520"
              strokeWidth="3"
              d="M 320 460 H 345 "
            />
            <path
              className="path L5 P25212522 P25222521"
              strokeWidth="3"
              d="M 345 460 H 370 "
            />
            <path
              className="path L5 P25222523 P25232522"
              strokeWidth="3"
              d="M 370 460 H 395 "
            />
            <path
              className="path L5 P25232524 P25242523"
              strokeWidth="3"
              d="M 395 460 H 415 "
            />
            <path
              className="path L5 P25242525 P25252524"
              strokeWidth="3"
              d="M 415 460 L 442.5 485 "
            />
            <path
              className="path L5 P25252526 P25262525"
              strokeWidth="3"
              d="M 442.5 485 L 480 515 "
            />
            <path
              className="path L5 P25262527 P25272526"
              strokeWidth="3"
              d="M 480 515 L 495 505 H 525 "
            />
            <path
              className="path L5 P25272528 P25282527"
              strokeWidth="3"
              d="M 525 505 H 565 "
            />
            <path
              className="path L5 P25282529 P25292528"
              strokeWidth="3"
              d="M 565 505 H 600 "
            />
            <path
              className="path L5 P25292530 P25302529"
              strokeWidth="3"
              d="M 600 505 Q 605 505 605 500 V 460 "
            />
            <path
              className="path L5 P25302531 P25312530"
              strokeWidth="3"
              d="M 605 460 V 365 "
            />
            <path
              className="path L5 P25312532 P25322531"
              strokeWidth="3"
              d="M 605 365 V 345 "
            />
            <path
              className="path L5 P25322533 P25332532"
              strokeWidth="3"
              d="M 605 345 V 300 "
            />
            <path
              className="path L5 P25332534 P25342533"
              strokeWidth="3"
              d="M 605 300 V 280 Q 605 275 610 275 H 645 "
            />
            <path
              className="path L5 P25342535 P25352534"
              strokeWidth="3"
              d="M 645 275 H 725 "
            />
            <path
              className="path L5 P25352536 P25362535"
              strokeWidth="3"
              d="M 725 275 L 790 340 "
            />
            <path
              className="path L5 P25362537 P25372536"
              strokeWidth="3"
              d="M 790 340 H 850 "
            />
            <path
              className="path L5 P25372538 P25382537"
              strokeWidth="3"
              d="M 850 340 V 395 "
            />
            <path
              className="path L5 P25382539 P25392538"
              strokeWidth="3"
              d="M 850 395 H 905 "
            />
            <path
              className="path L5 P25392540 P25402539"
              strokeWidth="3"
              d="M 905 395 H 945 "
            />
            <path
              className="path L5 P25402541 P25412540"
              strokeWidth="3"
              d="M 945 395 H 990 V 390 "
            />
            <path
              className="path L5 P25412542 P25422541"
              strokeWidth="3"
              d="M 990 390 V 395 H 1035 "
            />
            <path
              className="path L5 P25422543 P25432542"
              strokeWidth="3"
              d="M 1035 395 H 1085 "
            />
            <path
              className="path L5 P25432544 P25442543"
              strokeWidth="3"
              d="M 1085 395 H 1130 "
            />
            <path
              className="path L5 P25442545 P25452544"
              strokeWidth="3"
              d="M 1130 395 H 1165 "
            />
            <path
              className="path L5 P25452546 P25462545"
              strokeWidth="3"
              d="M 1165 395 H 1200 Q 1210 395 1215 400 L 1235 420 "
            />
            <path
              className="path L5 P25462547 P25472546"
              strokeWidth="3"
              d="M 1235 420 L 1275 460 "
            />
            <path
              className="path L5 P25472548 P25482547"
              strokeWidth="3"
              d="M 1275 460 L 1355 540 "
            />
            <path
              className="path L5 P25482549 P25492548"
              strokeWidth="3"
              d="M 1355 540 H 1410 "
            />
            <path
              className="path L5 P25492550 P25502549"
              strokeWidth="3"
              d="M 1410 540 V 515 "
            />
            <path
              className="path L5 P25502551 P25512550"
              strokeWidth="3"
              d="M 1410 515 V 490 "
            />
            <path
              className="path L5 P25512552 P25522551"
              strokeWidth="3"
              d="M 1410 490 V 465 "
            />
            <path
              className="path L5 P25522553 P25532552"
              strokeWidth="3"
              d="M 1410 465 V 440 "
            />
            <path
              className="path L5 P25532554 P25542553"
              strokeWidth="3"
              d="M 1410 440 V 415 "
            />
            <path
              className="path L5 P25542562 P25622554"
              strokeWidth="3"
              d="M 1410 415 V 405 Q 1410 400 1415 400 H 1450 Q 1455 400 1455 405 V 415 "
            />
            <path
              className="path L5 P25622563 P25632562"
              strokeWidth="3"
              d="M 1455 415 V 435 "
            />
            <path
              className="path L5 P25632564 P25642563"
              strokeWidth="3"
              d="M 1455 435 V 455 "
            />
            <path
              className="path L5 P25642565 P25652564"
              strokeWidth="3"
              d="M 1455 455 V 475 "
            />
            <path
              className="path L5 P25652566 P25662565"
              strokeWidth="3"
              d="M 1455 475 V 495 "
            />
            <path className="path L5" strokeWidth="3" d="M 1455 495 V 515 " />
            <path
              className="path L5 P25492555 P25552549"
              strokeWidth="3"
              d="M 1410 540 L 1410 565 "
            />
            <path
              className="path L5 P25552556 P25562555"
              strokeWidth="3"
              d="M 1410 565 V 590 "
            />
            <path
              className="path L5 P25562557 P25572556"
              strokeWidth="3"
              d="M 1410 590 V 615 "
            />
            <path
              className="path L5 P25572558 P25582557"
              strokeWidth="3"
              d="M 1410 615 V 640 "
            />
            <path
              className="path L5 P25582559 P25592558"
              strokeWidth="3"
              d="M 1410 640 V 665 "
            />
            <path
              className="path L5 P25592560 P25602559"
              strokeWidth="3"
              d="M 1410 665 V 690 "
            />
            <path
              className="path L5 P25602561 P25612560"
              strokeWidth="3"
              d="M 1410 690 V 715 "
            />
            <path className="path L5" strokeWidth="3" d="M 1410 715 V 740 " />
            <g className="path L5">
              <rect
                x="205"
                y="220"
                width="10"
                height="10"
                fill="#a95094"
                stroke="#a95094"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="210"
                y="228"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                5
              </text>
              <rect
                x="1450"
                y="510"
                width="10"
                height="10"
                fill="#a95094"
                stroke="#a95094"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1455"
                y="518"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                5
              </text>
              <rect
                x="1405"
                y="735"
                width="10"
                height="10"
                fill="#a95094"
                stroke="#a95094"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1410"
                y="743"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                5
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#d08d1a"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path L6 P26492648 P26482649"
              strokeWidth="3"
              d="M 1260 255 L 1245 240 "
            />
            <path
              className="path L6 P26482647 P26472648"
              strokeWidth="3"
              d="M 1245 240 L 1235 230 Q 1230 225 1220 225 H 1195 "
            />
            <path
              className="path L6 P26472646 P26462647"
              strokeWidth="3"
              d="M 1195 225 H 1165 "
            />
            <path
              className="path L6 P26462645 P26452646"
              strokeWidth="3"
              d="M 1165 225 H 1070 "
            />
            <path
              className="path L6 P26452644 P26442645"
              strokeWidth="3"
              d="M 1070 225 H 1045 "
            />
            <path
              className="path L6 P26442643 P26432644"
              strokeWidth="3"
              d="M 1045 225 H 1010 "
            />
            <path
              className="path L6 P26432642 P26422643"
              strokeWidth="3"
              d="M 1010 225 H 970 "
            />
            <path
              className="path L6 P26422641 P26412642"
              strokeWidth="3"
              d="M 970 225 H 940 "
            />
            <path
              className="path L6 P26412640 P26402641"
              strokeWidth="3"
              d="M 940 225 H 905 "
            />
            <path
              className="path L6 P26402639 P26392640"
              strokeWidth="3"
              d="M 905 225 Q 900 225 900 230 V 240 "
            />
            <path
              className="path L6 P26392638 P26382639"
              strokeWidth="3"
              d="M 900 240 V 255 "
            />
            <path
              className="path L6 P26382637 P26372638"
              strokeWidth="3"
              d="M 900 255 V 275 "
            />
            <path
              className="path L6 P26372636 P26362637"
              strokeWidth="3"
              d="M 900 275 V 345 "
            />
            <path
              className="path L6 P26362635 P26352636"
              strokeWidth="3"
              d="M 900 345 L 850 395 "
            />
            <path
              className="path L6 P26352634 P26342635"
              strokeWidth="3"
              d="M 850 395 V 400 V 475 "
            />
            <path
              className="path L6 P26342633 P26332634"
              strokeWidth="3"
              d="M 850 475 H 825 "
            />
            <path
              className="path L6 P26332632 P26322633"
              strokeWidth="3"
              d="M 825 475 H 795 "
            />
            <path
              className="path L6 P26322631 P26312632"
              strokeWidth="3"
              d="M 795 475 H 755 "
            />
            <path
              className="path L6 P26312630 P26302631"
              strokeWidth="3"
              d="M 755 475 H 725 "
            />
            <path
              className="path L6 P26302629 P26292630"
              strokeWidth="3"
              d="M 725 475 H 705 "
            />
            <path
              className="path L6 P26292628 P26282629"
              strokeWidth="3"
              d="M 705 475 H 635 "
            />
            <path
              className="path L6 P26282628 P26282628"
              strokeWidth="3"
              d="M 635 475 V 470 "
            />
            <path
              className="path L6 P26282628 P26282628"
              strokeWidth="3"
              d="M 635 470 V 475 "
            />
            <path
              className="path L6 P26282627 P26272628"
              strokeWidth="3"
              d="M 635 475 H 605 "
            />
            <path
              className="path L6 P26272626 P26262627"
              strokeWidth="3"
              d="M 605 475 H 580 "
            />
            <path
              className="path L6 P26262625 P26252626"
              strokeWidth="3"
              d="M 580 475 H 545 "
            />
            <path
              className="path L6 P26252624 P26242625"
              strokeWidth="3"
              d="M 545 475 Q 540 475 535 470 L 525 460 "
            />
            <path
              className="path L6 P26242623 P26232624"
              strokeWidth="3"
              d="M 525 460 L 510 445 "
            />
            <path
              className="path L6 P26232622 P26222623"
              strokeWidth="3"
              d="M 510 445 L 485 420 "
            />
            <path
              className="path L6 P26222621 P26212622"
              strokeWidth="3"
              d="M 485 420 L 475 410 Q 470 405 470 400 V 375 "
            />
            <path
              className="path L6 P26212620 P26202621"
              strokeWidth="3"
              d="M 470 375 V 350 "
            />
            <path
              className="path L6 P26202619 P26192620"
              strokeWidth="3"
              d="M 470 350 V 310 "
            />
            <path
              className="path L6 P26192618 P26182619"
              strokeWidth="3"
              d="M 470 310 V 280 "
            />
            <path
              className="path L6 P26182617 P26172618"
              strokeWidth="3"
              d="M 470 280 V 250 "
            />
            <path
              className="path L6 P26172611 P26112617"
              strokeWidth="3"
              d="M 470 250 V 205 "
            />
            <path
              className="path L6 P26112612 P26122611"
              strokeWidth="3"
              d="M 470 205 L 485 190 "
            />
            <path
              className="path L6 P26122613 P26132612"
              strokeWidth="3"
              d="M 485 190 L 500 175 "
            />
            <path
              className="path L6 P26132614 P26142613"
              strokeWidth="3"
              d="M 500 175 L 470 145 "
            />
            <path
              className="path L6 P26142615 P26152614"
              strokeWidth="3"
              d="M 470 145 L 440 175 "
            />
            <path
              className="path L6 P26152616 P26162615"
              strokeWidth="3"
              d="M 440 175 L 455 190 "
            />
            <path
              className="path L6 P26162611 P26112616"
              strokeWidth="3"
              d="M 455 190 L 470 205 "
            />
            <g className="path L6">
              <rect
                x="1210"
                y="250"
                width="10"
                height="10"
                fill="#d08d1a"
                stroke="#d08d1a"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1215"
                y="258"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                6
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#657931"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path L7 P37633762 P37623763"
              strokeWidth="3"
              d="M 40 580 H 80 Q 85 580 85 585 V 600 Q 85 605 90 605 H 100 "
            />
            <path
              className="path L7 P37623761 P37613762"
              strokeWidth="3"
              d="M 100 605 H 140 "
            />
            <path
              className="path L7 P37613760 P37603761"
              strokeWidth="3"
              d="M 140 605 L 195 550 "
            />
            <path
              className="path L7 P37603759 P37593760"
              strokeWidth="3"
              d="M 195 550 L 210 535 "
            />
            <path
              className="path L7 P37593758 P37583759"
              strokeWidth="3"
              d="M 210 535 V 515 "
            />
            <path
              className="path L7 P37583757 P37573758"
              strokeWidth="3"
              d="M 210 515 V 500 Q 210 495 215 495 H 240 "
            />
            <path
              className="path L7 P37573756 P37563757"
              strokeWidth="3"
              d="M 240 495 H 260 Q 265 495 270 500 "
            />
            <path
              className="path L7 P37563755 P37553756"
              strokeWidth="3"
              d="M 270 500 L 285 515 "
            />
            <path
              className="path L7 P37553754 P37543755"
              strokeWidth="3"
              d="M 285 515 Q 290 520 290 525 V 540 "
            />
            <path
              className="path L7 P37543753 P37533754"
              strokeWidth="3"
              d="M 290 540 V 565 "
            />
            <path
              className="path L7 P37532752 P27523753"
              strokeWidth="3"
              d="M 290 565 L 325 600 "
            />
            <path
              className="path L7 P27522751 P27512752"
              strokeWidth="3"
              d="M 325 600 L 340 615 "
            />
            <path
              className="path L7 P27512750 P27502751"
              strokeWidth="3"
              d="M 340 615 L 355 630 "
            />
            <path
              className="path L7 P27502749 P27492750"
              strokeWidth="3"
              d="M 355 630 L 360 635 Q 365 640 370 640 H 390 "
            />
            <path
              className="path L7 P27492748 P27482749"
              strokeWidth="3"
              d="M 390 640 H 415 "
            />
            <path
              className="path L7 P27482747 P27472748"
              strokeWidth="3"
              d="M 415 640 H 435 "
            />
            <path
              className="path L7 P27472746 P27462747"
              strokeWidth="3"
              d="M 435 640 H 460 "
            />
            <path
              className="path L7 P27462745 P27452746"
              strokeWidth="3"
              d="M 460 640 H 485 "
            />
            <path
              className="path L7 P27452744 P27442745"
              strokeWidth="3"
              d="M 485 640 H 520 "
            />
            <path
              className="path L7 P27442743 P27432744"
              strokeWidth="3"
              d="M 520 640 H 555 "
            />
            <path
              className="path L7 P27432742 P27422743"
              strokeWidth="3"
              d="M 555 640 H 585 "
            />
            <path
              className="path L7 P27422741 P27412742"
              strokeWidth="3"
              d="M 585 640 H 615 "
            />
            <path
              className="path L7 P27412740 P27402741"
              strokeWidth="3"
              d="M 615 640 H 650 "
            />
            <path
              className="path L7 P27402739 P27392740"
              strokeWidth="3"
              d="M 650 640 H 685 "
            />
            <path
              className="path L7 P27392738 P27382739"
              strokeWidth="3"
              d="M 685 640 H 705 "
            />
            <path
              className="path L7 P27382737 P27372738"
              strokeWidth="3"
              d="M 705 640 H 795 "
            />
            <path
              className="path L7 P27372736 P27362737"
              strokeWidth="3"
              d="M 795 640 H 860 V 645 "
            />
            <path
              className="path L7 P27362735 P27352736"
              strokeWidth="3"
              d="M 860 645 V 640 L 895 605 Q 900 600 905 600 H 940 "
            />
            <path
              className="path L7 P27352734 P27342735"
              strokeWidth="3"
              d="M 940 600 H 975 "
            />
            <path
              className="path L7 P27342733 P27332734"
              strokeWidth="3"
              d="M 975 600 H 1030 "
            />
            <path
              className="path L7 P27332732 P27322733"
              strokeWidth="3"
              d="M 1030 600 H 1060 Q 1065 600 1070 595 L 1095 570 "
            />
            <path
              className="path L7 P27322731 P27312732"
              strokeWidth="3"
              d="M 1095 570 L 1130 535 "
            />
            <path
              className="path L7 P27312730 P27302731"
              strokeWidth="3"
              d="M 1130 535 L 1160 505 "
            />
            <path
              className="path L7 P27302729 P27292730"
              strokeWidth="3"
              d="M 1160 505 Q 1165 500 1165 495 V 485 "
            />
            <path
              className="path L7 P27292728 P27282729"
              strokeWidth="3"
              d="M 1165 485 V 435 "
            />
            <path
              className="path L7 P27282727 P27272728"
              strokeWidth="3"
              d="M 1165 435 V 395 "
            />
            <path
              className="path L7 P27272726 P27262727"
              strokeWidth="3"
              d="M 1165 395 V 365 "
            />
            <path
              className="path L7 P27262725 P27252726"
              strokeWidth="3"
              d="M 1165 365 V 345 "
            />
            <path
              className="path L7 P27252724 P27242725"
              strokeWidth="3"
              d="M 1165 345 V 325 "
            />
            <path
              className="path L7 P27242723 P27232724"
              strokeWidth="3"
              d="M 1165 325 V 305 "
            />
            <path
              className="path L7 P27232722 P27222723"
              strokeWidth="3"
              d="M 1165 305 V 270 "
            />
            <path
              className="path L7 P27222721 P27212722"
              strokeWidth="3"
              d="M 1165 270 V 255 "
            />
            <path
              className="path L7 P27212720 P27202721"
              strokeWidth="3"
              d="M 1165 255 V 240 "
            />
            <path
              className="path L7 P27202719 P27192720"
              strokeWidth="3"
              d="M 1165 240 V 225 "
            />
            <path
              className="path L7 P27192718 P27182719"
              strokeWidth="3"
              d="M 1165 225 V 200 "
            />
            <path
              className="path L7 P27182717 P27172718"
              strokeWidth="3"
              d="M 1165 200 V 185 "
            />
            <path
              className="path L7 P27172716 P27162717"
              strokeWidth="3"
              d="M 1165 185 V 170 "
            />
            <path
              className="path L7 P27162715 P27152716"
              strokeWidth="3"
              d="M 1165 170 L 1150 155 "
            />
            <path
              className="path L7 P27152714 P27142715"
              strokeWidth="3"
              d="M 1150 155 L 1125 130 "
            />
            <path
              className="path L7 P27142713 P27132714"
              strokeWidth="3"
              d="M 1125 130 L 1105 110 "
            />
            <path
              className="path L7 P27132712 P27122713"
              strokeWidth="3"
              d="M 1105 110 L 1075 80 H 1070 "
            />
            <path
              className="path L7 P27122711 P27112712"
              strokeWidth="3"
              d="M 1070 80 H 1155 "
            />
            <path className="path L7" strokeWidth="3" d="M 1155 80 H 1190 " />
            <g className="path L7">
              <rect
                x="1185"
                y="75"
                width="10"
                height="10"
                fill="#657931"
                stroke="#657931"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1190"
                y="83"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                7
              </text>
              <rect
                x="180"
                y="585"
                width="10"
                height="10"
                fill="#657931"
                stroke="#657931"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="185"
                y="593"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                7
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#e74e6d"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path className="path L8" strokeWidth="3" d="M 1355 460 V 500 " />
            <path
              className="path L8 P28112812 P28122811"
              strokeWidth="3"
              d="M 1355 500 V 540 "
            />
            <path
              className="path L8 P28122813 P28132812"
              strokeWidth="3"
              d="M 1355 540 L 1325 569 "
            />
            <path
              className="path L8 P28132814 P28142813"
              strokeWidth="3"
              d="M 1325 569 L 1295 597.5 "
            />
            <path
              className="path L8 P28142815 P28152814"
              strokeWidth="3"
              d="M 1295 597.5 L 1255 635 "
            />
            <path
              className="path L8 P28152816 P28162815"
              strokeWidth="3"
              d="M 1255 635 L 1280 660 "
            />
            <path
              className="path L8 P28162817 P28172816"
              strokeWidth="3"
              d="M 1280 660 L 1305 685 "
            />
            <path
              className="path L8 P28172818 P28182817"
              strokeWidth="3"
              d="M 1305 685 L 1332.5 712.5 "
            />
            <path
              className="path L8 P28182819 P28192818"
              strokeWidth="3"
              d="M 1332.5 712.5 L 1350 730 "
            />
            <path
              className="path L8 P28192820 P28202819"
              strokeWidth="3"
              d="M 1350 730 L 1370 750 "
            />
            <path
              className="path L8 P28202821 P28212820"
              strokeWidth="3"
              d="M 1370 750 L 1385 765 "
            />
            <path
              className="path L8 P28212828 P28282821"
              strokeWidth="3"
              d="M 1385 765 L 1410 790 "
            />
            <path
              className="path L8 P28282822 P28222828"
              strokeWidth="3"
              d="M 1410 790 L 1420 800 Q 1425 805 1425 810 "
            />
            <path
              className="path L8 P28222823 P28232822"
              strokeWidth="3"
              d="M 1425 810 V 840 "
            />
            <path
              className="path L8 P28232824 P28242823"
              strokeWidth="3"
              d="M 1425 840 Q 1425 845 1420 845 H 1392.5 "
            />
            <path
              className="path L8 P28242825 P28252824"
              strokeWidth="3"
              d="M 1392.5 845 H 1355 "
            />
            <path
              className="path L8 P28252826 P28262825"
              strokeWidth="3"
              d="M 1355 845 H 1330 Q 1325 845 1320 840 L 1315 835 "
            />
            <path
              className="path L8 P28262827 P28272826"
              strokeWidth="3"
              d="M 1315 835 L 1295 805 "
            />
            <g className="path L8">
              <rect
                x="1350"
                y="455"
                width="10"
                height="10"
                fill="#e74e6d"
                stroke="#e74e6d"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1355"
                y="463"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                8
              </text>
              <rect
                x="1300"
                y="785"
                width="10"
                height="10"
                fill="#e74e6d"
                stroke="#e74e6d"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1305"
                y="793"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                8
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#be941c"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path className="path L9" strokeWidth="3" d="M 185 225 V 275 " />
            <path
              className="path L9 P41014102 P41024101"
              strokeWidth="3"
              d="M 185 275 V 295 V 305 V 340 Q 185 345 190 345 H 210 "
            />
            <path
              className="path L9 P41024103 P41034102"
              strokeWidth="3"
              d="M 210 345 H 230 "
            />
            <path
              className="path L9 P41034104 P41044103"
              strokeWidth="3"
              d="M 230 345 H 235 Q 245 345 250 350 L 255 355 "
            />
            <path
              className="path L9 P41044105 P41054104"
              strokeWidth="3"
              d="M 255 355 L 275 375 "
            />
            <path
              className="path L9 P41054106 P41064105"
              strokeWidth="3"
              d="M 275 375 L 290 390 "
            />
            <path
              className="path L9 P41064107 P41074106"
              strokeWidth="3"
              d="M 290 390 L 300 400 Q 315 415 320 415 H 330 "
            />
            <path
              className="path L9 P41074108 P41084107"
              strokeWidth="3"
              d="M 330 415 H 360 "
            />
            <path
              className="path L9 P41084109 P41094108"
              strokeWidth="3"
              d="M 360 415 H 385 "
            />
            <path
              className="path L9 P41094110 P41104109"
              strokeWidth="3"
              d="M 385 415 H 415 "
            />
            <path
              className="path L9 P41104111 P41114110"
              strokeWidth="3"
              d="M 415 415 H 425 Q 430 415 440 425 "
            />
            <path
              className="path L9 P41114112 P41124111"
              strokeWidth="3"
              d="M 440 425 L 450 435 "
            />
            <path
              className="path L9 P41124113 P41134112"
              strokeWidth="3"
              d="M 450 435 L 460 445 "
            />
            <path
              className="path L9 P41134114 P41144113"
              strokeWidth="3"
              d="M 460 445 L 487.5 470 "
            />
            <path
              className="path L9 P41144115 P41154114"
              strokeWidth="3"
              d="M 487.5 470 L 525 505 "
            />
            <path
              className="path L9 P41154116 P41164115"
              strokeWidth="3"
              d="M 525 505 L 548.5 525 "
            />
            <path
              className="path L9 P41164117 P41174116"
              strokeWidth="3"
              d="M 548.5 525 L 590 565 "
            />
            <path
              className="path L9 P41174118 P41184117"
              strokeWidth="3"
              d="M 590 565 L 615 590 "
            />
            <path
              className="path L9 P41184119 P41194118"
              strokeWidth="3"
              d="M 615 590 Q 625 600 635 600 H 660 "
            />
            <path
              className="path L9 P41194120 P41204119"
              strokeWidth="3"
              d="M 660 600 H 705 "
            />
            <path
              className="path L9 P41204121 P41214120"
              strokeWidth="3"
              d="M 705 600 H 765 "
            />
            <path
              className="path L9 P41214122 P41224121"
              strokeWidth="3"
              d="M 765 600 H 810 "
            />
            <path
              className="path L9 P41224123 P41234122"
              strokeWidth="3"
              d="M 810 600 Q 815 600 820 605 L 860 645 "
            />
            <path
              className="path L9 P41234124 P41244123"
              strokeWidth="3"
              d="M 860 645 H 935 "
            />
            <path
              className="path L9 P41244125 P41254124"
              strokeWidth="3"
              d="M 935 645 H 975 "
            />
            <path
              className="path L9 P41254126 P41264125"
              strokeWidth="3"
              d="M 975 645 H 1025 "
            />
            <path
              className="path L9 P41264127 P41274126"
              strokeWidth="3"
              d="M 1025 645 H 1050 "
            />
            <path
              className="path L9 P41274128 P41284127"
              strokeWidth="3"
              d="M 1050 645 H 1115 "
            />
            <path
              className="path L9 P41284129 P41294128"
              strokeWidth="3"
              d="M 1115 645 H 1140 Q 1145 645 1145 650 "
            />
            <path
              className="path L9 P41294130 P41304129"
              strokeWidth="3"
              d="M 1145 650 V 680 "
            />
            <path
              className="path L9 P41304131 P41314130"
              strokeWidth="3"
              d="M 1145 680 V 690 Q 1145 695 1150 695 H 1195 "
            />
            <path
              className="path L9 P41314132 P41324131"
              strokeWidth="3"
              d="M 1195 695 H 1260 "
            />
            <path
              className="path L9 P41324133 P41334132"
              strokeWidth="3"
              d="M 1260 695 H 1265 Q 1270 695 1270 690 V 680 Q 1270 675 1275 670 L 1280 665 "
            />
            <path
              className="path L9 P41334134 P41344133"
              strokeWidth="3"
              d="M 1280 665 L 1315 630 "
            />
            <path
              className="path L9 P41344135 P41354134"
              strokeWidth="3"
              d="M 1315 630 Q 1315 630 1345 600 "
            />
            <path
              className="path L9 P41354136 P41364135"
              strokeWidth="3"
              d="M 1345 600 L 1350 595 Q 1355 590 1365 590 H 1410 "
            />
            <path
              className="path L9 P41364137 P41374136"
              strokeWidth="3"
              d="M 1410 590 H 1450 "
            />
            <path
              className="path L9 P41374138 P41384137"
              strokeWidth="3"
              d="M 1450 590 H 1465 Q 1470 590 1470 585 V 565 "
            />
            <path
              className="path L9"
              strokeWidth="3"
              d="M 1470 565 V 555 V 545 "
            />
            <g className="path L9">
              <rect
                x="180"
                y="220"
                width="10"
                height="10"
                fill="#be941c"
                stroke="#be941c"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="185"
                y="228"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                9
              </text>
              <rect
                x="1465"
                y="540"
                width="10"
                height="10"
                fill="#be941c"
                stroke="#be941c"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1470"
                y="548"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="middle"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
              >
                9
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#79c0a0"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path className="path LK" strokeWidth="3" d="M 40 60 V 80 " />
            <path
              className="path LK P12851284 P12841285"
              strokeWidth="3"
              d="M 40 80 H 60 H 70 "
            />
            <path
              className="path LK P12841284 P12841284"
              strokeWidth="3"
              d="M 70 80 H 75 "
            />
            <path
              className="path LK P12841283 P12831284"
              strokeWidth="3"
              d="M 75 80 H 100 "
            />
            <path
              className="path LK P12831282 P12821283"
              strokeWidth="3"
              d="M 100 80 H 125 "
            />
            <path
              className="path LK P12821280 P12801282"
              strokeWidth="3"
              d="M 125 80 H 150 "
            />
            <path
              className="path LK P12801279 P12791280"
              strokeWidth="3"
              d="M 150 80 H 175 "
            />
            <path
              className="path LK P12791278 P12781279"
              strokeWidth="3"
              d="M 175 80 H 200 "
            />
            <path
              className="path LK P12781277 P12771278"
              strokeWidth="3"
              d="M 200 80 H 225 "
            />
            <path
              className="path LK P12771276 P12761277"
              strokeWidth="3"
              d="M 225 80 H 250 "
            />
            <path
              className="path LK P12761275 P12751276"
              strokeWidth="3"
              d="M 250 80 H 260 Q 265 80 265 85 V 90 "
            />
            <path
              className="path LK P12751274 P12741275"
              strokeWidth="3"
              d="M 265 90 V 110 "
            />
            <path
              className="path LK P12741273 P12731274"
              strokeWidth="3"
              d="M 265 110 V 130 "
            />
            <path
              className="path LK P12731272 P12721273"
              strokeWidth="3"
              d="M 265 130 V 150 "
            />
            <path
              className="path LK P12720300 P03001272"
              strokeWidth="3"
              d="M 265 150 V 175 "
            />
            <path
              className="path LK P03001271 P12710300"
              strokeWidth="3"
              d="M 265 175 V 190 Q 265 195 270 200 L 280 210 "
            />
            <path
              className="path LK P12711270 P12701271"
              strokeWidth="3"
              d="M 280 210 L 300 230 "
            />
            <path
              className="path LK P12701269 P12691270"
              strokeWidth="3"
              d="M 300 230 L 325 255 "
            />
            <path
              className="path LK P12691268 P12681269"
              strokeWidth="3"
              d="M 325 255 L 345 275 "
            />
            <path
              className="path LK P12681267 P12671268"
              strokeWidth="3"
              d="M 345 275 L 365 295 "
            />
            <path
              className="path LK P12671266 P12661267"
              strokeWidth="3"
              d="M 365 295 L 380 310 Q 385 315 390 315 H 470 V 310 "
            />
            <path
              className="path LK P12661265 P12651266"
              strokeWidth="3"
              d="M 470 310 V 315 H 495 "
            />
            <path
              className="path LK P12651252 P12521265"
              strokeWidth="3"
              d="M 495 315 H 525 "
            />
            <path
              className="path LK P12521251 P12511252"
              strokeWidth="3"
              d="M 525 315 H 535 Q 540 315 545 320 L 605 380 Q 610 385 615 385 H 652 "
            />
            <path
              className="path LK P12651264 P12641265"
              strokeWidth="3"
              d="M 495 315 L 495 340 V 350 Q 495 355 500 360 L 550 410 "
            />
            <path
              className="path LK P12641263 P12631264"
              strokeWidth="3"
              d="M 550 410 V 440 "
            />
            <path
              className="path LK P12631262 P12621263"
              strokeWidth="3"
              d="M 550 440 V 465 Q 550 470 555 470 H 605 V 475 "
            />
            <path
              className="path LK P12621261 P12611262"
              strokeWidth="3"
              d="M 605 475 V 470 H 635 "
            />
            <path
              className="path LK P1261100C P100C1261"
              strokeWidth="3"
              d="M 635 470 V 540 Q 635 545 640 545 H 655 "
            />
            <path
              className="path LK P100C1008 P1008100C"
              strokeWidth="3"
              d="M 655 545 H 705 "
            />
            <path
              className="path LK P10081009 P10091008"
              strokeWidth="3"
              d="M 705 545 H 780 "
            />
            <path
              className="path LK P10091010 P10101009"
              strokeWidth="3"
              d="M 780 545 H 825 "
            />
            <path
              className="path LK P10101011 P10111010"
              strokeWidth="3"
              d="M 825 545 H 840 Q 845 545 850 540 L 860 530 "
            />
            <path
              className="path LK P10111012 P10121011"
              strokeWidth="3"
              d="M 860 530 L 925 465 "
            />
            <path
              className="path LK P10121013 P10131012"
              strokeWidth="3"
              d="M 925 465 L 990 400 V 390 "
            />
            <path
              className="path LK P10131014 P10141013"
              strokeWidth="3"
              d="M 990 390 V 290 Q 990 285 995 285 "
            />
            <path
              className="path LK P1014101C P101C1014"
              strokeWidth="3"
              d="M 995 285 H 1030 V 285 "
            />
            <path
              className="path LK P101C1201 P1201101C"
              strokeWidth="3"
              d="M 1030 285 H 1105 V 285 "
            />
            <path
              className="path LK P12011202 P12021201"
              strokeWidth="3"
              d="M 1105 285 H 1165 V 285 "
            />
            <path
              className="path LK P12021203 P12031202"
              strokeWidth="3"
              d="M 1165 285 H 1240 V 285 "
            />
            <path
              className="path LK P12031204 P12041203"
              strokeWidth="3"
              d="M 1240 285 H 1275 "
            />
            <path
              className="path LK P12041205 P12051204"
              strokeWidth="3"
              d="M 1275 285 H 1300 "
            />
            <path
              className="path LK P12051206 P12061205"
              strokeWidth="3"
              d="M 1300 285 H 1325 "
            />
            <path
              className="path LK P12061207 P12071206"
              strokeWidth="3"
              d="M 1325 285 H 1350 "
            />
            <path
              className="path LK P12071208 P12081207"
              strokeWidth="3"
              d="M 1350 285 H 1375 "
            />
            <path
              className="path LK P12081209 P12091208"
              strokeWidth="3"
              d="M 1375 285 H 1400 "
            />
            <path
              className="path LK P12091210 P12101209"
              strokeWidth="3"
              d="M 1400 285 H 1430 Q 1435 285 1435 290 V 300 "
            />
            <path
              className="path LK P12101211 P12111210"
              strokeWidth="3"
              d="M 1435 300 V 320 "
            />
            <path
              className="path LK P12111212 P12121211"
              strokeWidth="3"
              d="M 1435 320 V 340 "
            />
            <path
              className="path LK P12121213 P12131212"
              strokeWidth="3"
              d="M 1435 340 V 360 "
            />
            <path
              className="path LK P12131214 P12141213"
              strokeWidth="3"
              d="M 1435 360 V 370 Q 1435 375 1430 375 H 1400 "
            />
            <path
              className="path LK P12141215 P12151214"
              strokeWidth="3"
              d="M 1400 375 H 1375 "
            />
            <path
              className="path LK P12151216 P12161215"
              strokeWidth="3"
              d="M 1375 375 H 1350 "
            />
            <path
              className="path LK P12161217 P12171216"
              strokeWidth="3"
              d="M 1350 375 H 1325 "
            />
            <path
              className="path LK P12171218 P12181217"
              strokeWidth="3"
              d="M 1325 375 H 1300 "
            />
            <path
              className="path LK P12181219 P12191218"
              strokeWidth="3"
              d="M 1300 375 H 1275 "
            />
            <path
              className="path LK P12191220 P12201219"
              strokeWidth="3"
              d="M 1275 375 H 1250 "
            />
            <path className="path LK" strokeWidth="3" d="M 1250 375 H 1215 " />
            <g className="path LK">
              <rect
                x="24"
                y="55"
                width="32"
                height="10"
                fill="#79c0a0"
                stroke="#79c0a0"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="24"
                y="63"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="32"
              >
                경의·중앙
              </text>
              <rect
                x="1199"
                y="370"
                width="32"
                height="10"
                fill="#79c0a0"
                stroke="#79c0a0"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="1199"
                y="378"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="32"
              >
                경의·중앙
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#f8ce49"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path LB P18911890 P18901891"
              strokeWidth="3"
              d="M 220 800 H 255 "
            />
            <path
              className="path LB P18901889 P18891890"
              strokeWidth="3"
              d="M 255 800 H 260 Q 270.19230769230825 800 275 805 "
            />
            <path
              className="path LB P18891888 P18881889"
              strokeWidth="3"
              d="M 275 805 L 287.5 818 "
            />
            <path
              className="path LB P18881886 P18861888"
              strokeWidth="3"
              d="M 287.5 818 L 300 831.5 "
            />
            <path
              className="path LB P18861885 P18851886"
              strokeWidth="3"
              d="M 300 831.5 L 312.5 845 "
            />
            <path
              className="path LB P18851884 P18841885"
              strokeWidth="3"
              d="M 312.5 845 L 320 855 "
            />
            <path
              className="path LB P18841883 P18831884"
              strokeWidth="3"
              d="M 320 855 V 895 Q 320 900 315 900 H 285 "
            />
            <path
              className="path LB P18831882 P18821883"
              strokeWidth="3"
              d="M 285 900 H 245 "
            />
            <path
              className="path LB P18821881 P18811882"
              strokeWidth="3"
              d="M 245 900 H 205 "
            />
            <path
              className="path LB P18811880 P18801881"
              strokeWidth="3"
              d="M 205 900 H 160 "
            />
            <path
              className="path LB P18801879 P18791880"
              strokeWidth="3"
              d="M 160 900 H 120 "
            />
            <path
              className="path LB P18791878 P18781879"
              strokeWidth="3"
              d="M 120 900 H 105 Q 100 900 100 905 V 920 "
            />
            <path
              className="path LB P18781800 P18001878"
              strokeWidth="3"
              d="M 100 920 V 950 "
            />
            <path
              className="path LB P18001836 P18361800"
              strokeWidth="3"
              d="M 100 950 H 155 "
            />
            <path
              className="path LB P18361835 P18351836"
              strokeWidth="3"
              d="M 155 950 H 195 "
            />
            <path
              className="path LB P18351834 P18341835"
              strokeWidth="3"
              d="M 195 950 H 230 "
            />
            <path
              className="path LB P18341833 P18331834"
              strokeWidth="3"
              d="M 230 950 H 260 "
            />
            <path
              className="path LB P18331832 P18321833"
              strokeWidth="3"
              d="M 260 950 H 290 "
            />
            <path
              className="path LB P18321831 P18311832"
              strokeWidth="3"
              d="M 290 950 H 320 "
            />
            <path
              className="path LB P18311830 P18301831"
              strokeWidth="3"
              d="M 320 950 H 350 "
            />
            <path
              className="path LB P18301877 P18771830"
              strokeWidth="3"
              d="M 350 950 V 960 Q 350 965 355 965 H 400 "
            />
            <path
              className="path LB P18771876 P18761877"
              strokeWidth="3"
              d="M 400 965 H 455 "
            />
            <path
              className="path LB P18761875 P18751876"
              strokeWidth="3"
              d="M 455 965 H 510 "
            />
            <path
              className="path LB P18751874 P18741875"
              strokeWidth="3"
              d="M 510 965 H 565 "
            />
            <path
              className="path LB P18741873 P18731874"
              strokeWidth="3"
              d="M 565 965 H 620 "
            />
            <path
              className="path LB P18731846 P18461873"
              strokeWidth="3"
              d="M 620 965 H 665 Q 670 965 670 960 V 950 "
            />
            <path
              className="path LB P18461872 P18721846"
              strokeWidth="3"
              d="M 670 950 V 910 "
            />
            <path
              className="path LB P18721871 P18711872"
              strokeWidth="3"
              d="M 670 910 V 890 "
            />
            <path
              className="path LB P18711870 P18701871"
              strokeWidth="3"
              d="M 670 890 V 875 Q 670 870 675 870 H 695 "
            />
            <path
              className="path LB P18701869 P18691870"
              strokeWidth="3"
              d="M 695 870 H 735 "
            />
            <path
              className="path LB P18691868 P18681869"
              strokeWidth="3"
              d="M 735 870 H 770 "
            />
            <path
              className="path LB P18681867 P18671868"
              strokeWidth="3"
              d="M 770 870 H 800 "
            />
            <path
              className="path LB P18671866 P18661867"
              strokeWidth="3"
              d="M 800 870 H 835 "
            />
            <path
              className="path LB P18661865 P18651866"
              strokeWidth="3"
              d="M 835 870 H 865 "
            />
            <path
              className="path LB P18651864 P18641865"
              strokeWidth="3"
              d="M 865 870 H 895 "
            />
            <path
              className="path LB P18641863 P18631864"
              strokeWidth="3"
              d="M 895 870 H 940 "
            />
            <path
              className="path LB P18631861 P18611863"
              strokeWidth="3"
              d="M 940 870 H 975 "
            />
            <path
              className="path LB P18611862 P18621861"
              strokeWidth="3"
              d="M 975 870 H 1010 "
            />
            <path
              className="path LB P18621859 P18591862"
              strokeWidth="3"
              d="M 1010 870 H 1045 "
            />
            <path
              className="path LB P18591858 P18581859"
              strokeWidth="3"
              d="M 1045 870 Q 1050 870 1055 865 L 1070 850 "
            />
            <path
              className="path LB P18581857 P18571858"
              strokeWidth="3"
              d="M 1070 850 L 1090 830 "
            />
            <path
              className="path LB P18571856 P18561857"
              strokeWidth="3"
              d="M 1090 830 L 1110 810 Q 1115 805 1120 805 H 1135 "
            />
            <path
              className="path LB P18561855 P18551856"
              strokeWidth="3"
              d="M 1135 805 H 1170 "
            />
            <path
              className="path LB P18551860 P18601855"
              strokeWidth="3"
              d="M 1170 805 H 1210 "
            />
            <path
              className="path LB P18601854 P18541860"
              strokeWidth="3"
              d="M 1210 805 H 1245 "
            />
            <path
              className="path LB P18541853 P18531854"
              strokeWidth="3"
              d="M 1245 805 H 1295 "
            />
            <path
              className="path LB P18531852 P18521853"
              strokeWidth="3"
              d="M 1295 805 H 1330 "
            />
            <path
              className="path LB P18521851 P18511852"
              strokeWidth="3"
              d="M 1330 805 H 1335 Q 1340 805 1345 800 L 1360 785 "
            />
            <path
              className="path LB P18511031 P10311851"
              strokeWidth="3"
              d="M 1360 785 L 1380 765 H 1385 "
            />
            <path
              className="path LB P10311030 P10301031"
              strokeWidth="3"
              d="M 1385 765 H 1285 "
            />
            <path
              className="path LB P10301028 P10281030"
              strokeWidth="3"
              d="M 1285 765 H 1195 "
            />
            <path
              className="path LB P10281027 P10271028"
              strokeWidth="3"
              d="M 1195 765 H 1135 "
            />
            <path
              className="path LB P10271026 P10261027"
              strokeWidth="3"
              d="M 1135 765 H 1075 "
            />
            <path
              className="path LB P10261025 P10251026"
              strokeWidth="3"
              d="M 1075 765 H 1020 Q 1015 765 1015 760 V 725 "
            />
            <path
              className="path LB P10251024 P10241025"
              strokeWidth="3"
              d="M 1015 725 V 700 "
            />
            <path
              className="path LB P10241023 P10231024"
              strokeWidth="3"
              d="M 1015 700 V 680 "
            />
            <path
              className="path LB P10231850 P18501023"
              strokeWidth="3"
              d="M 1015 680 L 1050 645 "
            />
            <path
              className="path LB P18501849 P18491850"
              strokeWidth="3"
              d="M 1050 645 L 1090 605 Q 1095 600 1095 595 V 570 "
            />
            <path
              className="path LB P18491848 P18481849"
              strokeWidth="3"
              d="M 1095 570 L 1060 535 "
            />
            <path
              className="path LB P18481847 P18471848"
              strokeWidth="3"
              d="M 1060 535 L 1010 485 "
            />
            <path
              className="path LB P1847102C P102C1847"
              strokeWidth="3"
              d="M 1010 485 L 995 470 Q 990 465 990 460 V 390 "
            />
            <path
              className="path LB P102C1845 P1845102C"
              strokeWidth="3"
              d="M 990 390 H 995 V 405 V 275 "
            />
            <g className="path LB">
              <rect
                x="205"
                y="815"
                width="20"
                height="10"
                fill="#f8ce49"
                stroke="#f8ce49"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="205"
                y="823"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="20"
              >
                수인분당
              </text>
              <rect
                x="690"
                y="885"
                width="20"
                height="10"
                fill="#f8ce49"
                stroke="#f8ce49"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="690"
                y="893"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="20"
              >
                수인분당
              </text>
            </g>
          </g>
          <g
            className="line"
            fill="none"
            stroke="#cd2234"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path LS P43044305 P43054304"
              strokeWidth="3"
              d="M 860 595 L 885 580 Q 893.3333333333333 575 905 575 H 970 Q 975 575 975 580 V 605 "
            />
            <path
              className="path LS P43054306 P43064305"
              strokeWidth="3"
              d="M 975 605 V 650 "
            />
            <path
              className="path LS P43064307 P43074306"
              strokeWidth="3"
              d="M 975 650 L 920 680 "
            />
            <path
              className="path LS P43074308 P43084307"
              strokeWidth="3"
              d="M 920 680 V 725 "
            />
            <path
              className="path LS P43084309 P43094308"
              strokeWidth="3"
              d="M 920 725 V 760 Q 920 765 925 770 L 930 775 "
            />
            <path
              className="path LS P43094310 P43104309"
              strokeWidth="3"
              d="M 930 775 L 950 795 Q 955 800 960 800 H 980 "
            />
            <path
              className="path LS P43104311 P43114310"
              strokeWidth="3"
              d="M 980 800 H 1045 "
            />
            <path
              className="path LS P43114312 P43124311"
              strokeWidth="3"
              d="M 1045 800 L 1082.5 828.5 V 830 "
            />
            <path
              className="path LS P43124313 P43134312"
              strokeWidth="3"
              d="M 1084 830 L 1065 849 "
            />
            <path
              className="path LS P43134314 P43144313"
              strokeWidth="3"
              d="M 1065 849 L 1045 835 "
            />
            <path
              className="path LS P43144315 P43154314"
              strokeWidth="3"
              d="M 1045 835 H 1010 "
            />
            <path
              className="path LS P43154316 P43164315"
              strokeWidth="3"
              d="M 1010 835 H 975 "
            />
            <path
              className="path LS P43164317 P43174316"
              strokeWidth="3"
              d="M 975 835 H 940 "
            />
            <path
              className="path LS P43174318 P43184317"
              strokeWidth="3"
              d="M 940 835 H 905 "
            />
            <path
              className="path LS P43184319 P43194318"
              strokeWidth="3"
              d="M 905 835 H 870 "
            />
            <path className="path LS" strokeWidth="3" d="M 870 835 H 820 " />
            <g className="path LS">
              <rect
                x="810"
                y="830"
                width="20"
                height="10"
                fill="#cd2234"
                stroke="#cd2234"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="810"
                y="838"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="20"
              >
                신분당
              </text>
            </g>
          </g>

          <g
            className="line"
            fill="none"
            stroke="#878787"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path LW P47134712 P47124713"
              strokeWidth="3"
              d="M 940 275 L 900 235 "
            />
            <path
              className="path LW P47124711 P47114712"
              strokeWidth="3"
              d="M 900 235 L 875 210 Q 870 205 870 200 V 170 "
            />
            <path
              className="path LW P47114710 P47104711"
              strokeWidth="3"
              d="M 870 170 L 840 140 "
            />
            <path
              className="path LW P47104709 P47094710"
              strokeWidth="3"
              d="M 840 140 Q 835 135 830 135 H 815 "
            />
            <path
              className="path LW P47094708 P47084709"
              strokeWidth="3"
              d="M 815 135 H 780 "
            />
            <path
              className="path LW P47084707 P47074708"
              strokeWidth="3"
              d="M 780 135 H 745 "
            />
            <path
              className="path LW P47074706 P47064707"
              strokeWidth="3"
              d="M 745 135 H 710 "
            />
            <path
              className="path LW P47064705 P47054706"
              strokeWidth="3"
              d="M 710 135 H 680 "
            />
            <path
              className="path LW P47054704 P47044705"
              strokeWidth="3"
              d="M 680 135 H 650 "
            />
            <path
              className="path LW P47044703 P47034704"
              strokeWidth="3"
              d="M 650 135 H 610 "
            />
            <path
              className="path LW P47034702 P47024703"
              strokeWidth="3"
              d="M 610 135 H 605 Q 600 135 595 130 L 575 110 "
            />
            <path
              className="path LW P47024701 P47014702"
              strokeWidth="3"
              d="M 575 110 L 565 100 Q 560 95 555 95 H 525 "
            />
            <path className="path LW" strokeWidth="3" d="M 525 95 H 455 " />
            <g className="path LW">
              <rect
                x="431.5"
                y="90"
                width="47"
                height="10"
                fill="#878787"
                stroke="#878787"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="431.5"
                y="98"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="47"
              >
                우이신설경전철
              </text>
            </g>
          </g>

          <g
            className="line"
            fill="none"
            stroke="#3399FF"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              className="path LSL P44014402 P44024401"
              strokeWidth="3"
              d="M 543.5 525 L 512.5 550 "
            />
            <path
              className="path LSL P44024403 P44034402"
              strokeWidth="3"
              d="M 512.5 550 V 595 "
            />
            <path
              className="path LSL P44034404 P44044403"
              strokeWidth="3"
              d="M 512.5 595 V 610 Q 512.5 615 515 615 H 520 Q 525 615 525 620 V 640 "
            />
            <path
              className="path LSL P44044405 P44054404"
              strokeWidth="3"
              d="M 525 640 V 650 "
            />
            <path
              className="path LSL P44054406 P44064405"
              strokeWidth="3"
              d="M 525 650 Q 525 655 530 660 "
            />
            <path
              className="path LSL P44064407 P44074406"
              strokeWidth="3"
              d="M 530 660 L 540 670 "
            />
            <path
              className="path LSL P44074408 P44084407"
              strokeWidth="3"
              d="M 540 670 L 550 680 "
            />
            <path
              className="path LSL P44084409 P44094408"
              strokeWidth="3"
              d="M 550 680 L 575 710 "
            />
            <path
              className="path LSL P44094410 P44104409"
              strokeWidth="3"
              d="M 575 710 L 585 720 Q 590 725 595 725 H 605 "
            />
            <path
              className="path LSL P44104411 P44114410"
              strokeWidth="3"
              d="M 605 725 H 635 "
            />
            <path className="path LSL" strokeWidth="3" d="M 635 725 H 675 " />
            <g className="path LSL">
              <rect
                x="666"
                y="720"
                width="18"
                height="10"
                fill="#3399FF"
                stroke="#3399FF"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <text
                x="666"
                y="728"
                lengthAdjust="spacingAndGlyphs"
                textAnchor="start"
                style={{
                  fill: "white",
                  stroke: "white",
                  strokeWidth: "0.6",
                  fontSize: "9px",
                  lineHeight: "10px"
                }}
                textLength="18"
              >
                신림
              </text>
            </g>
          </g>
          {/* <!-- 마커 --> */}
          <g className="marker-group" transform-origin="50% 50% 0">
            <circle
              className="marker M1916 L1"
              cx="645"
              cy="65"
              r="1.5"
              id="M1916"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1915 L1"
              cx="680"
              cy="65"
              r="1.5"
              id="M1915"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1914 L1"
              cx="710"
              cy="65"
              r="1.5"
              id="M1914"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1913 L1"
              cx="742.5"
              cy="65"
              r="1.5"
              id="M1913"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1912 L1"
              cx="775"
              cy="65"
              r="1.5"
              id="M1912"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1911 L1"
              cx="805"
              cy="65"
              r="1.5"
              id="M1911"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1910 L1"
              cx="840"
              cy="65"
              r="1.5"
              id="M1910"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1909 L1"
              cx="870"
              cy="65"
              r="1.5"
              id="M1909"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1908 L1"
              cx="902.5"
              cy="65"
              r="1.5"
              id="M1908"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1907 L1"
              cx="935"
              cy="65"
              r="1.5"
              id="M1907"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1906 L1"
              cx="965"
              cy="65"
              r="1.5"
              id="M1906"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1905 L1 interchange M4602 LU"
              cx="992.5"
              cy="65"
              id="M1905"
            >
              <rect
                x="989.5"
                y="62"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="992.5"
                cy="65"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="992.5"
                cy="70"
                r="1.5"
                stroke="#e0b531"
                strokeWidth="1"
                fill="#e0b531"
              />
            </g>
            <circle
              className="marker M1904 L1"
              cx="1030"
              cy="65"
              r="1.5"
              id="M1904"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1903 L1 interchange M2712 L7"
              cx="1070"
              cy="80"
              id="M1903"
            >
              <rect
                x="1067"
                y="77"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1070"
                cy="80"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="1075"
                cy="80"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M1902 L1"
              cx="1070"
              cy="100"
              r="1.5"
              id="M1902"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1901 L1"
              cx="1070"
              cy="120"
              r="1.5"
              id="M1901"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1022 L1 interchange M0412 L4"
              cx="1070"
              cy="155"
              id="M0412"
            >
              <rect
                x="1067"
                y="152"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1070"
                cy="155"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="1075"
                cy="155"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
            </g>
            <circle
              className="marker M1021 L1"
              cx="1070"
              cy="172.5"
              r="1.5"
              id="M1021"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1020 L1"
              cx="1070"
              cy="190"
              r="1.5"
              id="M1020"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1019 L1 interchange M LG"
              cx="1070"
              cy="210"
              id="M1019"
            >
              <rect
                x="1067"
                y="207"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1070"
                cy="210"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="1075"
                cy="210"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
            </g>
            <g
              className="marker M1018 L1 interchange M2645 L6"
              cx="1070"
              cy="225"
              id="M1018"
            >
              <rect
                x="1067"
                y="222"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1070"
                cy="225"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="1075"
                cy="225"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <circle
              className="marker M1017 L1"
              cx="1065"
              cy="245"
              r="1.5"
              id="M1017"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1016 L1"
              cx="1050"
              cy="260"
              r="1.5"
              id="M1016"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1015 L1 interchange M1307 LG M101C LK"
              cx="1030"
              cy="275"
              id="M1015"
            >
              <rect
                x="1027"
                y="272"
                width="6"
                height="16"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1030"
                cy="275"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="1030"
                cy="280"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
              <circle
                cx="1030"
                cy="285"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <g
              className="marker M0158 L1 interchange M1306 LG M1014 LK M1845 LB"
              cx="995"
              cy="275"
              id="M0158"
            >
              <rect
                x="992"
                y="272"
                width="6"
                height="21"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="995"
                cy="275"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="995"
                cy="280"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
              <circle
                cx="995"
                cy="285"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="995"
                cy="290"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M0157 L1"
              cx="960"
              cy="275"
              r="1.5"
              id="M0157"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0156 L1 interchange M0246 L2 M4713 LW"
              cx="930"
              cy="275"
              id="M0156"
            >
              <rect
                x="927"
                y="272"
                width="16"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="930"
                cy="275"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="935"
                cy="275"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="940"
                cy="275"
                r="1.5"
                stroke="#878787"
                strokeWidth="1"
                fill="#878787"
              />
            </g>
            <g
              className="marker M0159 L1 interchange M2637 L6"
              cx="900"
              cy="275"
              id="M0159"
            >
              <rect
                x="897"
                y="267"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="900"
                cy="275"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="900"
                cy="270"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <g
              className="marker M0155 L1 interchange M0421 L4"
              cx="865"
              cy="275"
              id="M0155"
            >
              <rect
                x="862"
                y="267"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="865"
                cy="275"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="865"
                cy="270"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
            </g>
            <circle
              className="marker M0154 L1"
              cx="795"
              cy="275"
              r="1.5"
              id="M0154"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0153 L1 interchange M0319 L3 M2535 L5"
              cx="715"
              cy="275"
              id="M0153"
            >
              <rect
                x="712"
                y="272"
                width="16"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="715"
                cy="275"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="720"
                cy="275"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="725"
                cy="275"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <circle
              className="marker M0152 L1"
              cx="680"
              cy="310"
              r="1.5"
              id="M0152"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0151 L1 interchange M0201 L2"
              cx="655"
              cy="345"
              id="M0151"
            >
              <rect
                x="647"
                y="342"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="655"
                cy="345"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="650"
                cy="345"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
            </g>
            <g
              className="marker M0150 L1 interchange M0426 L4 M4201 LA M1251 LK"
              cx="655"
              cy="400"
              id="M0150"
            >
              <rect
                x="652"
                y="381"
                width="6"
                height="32"
                stroke="black"
                strokeWidth="1"
                fill="#000000"
              />
              <circle
                cx="655"
                cy="392"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="655"
                cy="400"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="655"
                cy="408"
                r="1.5"
                stroke="#038fa0"
                strokeWidth="1"
                fill="#038fa0"
              />
              <circle
                cx="655"
                cy="385"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M1002 L1"
              cx="655"
              cy="440"
              r="1.5"
              id="M1002"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1003 L1 interchange M100C LK"
              cx="655"
              cy="545"
              id="M1003"
            >
              <rect
                x="652"
                y="537"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="655"
                cy="540"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="655"
                cy="545"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <g
              className="marker M1004 L1 interchange M4117 L9"
              cx="590"
              cy="565"
              id="M1004"
            >
              <rect
                x="587"
                y="562"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="595"
                cy="565"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="590"
                cy="565"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <g
              className="marker M1005 L1 interchange M4402 LSL"
              cx="512.5"
              cy="545"
              id="M1005"
            >
              <rect
                x="509.5"
                y="542"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="512.5"
                cy="545"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="512.5"
                cy="550"
                r="1.5"
                stroke="#3399FF"
                strokeWidth="1"
                fill="#3399FF"
              />
            </g>
            <g
              className="marker M1032 L1 interchange M2526 L5"
              cx="475"
              cy="515"
              id="M1032"
            >
              <rect
                x="472"
                y="512"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="475"
                cy="515"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="480"
                cy="515"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <circle
              className="marker M1006 L1"
              cx="460"
              cy="530"
              r="1.5"
              id="M1006"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1007 L1 interchange M0234 L2"
              cx="440"
              cy="550"
              id="M1007"
            >
              <rect
                x="432"
                y="547"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="440"
                cy="550"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="435"
                cy="550"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
            </g>
            <g
              className="marker M1701 L1 interchange"
              cx="415"
              cy="575"
              id="M1701"
            >
              <rect
                x="412"
                y="572"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="415"
                cy="575"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="415"
                cy="580"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
            </g>
            <circle
              className="marker M1813 L1"
              cx="400"
              cy="590"
              r="1.5"
              id="M1813"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1801 L1"
              cx="380"
              cy="595"
              r="1.5"
              id="M1801"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1802 L1"
              cx="355"
              cy="595"
              r="1.5"
              id="M1802"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1821 L1 interchange M2752 L7"
              cx="330"
              cy="600"
              id="M1821"
            >
              <rect
                x="322"
                y="597"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="330"
                cy="600"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="325"
                cy="600"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M1803 L1"
              cx="305"
              cy="625"
              r="1.5"
              id="M1803"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1814 L1 interchange M4804 LSH"
              cx="285"
              cy="645"
              id="M1814"
            >
              <rect
                x="282"
                y="642"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="285"
                cy="645"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="285"
                cy="650"
                r="1.5"
                stroke="#8be800"
                strokeWidth="1"
                fill="#8be800"
              />
            </g>
            <circle
              className="marker M1804 L1"
              cx="255"
              cy="670"
              r="1.5"
              id="M1804"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1822 L1"
              cx="222.5"
              cy="670"
              r="1.5"
              id="M1822"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1805 L1"
              cx="195"
              cy="670"
              r="1.5"
              id="M1805"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1815 L1"
              cx="167.5"
              cy="670"
              r="1.5"
              id="M1815"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1806 L1 interchange M3120 LI"
              cx="140"
              cy="670"
              id="M1806"
            >
              <rect
                x="137"
                y="667"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="145"
                cy="670"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="140"
                cy="670"
                r="1.5"
                stroke="#6496df"
                strokeWidth="1"
                fill="#6496df"
              />
            </g>
            <circle
              className="marker M1807 L1"
              cx="115"
              cy="670"
              r="1.5"
              id="M1807"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1808 L1"
              cx="95"
              cy="697.5"
              r="1.5"
              id="M1808"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1816 L1"
              cx="95"
              cy="715"
              r="1.5"
              id="M1816"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1809 L1 interchange M3218 LI2"
              cx="95"
              cy="735"
              id="M1809"
            >
              <rect
                x="92"
                y="732"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="95"
                cy="740"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="95"
                cy="735"
                r="1.5"
                stroke="#fd9800"
                strokeWidth="1"
                fill="#fd9800"
              />
            </g>
            <circle
              className="marker M1823 L1"
              cx="95"
              cy="760"
              r="1.5"
              id="M1823"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1810 L1"
              cx="125"
              cy="800"
              r="1.5"
              id="M1810"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1817 L1"
              cx="155"
              cy="800"
              r="1.5"
              id="M1817"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1811 L1"
              cx="185"
              cy="800"
              r="1.5"
              id="M1811"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1812 L1 interchange M1891 LB"
              cx="220"
              cy="800"
              id="M1812"
            >
              <rect
                x="217"
                y="797"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="220"
                cy="800"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="225"
                cy="800"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1702 L1 interchange M2748 L7"
              cx="415"
              cy="640"
              id="M1702"
            >
              <rect
                x="412"
                y="632"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="415"
                cy="635"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="415"
                cy="640"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M1714 L1"
              cx="415"
              cy="685"
              r="1.5"
              id="M1714"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1703 L1 interchange"
              cx="415"
              cy="720"
              id="M1703"
            >
              <rect
                x="412"
                y="712"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="415"
                cy="720"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="415"
                cy="715"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
            </g>
            <circle
              className="marker M1750 L1"
              cx="390"
              cy="700"
              r="1.5"
              id="M1750"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1704 L1"
              cx="470"
              cy="720"
              r="1.5"
              id="M1704"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1705 L1"
              cx="515"
              cy="750"
              r="1.5"
              id="M1705"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1706 L1"
              cx="515"
              cy="790"
              r="1.5"
              id="M1706"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1707 L1"
              cx="515"
              cy="830"
              r="1.5"
              id="M1707"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1708 L1 interchange M1458 L4"
              cx="515"
              cy="860"
              id="M1708"
            >
              <rect
                x="512"
                y="857"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="515"
                cy="865"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="515"
                cy="860"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
            </g>
            <circle
              className="marker M1709 L1"
              cx="530"
              cy="910"
              r="1.5"
              id="M1709"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1729 L1"
              cx="550"
              cy="930"
              r="1.5"
              id="M1729"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1710 L1"
              cx="585"
              cy="950"
              r="1.5"
              id="M1710"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1711 L1"
              cx="620"
              cy="950"
              r="1.5"
              id="M1711"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1712 L1"
              cx="647.5"
              cy="950"
              r="1.5"
              id="M1712"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1713 L1 interchange M1846 LB"
              cx="670"
              cy="950"
              id="M1713"
            >
              <rect
                x="667"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="670"
                cy="950"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="670"
                cy="945"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M1715 L1"
              cx="697.5"
              cy="950"
              r="1.5"
              id="M1715"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1716 L1 interchange"
              cx="730"
              cy="950"
              id="M1716"
            >
              <rect
                x="727"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="730"
                cy="950"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
              <circle
                cx="730"
                cy="945"
                r="1.5"
                stroke="#052f93"
                strokeWidth="1"
                fill="#052f93"
              />
            </g>
            <circle
              className="marker M1717 L1"
              cx="760"
              cy="950"
              r="1.5"
              id="M1717"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1718 L1"
              cx="795"
              cy="950"
              r="1.5"
              id="M1718"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1719 L1"
              cx="825"
              cy="950"
              r="1.5"
              id="M1719"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1720 L1"
              cx="855"
              cy="950"
              r="1.5"
              id="M1720"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1721 L1"
              cx="885"
              cy="950"
              r="1.5"
              id="M1721"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1722 L1"
              cx="917.5"
              cy="950"
              r="1.5"
              id="M1722"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1723 L1"
              cx="950"
              cy="950"
              r="1.5"
              id="M1723"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1724 L1"
              cx="980"
              cy="950"
              r="1.5"
              id="M1724"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1725 L1"
              cx="1010"
              cy="950"
              r="1.5"
              id="M1725"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1726 L1"
              cx="1040"
              cy="950"
              r="1.5"
              id="M1726"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1727 L1"
              cx="1070"
              cy="950"
              r="1.5"
              id="M1727"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1728 L1"
              cx="1100"
              cy="950"
              r="1.5"
              id="M1728"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1401 L1"
              cx="1130"
              cy="950"
              r="1.5"
              id="M1401"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1402 L1"
              cx="1165"
              cy="950"
              r="1.5"
              id="M1402"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1403 L1"
              cx="1197.5"
              cy="950"
              r="1.5"
              id="M1403"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1404 L1"
              cx="1230"
              cy="950"
              r="1.5"
              id="M1404"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1405 L1"
              cx="1270"
              cy="950"
              r="1.5"
              id="M1405"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1407 L1"
              cx="1310"
              cy="950"
              r="1.5"
              id="M1407"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1408 L1"
              cx="1350"
              cy="950"
              r="1.5"
              id="M1408"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1749 L1"
              cx="730"
              cy="920"
              r="1.5"
              id="M1749"
              stroke="#052f93"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0200 L2 interchange M2519 L5"
              cx="290"
              cy="460"
              id="M0200"
            >
              <rect
                x="282"
                y="457"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="290"
                cy="460"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="285"
                cy="460"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <circle
              className="marker M0249 L2"
              cx="325"
              cy="495"
              r="1.5"
              id="M0249"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0248 L2"
              cx="345"
              cy="515"
              r="1.5"
              id="M0248"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0247 L2"
              cx="365"
              cy="535"
              r="1.5"
              id="M0247"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0235 L2"
              cx="415"
              cy="500"
              r="1.5"
              id="M0235"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0236 L2 interchange M2524 L5"
              cx="415"
              cy="460"
              id="M0236"
            >
              <rect
                x="412"
                y="452"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="415"
                cy="455"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="415"
                cy="460"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <g
              className="marker M0237 L2 interchange M4113 L9"
              cx="460"
              cy="445"
              id="M0237"
            >
              <rect
                x="452"
                y="442"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="455"
                cy="445"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="460"
                cy="445"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <g
              className="marker M0238 L2 interchange M2623 L6"
              cx="510"
              cy="445"
              id="M0238"
            >
              <rect
                x="502"
                y="442"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="505"
                cy="445"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="510"
                cy="445"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <g
              className="marker M0239 L2 interchange M1264 LK M4203 LA"
              cx="550"
              cy="410"
              id="M0239"
            >
              <rect
                x="547"
                y="407"
                width="6"
                height="16"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="550"
                cy="420"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="550"
                cy="410"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="550"
                cy="415"
                r="1.5"
                stroke="#038fa0"
                strokeWidth="1"
                fill="#038fa0"
              />
            </g>
            <circle
              className="marker M0240 L2"
              cx="550"
              cy="382.5"
              r="1.5"
              id="M0240"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0241 L2"
              cx="550"
              cy="370"
              r="1.5"
              id="M0241"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0242 L2"
              cx="550"
              cy="355"
              r="1.5"
              id="M0242"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0243 L2 interchange M2532 L5"
              cx="605"
              cy="345"
              id="M0243"
            >
              <rect
                x="597"
                y="342"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="600"
                cy="345"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="605"
                cy="345"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <circle
              className="marker M0202 L2"
              cx="690"
              cy="345"
              r="1.5"
              id="M0202"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0203 L2 interchange M0320 L3"
              cx="720"
              cy="345"
              id="M0203"
            >
              <rect
                x="717"
                y="342"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="725"
                cy="345"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="720"
                cy="345"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
            </g>
            <g
              className="marker M0204 L2 interchange M2536 L5"
              cx="790"
              cy="345"
              id="M0204"
            >
              <rect
                x="787"
                y="337"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="790"
                cy="345"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="790"
                cy="340"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <g
              className="marker M0205 L2 interchange M0422 L4 M2537 L5"
              cx="850"
              cy="340"
              id="M0205"
            >
              <rect
                x="847"
                y="337"
                width="6"
                height="16"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="850"
                cy="345"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="850"
                cy="350"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="850"
                cy="340"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <g
              className="marker M0206 L2 interchange M2636 L6"
              cx="900"
              cy="345"
              id="M0206"
            >
              <rect
                x="892"
                y="342"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="895"
                cy="345"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="900"
                cy="345"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <circle
              className="marker M0207 L2"
              cx="960"
              cy="360"
              r="1.5"
              id="M0207"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0208 L2 interchange M2541 L5 M1013 LK M102C LB"
              cx="990"
              cy="390"
              id="M0208"
            >
              <rect
                x="987"
                y="387"
                width="6"
                height="21"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="990"
                cy="390"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="990"
                cy="395"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="990"
                cy="400"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="990"
                cy="405"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M0209 L2"
              cx="1020"
              cy="420"
              r="1.5"
              id="M0209"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0210 L2"
              cx="1035"
              cy="435"
              r="1.5"
              id="M0210"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0211 L2 interchange"
              cx="1055"
              cy="455"
              id="M0211"
            >
              <rect
                x="1052"
                y="447"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1055"
                cy="455"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="1055"
                cy="450"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
            </g>
            <g
              className="marker M0212 L2 interchange M2729 L7"
              cx="1165"
              cy="485"
              id="M0212"
            >
              <rect
                x="1162"
                y="482"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1165"
                cy="485"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="1165"
                cy="490"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M0213 L2"
              cx="1200"
              cy="500"
              r="1.5"
              id="M0213"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0214 L2"
              cx="1230"
              cy="530"
              r="1.5"
              id="M0214"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0215 L2"
              cx="1255"
              cy="585"
              r="1.5"
              id="M0215"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0216 L2 interchange M2815 L8"
              cx="1255"
              cy="635"
              id="M0216"
            >
              <rect
                x="1252"
                y="632"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1255"
                cy="640"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="1255"
                cy="635"
                r="1.5"
                stroke="#e74e6d"
                strokeWidth="1"
                fill="#e74e6d"
              />
            </g>
            <circle
              className="marker M0217 L2"
              cx="1237.5"
              cy="680"
              r="1.5"
              id="M0217"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0218 L2 interchange M4130 L9"
              cx="1145"
              cy="680"
              id="M0218"
            >
              <rect
                x="1142"
                y="672"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1145"
                cy="680"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="1145"
                cy="675"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <circle
              className="marker M0219 L2"
              cx="1085"
              cy="680"
              r="1.5"
              id="M0219"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0220 L2 interchange M1023 LB"
              cx="1015"
              cy="680"
              id="M0220"
            >
              <rect
                x="1012"
                y="677"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1015"
                cy="680"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="1015"
                cy="685"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M0221 L2"
              cx="970"
              cy="680"
              r="1.5"
              id="M0221"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0222 L2 interchange M4307 LS"
              cx="920"
              cy="680"
              id="M0222"
            >
              <rect
                x="917"
                y="677"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="920"
                cy="680"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="920"
                cy="685"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <g
              className="marker M0223 L2 interchange M0330 L3"
              cx="860"
              cy="680"
              id="M0223"
            >
              <rect
                x="857"
                y="677"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="865"
                cy="680"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="860"
                cy="680"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
            </g>
            <circle
              className="marker M0224 L2"
              cx="805"
              cy="680"
              r="1.5"
              id="M0224"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0225 L2"
              cx="760"
              cy="680"
              r="1.5"
              id="M0225"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0226 L2 interchange M0433 L4"
              cx="705"
              cy="680"
              id="M0226"
            >
              <rect
                x="702"
                y="677"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="705"
                cy="680"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="705"
                cy="685"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
            </g>
            <circle
              className="marker M0227 L2"
              cx="677.5"
              cy="680"
              r="1.5"
              id="M0227"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0228 L2"
              cx="635"
              cy="680"
              r="1.5"
              id="M0228"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0229 L2"
              cx="585"
              cy="680"
              r="1.5"
              id="M0229"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0230 L2 interchange M4408 LSL"
              cx="545"
              cy="680"
              id="M0230"
            >
              <rect
                x="542"
                y="677"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="545"
                cy="680"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="550"
                cy="680"
                r="1.5"
                stroke="#3399FF"
                strokeWidth="1"
                fill="#3399FF"
              />
            </g>
            <circle
              className="marker M0231 L2"
              cx="500"
              cy="680"
              r="1.5"
              id="M0231"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0232 L2"
              cx="460"
              cy="670"
              r="1.5"
              id="M0232"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0233 L2 interchange M2746 L7"
              cx="460"
              cy="640"
              id="M0233"
            >
              <rect
                x="457"
                y="632"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="460"
                cy="635"
                r="1.5"
                stroke="#10a643"
                strokeWidth="1"
                fill="#10a643"
              />
              <circle
                cx="460"
                cy="640"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M0244 L2"
              cx="1055"
              cy="420"
              r="1.5"
              id="M0244"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0245 L2"
              cx="975"
              cy="315"
              r="1.5"
              id="M0245"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0250 L2"
              cx="955"
              cy="295"
              r="1.5"
              id="M0250"
              stroke="#10a643"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1958 L3"
              cx="80"
              cy="175"
              r="1.5"
              id="M1958"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1957 L3"
              cx="120"
              cy="175"
              r="1.5"
              id="M1957"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1956 L3"
              cx="157.5"
              cy="175"
              r="1.5"
              id="M1956"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1955 L3"
              cx="194.5"
              cy="175"
              r="1.5"
              id="M1955"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1954 L3"
              cx="230"
              cy="175"
              r="1.5"
              id="M1954"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1953 L3 interchange M0300 LK"
              cx="265"
              cy="175"
              id="M1953"
            >
              <rect
                x="262"
                y="172"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="265"
                cy="175"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="265"
                cy="180"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M1952 L3"
              cx="287.5"
              cy="175"
              r="1.5"
              id="M1952"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1951 L3"
              cx="315"
              cy="175"
              r="1.5"
              id="M1951"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1948 L3"
              cx="340"
              cy="175"
              r="1.5"
              id="M1948"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1950 L3"
              cx="365"
              cy="175"
              r="1.5"
              id="M1950"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0309 L3"
              cx="391"
              cy="175"
              r="1.5"
              id="M0309"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0310 L3"
              cx="419"
              cy="175"
              r="1.5"
              id="M0310"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0311 L3 interchange M2615 L6"
              cx="440"
              cy="175"
              id="M0311"
            >
              <rect
                x="437"
                y="172"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="445"
                cy="175"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="440"
                cy="175"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <g
              className="marker M0312 L3 interchange M2613 L6"
              cx="500"
              cy="175"
              id="M0312"
            >
              <rect
                x="492"
                y="172"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="495"
                cy="175"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="500"
                cy="175"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <circle
              className="marker M0313 L3"
              cx="542.5"
              cy="175"
              r="1.5"
              id="M0313"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0314 L3"
              cx="575"
              cy="175"
              r="1.5"
              id="M0314"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0315 L3"
              cx="605"
              cy="175"
              r="1.5"
              id="M0315"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0316 L3"
              cx="645"
              cy="200"
              r="1.5"
              id="M0316"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0317 L3"
              cx="670"
              cy="225"
              r="1.5"
              id="M0317"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0318 L3"
              cx="690"
              cy="245"
              r="1.5"
              id="M0318"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0321 L3 interchange M0423 L4"
              cx="775"
              cy="400"
              id="M0321"
            >
              <rect
                x="772"
                y="397"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="775"
                cy="400"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="780"
                cy="400"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
            </g>
            <circle
              className="marker M0322 L3"
              cx="810"
              cy="435"
              r="1.5"
              id="M0322"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0323 L3 interchange M2634 L6"
              cx="850"
              cy="475"
              id="M0323"
            >
              <rect
                x="847"
                y="467"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="850"
                cy="475"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="850"
                cy="470"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <circle
              className="marker M0324 L3"
              cx="860"
              cy="500"
              r="1.5"
              id="M0324"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0325 L3 interchange M1011 LK"
              cx="860"
              cy="530"
              id="M0325"
            >
              <rect
                x="857"
                y="527"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="860"
                cy="535"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="860"
                cy="530"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M0326 L3"
              cx="860"
              cy="570"
              r="1.5"
              id="M0326"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0327 L3 interchange M4304 LS"
              cx="860"
              cy="590"
              id="M0327"
            >
              <rect
                x="857"
                y="587"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="860"
                cy="590"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="860"
                cy="595"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <circle
              className="marker M0328 L3"
              cx="860"
              cy="610"
              r="1.5"
              id="M0328"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0329 L3 interchange M2736 L7 M4123 L9"
              cx="860"
              cy="645"
              id="M0329"
            >
              <rect
                x="857"
                y="632"
                width="6"
                height="16"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="860"
                cy="635"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="860"
                cy="640"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="860"
                cy="645"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <circle
              className="marker M0331 L3"
              cx="880"
              cy="700"
              r="1.5"
              id="M0331"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0332 L3 interchange M4308 LS"
              cx="920"
              cy="725"
              id="M0332"
            >
              <rect
                x="917"
                y="722"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="920"
                cy="725"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="920"
                cy="730"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <circle
              className="marker M0333 L3"
              cx="960"
              cy="725"
              r="1.5"
              id="M0333"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0334 L3 interchange M1025 LB"
              cx="1015"
              cy="725"
              id="M0334"
            >
              <rect
                x="1012"
                y="722"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1015"
                cy="725"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="1015"
                cy="730"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M0335 L3"
              cx="1065"
              cy="725"
              r="1.5"
              id="M0335"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0336 L3"
              cx="1110"
              cy="725"
              r="1.5"
              id="M0336"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0337 L3"
              cx="1175"
              cy="725"
              r="1.5"
              id="M0337"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0338 L3"
              cx="1220"
              cy="725"
              r="1.5"
              id="M0338"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0339 L3 interchange M1030 LB"
              cx="1285"
              cy="765"
              id="M0339"
            >
              <rect
                x="1282"
                y="762"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1285"
                cy="765"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="1290"
                cy="765"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M0340 L3 interchange M2818 L8"
              cx="1332.5"
              cy="717.5"
              id="M2818"
            >
              <rect
                x="1329.5"
                y="709.5"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1332.5"
                cy="717.5"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="1332.5"
                cy="712.5"
                r="1.5"
                stroke="#e74e6d"
                strokeWidth="1"
                fill="#e74e6d"
              />
            </g>
            <circle
              className="marker M0341 L3"
              cx="1375"
              cy="675"
              r="1.5"
              id="M0341"
              stroke="#ea8406"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0342 L3 interchange M2558 L5"
              cx="1410"
              cy="640"
              id="M2558"
            >
              <rect
                x="1407"
                y="632"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1410"
                cy="640"
                r="1.5"
                stroke="#ea8406"
                strokeWidth="1"
                fill="#ea8406"
              />
              <circle
                cx="1410"
                cy="635"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <circle
              className="marker M0405 L4"
              cx="1290"
              cy="80"
              r="1.5"
              id="M0405"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0406 L4"
              cx="1270"
              cy="100"
              r="1.5"
              id="M0406"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0408 L4"
              cx="1250"
              cy="120"
              r="1.5"
              id="M0408"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0409 L4"
              cx="1230"
              cy="140"
              r="1.5"
              id="M0409"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0410 L4"
              cx="1195"
              cy="155"
              r="1.5"
              id="M0410"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0411 L4 interchange M2715 L7"
              cx="1150"
              cy="155"
              id="M0411"
            >
              <rect
                x="1147"
                y="152"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1155"
                cy="155"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="1150"
                cy="155"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M0413 L4"
              cx="1030"
              cy="155"
              r="1.5"
              id="M0413"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0414 L4"
              cx="1000"
              cy="155"
              r="1.5"
              id="M0414"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0415 L4"
              cx="955"
              cy="155"
              r="1.5"
              id="M0415"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0416 L4"
              cx="915"
              cy="155"
              r="1.5"
              id="M0416"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0417 L4"
              cx="880"
              cy="155"
              r="1.5"
              id="M0417"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0418 L4 interchange M4711 LW"
              cx="865"
              cy="170"
              id="M0418"
            >
              <rect
                x="862"
                y="167"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="865"
                cy="170"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="870"
                cy="170"
                r="1.5"
                stroke="#878787"
                strokeWidth="1"
                fill="#878787"
              />
            </g>
            <circle
              className="marker M0419 L4"
              cx="865"
              cy="200"
              r="1.5"
              id="M0419"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0420 L4"
              cx="865"
              cy="230"
              r="1.5"
              id="M0420"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0424 L4"
              cx="745"
              cy="400"
              r="1.5"
              id="M0424"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0425 L4"
              cx="715"
              cy="400"
              r="1.5"
              id="M0425"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M0427 L4"
              cx="690"
              cy="435"
              r="1.5"
              id="M0427"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0428 L4 interchange M2629 L6"
              cx="705"
              cy="475"
              id="M0428"
            >
              <rect
                x="697"
                y="472"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="705"
                cy="475"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="700"
                cy="475"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <circle
              className="marker M0429 L4"
              cx="705"
              cy="515"
              r="1.5"
              id="M0429"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M0430 L4 interchange M1008 LK"
              cx="705"
              cy="545"
              id="M0430"
            >
              <rect
                x="702"
                y="537"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="705"
                cy="540"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="705"
                cy="545"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <g
              className="marker M0431 L4 interchange M4120 L9"
              cx="705"
              cy="600"
              id="M0431"
            >
              <rect
                x="702"
                y="597"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="705"
                cy="605"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="705"
                cy="600"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <g
              className="marker M0432 L4 interchange M2738 L7"
              cx="705"
              cy="640"
              id="M0432"
            >
              <rect
                x="702"
                y="637"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="705"
                cy="645"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="705"
                cy="640"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M0434 L4"
              cx="705"
              cy="705"
              r="1.5"
              id="M0434"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1450 L4"
              cx="705"
              cy="725"
              r="1.5"
              id="M1450"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1451 L4"
              cx="695"
              cy="745"
              r="1.5"
              id="M1451"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1452 L4"
              cx="675"
              cy="765"
              r="1.5"
              id="M1452"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1453 L4"
              cx="655"
              cy="780"
              r="1.5"
              id="M1453"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1454 L4"
              cx="620"
              cy="780"
              r="1.5"
              id="M1454"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1455 L4"
              cx="575"
              cy="800"
              r="1.5"
              id="M1455"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1456 L4"
              cx="555"
              cy="820"
              r="1.5"
              id="M1456"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1457 L4"
              cx="535"
              cy="840"
              r="1.5"
              id="M1457"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1751 L4"
              cx="495"
              cy="880"
              r="1.5"
              id="M1751"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1763 L4"
              cx="475"
              cy="900"
              r="1.5"
              id="M1763"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1752 L4"
              cx="455"
              cy="920"
              r="1.5"
              id="M1752"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1753 L4"
              cx="410"
              cy="945"
              r="1.5"
              id="M1753"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1754 L4"
              cx="380"
              cy="945"
              r="1.5"
              id="M1754"
              stroke="#00a8e6"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1755 L4 interchange M1830 LB"
              cx="350"
              cy="945"
              id="M1755"
            >
              <rect
                x="347"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="350"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="350"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1756 L4 interchange M1831 LB"
              cx="320"
              cy="945"
              id="M1756"
            >
              <rect
                x="317"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="320"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="320"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1757 L4 interchange M1832 LB"
              cx="290"
              cy="945"
              id="M1757"
            >
              <rect
                x="287"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="290"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="290"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1758 L4 interchange M1833 LB M4813 LSH"
              cx="260"
              cy="945"
              id="M1758"
            >
              <rect
                x="257"
                y="942"
                width="6"
                height="16"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="260"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="260"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
              <circle
                cx="260"
                cy="955"
                r="1.5"
                stroke="#8be800"
                strokeWidth="1"
                fill="#8be800"
              />
            </g>
            <g
              className="marker M1759 L4 interchange M1834 LB"
              cx="230"
              cy="945"
              id="M1759"
            >
              <rect
                x="227"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="230"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="230"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1760 L4 interchange M1835 LB"
              cx="195"
              cy="945"
              id="M1760"
            >
              <rect
                x="192"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="195"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="195"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1761 L4 interchange M1836 LB"
              cx="155"
              cy="945"
              id="M1761"
            >
              <rect
                x="152"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="155"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="155"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1762 L4 interchange M1800 LB"
              cx="100"
              cy="945"
              id="M1762"
            >
              <rect
                x="97"
                y="942"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="100"
                cy="945"
                r="1.5"
                stroke="#00a8e6"
                strokeWidth="1"
                fill="#00a8e6"
              />
              <circle
                cx="100"
                cy="950"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M2511 L5"
              cx="210"
              cy="275"
              r="1.5"
              id="M2511"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2512 L5"
              cx="210"
              cy="310"
              r="1.5"
              id="M2512"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2513 L5 interchange M4102 L9 M4929 LKP M4207 LA"
              cx="210"
              cy="350"
              id="M2513"
            >
              <rect
                x="207"
                y="332"
                width="6"
                height="21"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="210"
                cy="335"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="210"
                cy="345"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
              <circle
                cx="210"
                cy="340"
                r="1.5"
                stroke="#bdab73"
                strokeWidth="1"
                fill="#bdab73"
              />
              <circle
                cx="210"
                cy="350"
                r="1.5"
                stroke="#038fa0"
                strokeWidth="1"
                fill="#038fa0"
              />
            </g>
            <circle
              className="marker M2514 L5"
              cx="210"
              cy="377.5"
              r="1.5"
              id="M2514"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2515 L5"
              cx="210"
              cy="402.5"
              r="1.5"
              id="M2515"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2516 L5"
              cx="210"
              cy="429"
              r="1.5"
              id="M2516"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2517 L5"
              cx="225"
              cy="460"
              r="1.5"
              id="M2517"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2518 L5"
              cx="255"
              cy="460"
              r="1.5"
              id="M2518"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2520 L5"
              cx="320"
              cy="460"
              r="1.5"
              id="M2520"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2521 L5"
              cx="345"
              cy="460"
              r="1.5"
              id="M2521"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2522 L5"
              cx="370"
              cy="460"
              r="1.5"
              id="M2522"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2523 L5"
              cx="395"
              cy="460"
              r="1.5"
              id="M2523"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2525 L5"
              cx="442.5"
              cy="485"
              r="1.5"
              id="M2525"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2527 L5 interchange M4115 L9"
              cx="525"
              cy="505"
              id="M2527"
            >
              <rect
                x="522"
                y="502"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="530"
                cy="505"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="525"
                cy="505"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <circle
              className="marker M2528 L5"
              cx="565"
              cy="505"
              r="1.5"
              id="M2528"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2529 L5"
              cx="600"
              cy="505"
              r="1.5"
              id="M2529"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2530 L5 interchange M2627 L6 M1262 LK M4202 LA"
              cx="605"
              cy="460"
              id="M2530"
            >
              <rect
                x="602"
                y="457"
                width="6"
                height="21"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="605"
                cy="465"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="605"
                cy="475"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
              <circle
                cx="605"
                cy="470"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="605"
                cy="460"
                r="1.5"
                stroke="#038fa0"
                strokeWidth="1"
                fill="#038fa0"
              />
            </g>
            <circle
              className="marker M2531 L5"
              cx="605"
              cy="365"
              r="1.5"
              id="M2531"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2533 L5"
              cx="605"
              cy="300"
              r="1.5"
              id="M2533"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2534 L5"
              cx="645"
              cy="275"
              r="1.5"
              id="M2534"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2538 L5 interchange M2635 L6"
              cx="850"
              cy="395"
              id="M2538"
            >
              <rect
                x="847"
                y="387"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="850"
                cy="390"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="850"
                cy="395"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
            </g>
            <circle
              className="marker M2539 L5"
              cx="905"
              cy="395"
              r="1.5"
              id="M2539"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2540 L5"
              cx="945"
              cy="395"
              r="1.5"
              id="M2540"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2542 L5"
              cx="1035"
              cy="395"
              r="1.5"
              id="M2542"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2543 L5"
              cx="1085"
              cy="395"
              r="1.5"
              id="M2543"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2544 L5"
              cx="1130"
              cy="395"
              r="1.5"
              id="M2544"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2545 L5 interchange M2727 L7"
              cx="1165"
              cy="395"
              id="M2545"
            >
              <rect
                x="1162"
                y="392"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1165"
                cy="395"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="1165"
                cy="400"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M2546 L5"
              cx="1235"
              cy="420"
              r="1.5"
              id="M2546"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2547 L5"
              cx="1275"
              cy="460"
              r="1.5"
              id="M2547"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2548 L5 interchange M2812 L8"
              cx="1355"
              cy="540"
              id="M2548"
            >
              <rect
                x="1352"
                y="537"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1360"
                cy="540"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="1355"
                cy="540"
                r="1.5"
                stroke="#e74e6d"
                strokeWidth="1"
                fill="#e74e6d"
              />
            </g>
            <g
              className="marker M2549 L5 interchange"
              cx="1410"
              cy="540"
              id="M2549"
            >
              <rect
                x="1407"
                y="532"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1410"
                cy="540"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="1410"
                cy="535"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
            </g>
            <circle
              className="marker M2550 L5"
              cx="1410"
              cy="515"
              r="1.5"
              id="M2550"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2551 L5"
              cx="1410"
              cy="490"
              r="1.5"
              id="M2551"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2552 L5"
              cx="1410"
              cy="465"
              r="1.5"
              id="M2552"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2553 L5"
              cx="1410"
              cy="440"
              r="1.5"
              id="M2553"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2554 L5"
              cx="1410"
              cy="415"
              r="1.5"
              id="M2554"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2562 L5"
              cx="1455"
              cy="415"
              r="1.5"
              id="M2562"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2563 L5"
              cx="1455"
              cy="435"
              r="1.5"
              id="M2563"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2564 L5"
              cx="1455"
              cy="455"
              r="1.5"
              id="M2564"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2565 L5"
              cx="1455"
              cy="475"
              r="1.5"
              id="M2565"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2566 L5"
              cx="1455"
              cy="495"
              r="1.5"
              id="M2566"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2555 L5"
              cx="1410"
              cy="565"
              r="1.5"
              id="M2555"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2556 L5 interchange M4136 L9"
              cx="1410"
              cy="590"
              id="M2556"
            >
              <rect
                x="1407"
                y="587"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1410"
                cy="590"
                r="1.5"
                stroke="#a95094"
                strokeWidth="1"
                fill="#a95094"
              />
              <circle
                cx="1415"
                cy="590"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <circle
              className="marker M2557 L5"
              cx="1410"
              cy="615"
              r="1.5"
              id="M2557"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2559 L5"
              cx="1410"
              cy="665"
              r="1.5"
              id="M2559"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2560 L5"
              cx="1410"
              cy="690"
              r="1.5"
              id="M2560"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2561 L5"
              cx="1410"
              cy="715"
              r="1.5"
              id="M2561"
              stroke="#a95094"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2649 L6 interchange M1311 LG"
              cx="1260"
              cy="255"
              id="M1311"
            >
              <rect
                x="1257"
                y="252"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1260"
                cy="255"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
              <circle
                cx="1260"
                cy="260"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
            </g>
            <circle
              className="marker M2648 L6"
              cx="1245"
              cy="240"
              r="1.5"
              id="M2648"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2647 L6"
              cx="1195"
              cy="225"
              r="1.5"
              id="M2647"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2646 L6 interchange M2719 L7"
              cx="1165"
              cy="225"
              id="M2646"
            >
              <rect
                x="1157"
                y="222"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1160"
                cy="225"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
              <circle
                cx="1165"
                cy="225"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
            </g>
            <circle
              className="marker M2644 L6"
              cx="1045"
              cy="225"
              r="1.5"
              id="M2644"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2643 L6"
              cx="1010"
              cy="225"
              r="1.5"
              id="M2643"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2642 L6"
              cx="970"
              cy="225"
              r="1.5"
              id="M2642"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2641 L6"
              cx="940"
              cy="225"
              r="1.5"
              id="M2641"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2640 L6"
              cx="905"
              cy="225"
              r="1.5"
              id="M2640"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2639 L6 interchange M4712 LW"
              cx="900"
              cy="240"
              id="M2639"
            >
              <rect
                x="897"
                y="232"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="900"
                cy="240"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
              <circle
                cx="900"
                cy="235"
                r="1.5"
                stroke="#878787"
                strokeWidth="1"
                fill="#878787"
              />
            </g>
            <circle
              className="marker M2638 L6"
              cx="900"
              cy="255"
              r="1.5"
              id="M2638"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2633 L6"
              cx="825"
              cy="475"
              r="1.5"
              id="M2633"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2632 L6"
              cx="795"
              cy="475"
              r="1.5"
              id="M2632"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2631 L6"
              cx="755"
              cy="475"
              r="1.5"
              id="M2631"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2630 L6"
              cx="725"
              cy="475"
              r="1.5"
              id="M2630"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2628 L6 interchange M1261 LK"
              cx="635"
              cy="470"
              id="M2628"
            >
              <rect
                x="632"
                y="467"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="635"
                cy="475"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
              <circle
                cx="635"
                cy="470"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M2626 L6"
              cx="580"
              cy="475"
              r="1.5"
              id="M2626"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2625 L6"
              cx="545"
              cy="475"
              r="1.5"
              id="M2625"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2624 L6"
              cx="525"
              cy="460"
              r="1.5"
              id="M2624"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2622 L6"
              cx="485"
              cy="420"
              r="1.5"
              id="M2622"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2621 L6"
              cx="470"
              cy="375"
              r="1.5"
              id="M2621"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2620 L6"
              cx="470"
              cy="350"
              r="1.5"
              id="M2620"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2619 L6 interchange M1266 LK M4204 LA"
              cx="470"
              cy="310"
              id="M2619"
            >
              <rect
                x="467"
                y="307"
                width="6"
                height="16"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="470"
                cy="310"
                r="1.5"
                stroke="#d08d1a"
                strokeWidth="1"
                fill="#d08d1a"
              />
              <circle
                cx="470"
                cy="315"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="470"
                cy="320"
                r="1.5"
                stroke="#038fa0"
                strokeWidth="1"
                fill="#038fa0"
              />
            </g>
            <circle
              className="marker M2618 L6"
              cx="470"
              cy="280"
              r="1.5"
              id="M2618"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2617 L6"
              cx="470"
              cy="250"
              r="1.5"
              id="M2617"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2611 L6"
              cx="470"
              cy="205"
              r="1.5"
              id="M2611"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2612 L6"
              cx="485"
              cy="190"
              r="1.5"
              id="M2612"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2614 L6"
              cx="470"
              cy="145"
              r="1.5"
              id="M2614"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2616 L6"
              cx="455"
              cy="190"
              r="1.5"
              id="M2616"
              stroke="#d08d1a"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M3763 L7 interchange M3213 LI2"
              cx="40"
              cy="580"
              id="M3213"
            >
              <rect
                x="37"
                y="577"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="40"
                cy="580"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="40"
                cy="585"
                r="1.5"
                stroke="#fd9800"
                strokeWidth="1"
                fill="#fd9800"
              />
            </g>
            <circle
              className="marker M3762 L7"
              cx="100"
              cy="605"
              r="1.5"
              id="M3762"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M3761 L7 interchange M3118 LI"
              cx="140"
              cy="605"
              id="M3118"
            >
              <rect
                x="137"
                y="602"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="140"
                cy="605"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="140"
                cy="610"
                r="1.5"
                stroke="#6496df"
                strokeWidth="1"
                fill="#6496df"
              />
            </g>
            <circle
              className="marker M3760 L7"
              cx="195"
              cy="550"
              r="1.5"
              id="M3760"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3759 L7"
              cx="210"
              cy="535"
              r="1.5"
              id="M3759"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3758 L7"
              cx="210"
              cy="515"
              r="1.5"
              id="M3758"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3757 L7"
              cx="240"
              cy="495"
              r="1.5"
              id="M3757"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3756 L7"
              cx="270"
              cy="500"
              r="1.5"
              id="M3756"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3755 L7"
              cx="285"
              cy="515"
              r="1.5"
              id="M3755"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3754 L7"
              cx="290"
              cy="540"
              r="1.5"
              id="M3754"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M3753 L7"
              cx="290"
              cy="565"
              r="1.5"
              id="M3753"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2751 L7"
              cx="340"
              cy="615"
              r="1.5"
              id="M2751"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2750 L7"
              cx="355"
              cy="630"
              r="1.5"
              id="M2750"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2749 L7"
              cx="390"
              cy="640"
              r="1.5"
              id="M2749"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2747 L7"
              cx="435"
              cy="640"
              r="1.5"
              id="M2747"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2745 L7"
              cx="485"
              cy="640"
              r="1.5"
              id="M2745"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2744 L7 interchange M4404 LSL"
              cx="520"
              cy="640"
              id="M2744"
            >
              <rect
                x="517"
                y="637"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="520"
                cy="640"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="525"
                cy="640"
                r="1.5"
                stroke="#3399FF"
                strokeWidth="1"
                fill="#3399FF"
              />
            </g>
            <circle
              className="marker M2743 L7"
              cx="555"
              cy="640"
              r="1.5"
              id="M2743"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2742 L7"
              cx="585"
              cy="640"
              r="1.5"
              id="M2742"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2741 L7"
              cx="615"
              cy="640"
              r="1.5"
              id="M2741"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2740 L7"
              cx="650"
              cy="640"
              r="1.5"
              id="M2740"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2739 L7"
              cx="685"
              cy="640"
              r="1.5"
              id="M2739"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2737 L7"
              cx="795"
              cy="640"
              r="1.5"
              id="M2737"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2735 L7"
              cx="940"
              cy="600"
              r="1.5"
              id="M2735"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2734 L7 interchange M4305 LS"
              cx="975"
              cy="600"
              id="M2734"
            >
              <rect
                x="972"
                y="597"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="975"
                cy="600"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="975"
                cy="605"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <circle
              className="marker M2733 L7"
              cx="1030"
              cy="600"
              r="1.5"
              id="M2733"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2732 L7 interchange M1849 LB"
              cx="1095"
              cy="570"
              id="M2732"
            >
              <rect
                x="1092"
                y="567"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1095"
                cy="570"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="1095"
                cy="575"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M2731 L7"
              cx="1130"
              cy="535"
              r="1.5"
              id="M2731"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2730 L7"
              cx="1160"
              cy="505"
              r="1.5"
              id="M2730"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2728 L7"
              cx="1165"
              cy="435"
              r="1.5"
              id="M2728"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2726 L7"
              cx="1165"
              cy="365"
              r="1.5"
              id="M2726"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2725 L7"
              cx="1165"
              cy="345"
              r="1.5"
              id="M2725"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2724 L7"
              cx="1165"
              cy="325"
              r="1.5"
              id="M2724"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2723 L7"
              cx="1165"
              cy="305"
              r="1.5"
              id="M2723"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2722 L7 interchange M1309 LG M1202 LK"
              cx="1165"
              cy="270"
              id="M2722"
            >
              <rect
                x="1162"
                y="267"
                width="6"
                height="21"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1165"
                cy="270"
                r="1.5"
                stroke="#657931"
                strokeWidth="1"
                fill="#657931"
              />
              <circle
                cx="1165"
                cy="275"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
              <circle
                cx="1165"
                cy="280"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
              <circle
                cx="1165"
                cy="285"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M2721 L7"
              cx="1165"
              cy="255"
              r="1.5"
              id="M2721"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2720 L7"
              cx="1165"
              cy="240"
              r="1.5"
              id="M2720"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2718 L7"
              cx="1165"
              cy="200"
              r="1.5"
              id="M2718"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2717 L7"
              cx="1165"
              cy="185"
              r="1.5"
              id="M2717"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2716 L7"
              cx="1165"
              cy="170"
              r="1.5"
              id="M2716"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2714 L7"
              cx="1125"
              cy="130"
              r="1.5"
              id="M2714"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2713 L7"
              cx="1105"
              cy="110"
              r="1.5"
              id="M2713"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2711 L7"
              cx="1155"
              cy="80"
              r="1.5"
              id="M2711"
              stroke="#657931"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2811 L8"
              cx="1355"
              cy="500"
              r="1.5"
              id="M2811"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2813 L8"
              cx="1325"
              cy="569"
              r="1.5"
              id="M2813"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2814 L8"
              cx="1295"
              cy="597.5"
              r="1.5"
              id="M2814"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2816 L8 interchange M4133 L9"
              cx="1280"
              cy="660"
              id="M2816"
            >
              <rect
                x="1277"
                y="657"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1280"
                cy="660"
                r="1.5"
                stroke="#e74e6d"
                strokeWidth="1"
                fill="#e74e6d"
              />
              <circle
                cx="1280"
                cy="665"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
            </g>
            <circle
              className="marker M2817 L8"
              cx="1305"
              cy="685"
              r="1.5"
              id="M2817"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2819 L8"
              cx="1350"
              cy="730"
              r="1.5"
              id="M2819"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2820 L8"
              cx="1370"
              cy="750"
              r="1.5"
              id="M2820"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2821 L8 interchange M1031 LB"
              cx="1385"
              cy="765"
              id="M1031"
            >
              <rect
                x="1377"
                y="762"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1385"
                cy="765"
                r="1.5"
                stroke="#e74e6d"
                strokeWidth="1"
                fill="#e74e6d"
              />
              <circle
                cx="1380"
                cy="765"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M2828 L8"
              cx="1410"
              cy="790"
              r="1.5"
              id="M2828"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2822 L8"
              cx="1425"
              cy="810"
              r="1.5"
              id="M2822"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2823 L8"
              cx="1425"
              cy="840"
              r="1.5"
              id="M2823"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2824 L8"
              cx="1392.5"
              cy="845"
              r="1.5"
              id="M2824"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2825 L8"
              cx="1355"
              cy="845"
              r="1.5"
              id="M2825"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M2826 L8"
              cx="1315"
              cy="835"
              r="1.5"
              id="M2826"
              stroke="#e74e6d"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M2827 L8 interchange M1853 LB"
              cx="1295"
              cy="805"
              id="M1853"
            >
              <rect
                x="1292"
                y="802"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1295"
                cy="805"
                r="1.5"
                stroke="#e74e6d"
                strokeWidth="1"
                fill="#e74e6d"
              />
              <circle
                cx="1300"
                cy="805"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M4101 L9"
              cx="185"
              cy="275"
              r="1.5"
              id="M4101"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4103 L9"
              cx="230"
              cy="345"
              r="1.5"
              id="M4103"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4104 L9"
              cx="255"
              cy="355"
              r="1.5"
              id="M4104"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M4105 L9 interchange M4206 LA"
              cx="275"
              cy="375"
              id="M4105"
            >
              <rect
                x="272"
                y="367"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="275"
                cy="375"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
              <circle
                cx="275"
                cy="370"
                r="1.5"
                stroke="#038fa0"
                strokeWidth="1"
                fill="#038fa0"
              />
            </g>
            <circle
              className="marker M4106 L9"
              cx="290"
              cy="390"
              r="1.5"
              id="M4106"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4107 L9"
              cx="330"
              cy="415"
              r="1.5"
              id="M4107"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4108 L9"
              cx="360"
              cy="415"
              r="1.5"
              id="M4108"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4109 L9"
              cx="385"
              cy="415"
              r="1.5"
              id="M4109"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4110 L9"
              cx="415"
              cy="415"
              r="1.5"
              id="M4110"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4111 L9"
              cx="440"
              cy="425"
              r="1.5"
              id="M4111"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4112 L9"
              cx="450"
              cy="435"
              r="1.5"
              id="M4112"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4114 L9"
              cx="487.5"
              cy="470"
              r="1.5"
              id="M4114"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M4116 L9 interchange M4401 LSL"
              cx="548.5"
              cy="525"
              id="M4116"
            >
              <rect
                x="540.5"
                y="522"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="548.5"
                cy="525"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
              <circle
                cx="543.5"
                cy="525"
                r="1.5"
                stroke="#3399FF"
                strokeWidth="1"
                fill="#3399FF"
              />
            </g>
            <circle
              className="marker M4118 L9"
              cx="615"
              cy="590"
              r="1.5"
              id="M4118"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4119 L9"
              cx="660"
              cy="600"
              r="1.5"
              id="M4119"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4121 L9"
              cx="765"
              cy="600"
              r="1.5"
              id="M4121"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4122 L9"
              cx="810"
              cy="600"
              r="1.5"
              id="M4122"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4124 L9"
              cx="935"
              cy="645"
              r="1.5"
              id="M4124"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M4125 L9 interchange M4306 LS"
              cx="975"
              cy="645"
              id="M4125"
            >
              <rect
                x="972"
                y="642"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="975"
                cy="645"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
              <circle
                cx="975"
                cy="650"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <circle
              className="marker M4126 L9"
              cx="1025"
              cy="645"
              r="1.5"
              id="M4126"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M4127 L9 interchange M1850 LB"
              cx="1050"
              cy="645"
              id="M1850"
            >
              <rect
                x="1047"
                y="642"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1055"
                cy="645"
                r="1.5"
                stroke="#be941c"
                strokeWidth="1"
                fill="#be941c"
              />
              <circle
                cx="1050"
                cy="645"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <circle
              className="marker M4128 L9"
              cx="1115"
              cy="645"
              r="1.5"
              id="M4128"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4129 L9"
              cx="1145"
              cy="650"
              r="1.5"
              id="M4129"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4131 L9"
              cx="1195"
              cy="695"
              r="1.5"
              id="M4131"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4132 L9"
              cx="1260"
              cy="695"
              r="1.5"
              id="M4132"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4134 L9"
              cx="1315"
              cy="630"
              r="1.5"
              id="M4134"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4135 L9"
              cx="1345"
              cy="600"
              r="1.5"
              id="M4135"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4137 L9"
              cx="1450"
              cy="590"
              r="1.5"
              id="M4137"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4138 L9"
              cx="1470"
              cy="565"
              r="1.5"
              id="M4138"
              stroke="#be941c"
              strokeWidth="1"
              fill="#ffffff"
            />

            <g
              className="marker M3130 LI interchange M1884 LB"
              cx="320"
              cy="855"
              id="M3130"
            >
              <rect
                x="317"
                y="852"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="320"
                cy="855"
                r="1.5"
                stroke="#6496df"
                strokeWidth="1"
                fill="#6496df"
              />
              <circle
                cx="320"
                cy="860"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
            </g>
            <g
              className="marker M1308 LG interchange M1201 LK"
              cx="1105"
              cy="280"
              id="M1201"
            >
              <rect
                x="1102"
                y="277"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1105"
                cy="280"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
              <circle
                cx="1105"
                cy="285"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <g
              className="marker M1310 LG interchange M1203 LK"
              cx="1240"
              cy="280"
              id="M1203"
            >
              <rect
                x="1237"
                y="277"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1240"
                cy="280"
                r="1.5"
                stroke="#33C7A7"
                strokeWidth="1"
                fill="#33C7A7"
              />
              <circle
                cx="1240"
                cy="285"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>

            <circle
              className="marker M1285 LK"
              cx="40"
              cy="80"
              r="1.5"
              id="M1285"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1284 LK interchange"
              cx="75"
              cy="80"
              id="M1284"
            >
              <rect
                x="72"
                y="77"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="75"
                cy="80"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="80"
                cy="80"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M1283 LK"
              cx="100"
              cy="80"
              r="1.5"
              id="M1283"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1282 LK"
              cx="125"
              cy="80"
              r="1.5"
              id="M1282"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1280 LK"
              cx="150"
              cy="80"
              r="1.5"
              id="M1280"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1279 LK"
              cx="175"
              cy="80"
              r="1.5"
              id="M1279"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1278 LK"
              cx="200"
              cy="80"
              r="1.5"
              id="M1278"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1277 LK"
              cx="225"
              cy="80"
              r="1.5"
              id="M1277"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1276 LK"
              cx="250"
              cy="80"
              r="1.5"
              id="M1276"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1275 LK"
              cx="265"
              cy="90"
              r="1.5"
              id="M1275"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1274 LK"
              cx="265"
              cy="110"
              r="1.5"
              id="M1274"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1273 LK"
              cx="265"
              cy="130"
              r="1.5"
              id="M1273"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1272 LK"
              cx="265"
              cy="150"
              r="1.5"
              id="M1272"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1271 LK"
              cx="280"
              cy="210"
              r="1.5"
              id="M1271"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1270 LK"
              cx="300"
              cy="230"
              r="1.5"
              id="M1270"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1269 LK"
              cx="325"
              cy="255"
              r="1.5"
              id="M1269"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1268 LK"
              cx="345"
              cy="275"
              r="1.5"
              id="M1268"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1267 LK"
              cx="365"
              cy="295"
              r="1.5"
              id="M1267"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1265 LK interchange"
              cx="495"
              cy="315"
              id="M1265"
            >
              <rect
                x="492"
                y="312"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="495"
                cy="315"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
              <circle
                cx="495"
                cy="320"
                r="1.5"
                stroke="#79c0a0"
                strokeWidth="1"
                fill="#79c0a0"
              />
            </g>
            <circle
              className="marker M1252 LK"
              cx="525"
              cy="315"
              r="1.5"
              id="M1252"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            {/* <circle
              className="marker M1251 LK"
              cx="655"
              cy="385"
              r="1.5"
              id="M1251"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            /> */}
            <circle
              className="marker M1263 LK"
              cx="550"
              cy="440"
              r="1.5"
              id="M1263"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1009 LK"
              cx="780"
              cy="545"
              r="1.5"
              id="M1009"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1010 LK"
              cx="825"
              cy="545"
              r="1.5"
              id="M1010"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1012 LK"
              cx="925"
              cy="465"
              r="1.5"
              id="M1012"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1204 LK"
              cx="1275"
              cy="285"
              r="1.5"
              id="M1204"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1205 LK"
              cx="1300"
              cy="285"
              r="1.5"
              id="M1205"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1206 LK"
              cx="1325"
              cy="285"
              r="1.5"
              id="M1206"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1207 LK"
              cx="1350"
              cy="285"
              r="1.5"
              id="M1207"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1208 LK"
              cx="1375"
              cy="285"
              r="1.5"
              id="M1208"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1209 LK"
              cx="1400"
              cy="285"
              r="1.5"
              id="M1209"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1210 LK"
              cx="1435"
              cy="300"
              r="1.5"
              id="M1210"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1211 LK"
              cx="1435"
              cy="320"
              r="1.5"
              id="M1211"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1212 LK"
              cx="1435"
              cy="340"
              r="1.5"
              id="M1212"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1213 LK"
              cx="1435"
              cy="360"
              r="1.5"
              id="M1213"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1214 LK"
              cx="1400"
              cy="375"
              r="1.5"
              id="M1214"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1215 LK"
              cx="1375"
              cy="375"
              r="1.5"
              id="M1215"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1216 LK"
              cx="1350"
              cy="375"
              r="1.5"
              id="M1216"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1217 LK"
              cx="1325"
              cy="375"
              r="1.5"
              id="M1217"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1218 LK"
              cx="1300"
              cy="375"
              r="1.5"
              id="M1218"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1219 LK"
              cx="1275"
              cy="375"
              r="1.5"
              id="M1219"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1220 LK"
              cx="1250"
              cy="375"
              r="1.5"
              id="M1220"
              stroke="#79c0a0"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1890 LB"
              cx="255"
              cy="800"
              r="1.5"
              id="M1890"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1889 LB"
              cx="275"
              cy="805"
              r="1.5"
              id="M1889"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1888 LB"
              cx="287.5"
              cy="818"
              r="1.5"
              id="M1888"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1886 LB"
              cx="300"
              cy="831.5"
              r="1.5"
              id="M1886"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1885 LB"
              cx="312.5"
              cy="845"
              r="1.5"
              id="M1885"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1883 LB"
              cx="285"
              cy="900"
              r="1.5"
              id="M1883"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1882 LB"
              cx="245"
              cy="900"
              r="1.5"
              id="M1882"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1881 LB"
              cx="205"
              cy="900"
              r="1.5"
              id="M1881"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1880 LB"
              cx="160"
              cy="900"
              r="1.5"
              id="M1880"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1879 LB"
              cx="120"
              cy="900"
              r="1.5"
              id="M1879"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1878 LB"
              cx="100"
              cy="920"
              r="1.5"
              id="M1878"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1877 LB"
              cx="400"
              cy="965"
              r="1.5"
              id="M1877"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1876 LB"
              cx="455"
              cy="965"
              r="1.5"
              id="M1876"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1875 LB"
              cx="510"
              cy="965"
              r="1.5"
              id="M1875"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1874 LB"
              cx="565"
              cy="965"
              r="1.5"
              id="M1874"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1873 LB"
              cx="620"
              cy="965"
              r="1.5"
              id="M1873"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1872 LB"
              cx="670"
              cy="910"
              r="1.5"
              id="M1872"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1871 LB"
              cx="670"
              cy="890"
              r="1.5"
              id="M1871"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1870 LB"
              cx="695"
              cy="870"
              r="1.5"
              id="M1870"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1869 LB"
              cx="735"
              cy="870"
              r="1.5"
              id="M1869"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1868 LB"
              cx="770"
              cy="870"
              r="1.5"
              id="M1868"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1867 LB"
              cx="800"
              cy="870"
              r="1.5"
              id="M1867"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1866 LB"
              cx="835"
              cy="870"
              r="1.5"
              id="M1866"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1865 LB interchange M4501 LE"
              cx="865"
              cy="870"
              id="M1865"
            >
              <rect
                x="862"
                y="867"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="865"
                cy="870"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
              <circle
                cx="865"
                cy="875"
                r="1.5"
                stroke="#56ab32"
                strokeWidth="1"
                fill="#56ab32"
              />
            </g>
            <circle
              className="marker M1864 LB"
              cx="895"
              cy="870"
              r="1.5"
              id="M1864"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1863 LB"
              cx="940"
              cy="870"
              r="1.5"
              id="M1863"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1861 LB"
              cx="975"
              cy="870"
              r="1.5"
              id="M1861"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1862 LB"
              cx="1010"
              cy="870"
              r="1.5"
              id="M1862"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1859 LB"
              cx="1045"
              cy="870"
              r="1.5"
              id="M1859"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1858 LB interchange M4313 LS"
              cx="1070"
              cy="850"
              id="M1858"
            >
              <rect
                x="1062"
                y="847"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1070"
                cy="850"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
              <circle
                cx="1065"
                cy="850"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <g
              className="marker M1857 LB interchange M4312 LS"
              cx="1090"
              cy="830"
              id="M1857"
            >
              <rect
                x="1082"
                y="827"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1090"
                cy="830"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
              <circle
                cx="1085"
                cy="830"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
            </g>
            <circle
              className="marker M1856 LB"
              cx="1135"
              cy="805"
              r="1.5"
              id="M1856"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1855 LB"
              cx="1170"
              cy="805"
              r="1.5"
              id="M1855"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M1860 LB interchange M1502 LKK"
              cx="1210"
              cy="805"
              id="M1860"
            >
              <rect
                x="1207"
                y="797"
                width="6"
                height="11"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1210"
                cy="805"
                r="1.5"
                stroke="#f8ce49"
                strokeWidth="1"
                fill="#f8ce49"
              />
              <circle
                cx="1210"
                cy="800"
                r="1.5"
                stroke="#004ea7"
                strokeWidth="1"
                fill="#004ea7"
              />
            </g>
            <circle
              className="marker M1854 LB"
              cx="1245"
              cy="805"
              r="1.5"
              id="M1854"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1852 LB"
              cx="1330"
              cy="805"
              r="1.5"
              id="M1852"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1851 LB"
              cx="1360"
              cy="785"
              r="1.5"
              id="M1851"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1028 LB"
              cx="1195"
              cy="765"
              r="1.5"
              id="M1028"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1027 LB"
              cx="1135"
              cy="765"
              r="1.5"
              id="M1027"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1026 LB"
              cx="1075"
              cy="765"
              r="1.5"
              id="M1026"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1024 LB"
              cx="1015"
              cy="700"
              r="1.5"
              id="M1024"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1848 LB"
              cx="1060"
              cy="535"
              r="1.5"
              id="M1848"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M1847 LB"
              cx="1010"
              cy="485"
              r="1.5"
              id="M1847"
              stroke="#f8ce49"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4309 LS"
              cx="930"
              cy="775"
              r="1.5"
              id="M4309"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4310 LS"
              cx="980"
              cy="800"
              r="1.5"
              id="M4310"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <g
              className="marker M4311 LS interchange M1501 LKK"
              cx="1045"
              cy="800"
              id="M4311"
            >
              <rect
                x="1042"
                y="797"
                width="11"
                height="6"
                stroke="black"
                strokeWidth="1"
                fill="#ffffff"
              />
              <circle
                cx="1045"
                cy="800"
                r="1.5"
                stroke="#cd2234"
                strokeWidth="1"
                fill="#cd2234"
              />
              <circle
                cx="1050"
                cy="800"
                r="1.5"
                stroke="#004ea7"
                strokeWidth="1"
                fill="#004ea7"
              />
            </g>
            <circle
              className="marker M4314 LS"
              cx="1045"
              cy="835"
              r="1.5"
              id="M4314"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4315 LS"
              cx="1010"
              cy="835"
              r="1.5"
              id="M4315"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4316 LS"
              cx="975"
              cy="835"
              r="1.5"
              id="M4316"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4317 LS"
              cx="940"
              cy="835"
              r="1.5"
              id="M4317"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4318 LS"
              cx="905"
              cy="835"
              r="1.5"
              id="M4318"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4319 LS"
              cx="870"
              cy="835"
              r="1.5"
              id="M4319"
              stroke="#cd2234"
              strokeWidth="1"
              fill="#ffffff"
            />

            <circle
              className="marker M4710 LW"
              cx="840"
              cy="140"
              r="1.5"
              id="M4710"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4709 LW"
              cx="815"
              cy="135"
              r="1.5"
              id="M4709"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4708 LW"
              cx="780"
              cy="135"
              r="1.5"
              id="M4708"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4707 LW"
              cx="745"
              cy="135"
              r="1.5"
              id="M4707"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4706 LW"
              cx="710"
              cy="135"
              r="1.5"
              id="M4706"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4705 LW"
              cx="680"
              cy="135"
              r="1.5"
              id="M4705"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4704 LW"
              cx="650"
              cy="135"
              r="1.5"
              id="M4704"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4703 LW"
              cx="610"
              cy="135"
              r="1.5"
              id="M4703"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4702 LW"
              cx="575"
              cy="110"
              r="1.5"
              id="M4702"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4701 LW"
              cx="525"
              cy="95"
              r="1.5"
              id="M4701"
              stroke="#878787"
              strokeWidth="1"
              fill="#ffffff"
            />

            <circle
              className="marker M4403 LSL"
              cx="512.5"
              cy="595"
              r="1.5"
              id="M4403"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4405 LSL"
              cx="525"
              cy="650"
              r="1.5"
              id="M4405"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4406 LSL"
              cx="530"
              cy="660"
              r="1.5"
              id="M4406"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4407 LSL"
              cx="540"
              cy="670"
              r="1.5"
              id="M4407"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4409 LSL"
              cx="575"
              cy="710"
              r="1.5"
              id="M4409"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4410 LSL"
              cx="605"
              cy="725"
              r="1.5"
              id="M4410"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
            <circle
              className="marker M4411 LSL"
              cx="635"
              cy="725"
              r="1.5"
              id="M4411"
              stroke="#3399FF"
              strokeWidth="1"
              fill="#ffffff"
            />
          </g>
          {/* <!-- 텍스트 라벨 --> */}
          <g
            className="label-group"
            style={{ fill: "black", letterSpacing: "-1px", fontSize: "9px" }}
          >
            <text
              className="label S1916 L1"
              y="65"
              id="S1916"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="645" dx="0" dy="13" fontSize="9px">
                소요산
              </tspan>
            </text>
            <text
              className="label S1915 L1"
              y="65"
              id="S1915"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="680" dx="0" dy="13" fontSize="9px">
                동두천
              </tspan>
            </text>
            <text
              className="label S1914 L1"
              y="65"
              id="S1914"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="710" dx="0" dy="13" fontSize="9px">
                보산
              </tspan>
            </text>
            <text
              className="label S1913 L1"
              y="65"
              id="S1913"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="742.5" dx="0" dy="13" fontSize="9px">
                동두천중앙
              </tspan>
            </text>
            <text
              className="label S1912 L1"
              y="65"
              id="S1912"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="775" dx="0" dy="13" fontSize="9px">
                지행
              </tspan>
            </text>
            <text
              className="label S1911 L1"
              y="65"
              id="S1911"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="805" dx="0" dy="13" fontSize="9px">
                덕정
              </tspan>
            </text>
            <text
              className="label S1910 L1"
              y="65"
              id="S1910"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="840" dx="0" dy="13" fontSize="9px">
                덕계
              </tspan>
            </text>
            <text
              className="label S1909 L1"
              y="65"
              id="S1909"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="870" dx="0" dy="13" fontSize="9px">
                양주
              </tspan>
            </text>
            <text
              className="label S1908 L1"
              y="65"
              id="S1908"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="902.5" dx="0" dy="13" fontSize="9px">
                녹양
              </tspan>
            </text>
            <text
              className="label S1907 L1"
              y="65"
              id="S1907"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="935" dx="0" dy="13" fontSize="9px">
                가능
              </tspan>
            </text>
            <text
              className="label S1906 L1"
              y="65"
              id="S1906"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="965" dx="0" dy="13" fontSize="9px">
                의정부
              </tspan>
            </text>
            <text
              className="label S1905 L1 S4602 LU"
              y="65"
              id="S1905"
              style={{ textAnchor: "start" }}
            >
              <tspan x="992.5" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                회룡
              </tspan>
            </text>
            <text
              className="label S1904 L1"
              y="65"
              id="S1904"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1030" dx="0" dy="13" fontSize="9px">
                망월사
              </tspan>
            </text>
            <text
              className="label S1903 L1 S2712 L7"
              y="80"
              id="S1903"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                도봉산
              </tspan>
            </text>
            <text
              className="label S1902 L1"
              y="100"
              id="S1902"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="5" dy="3" fontSize="9px">
                도봉
              </tspan>
            </text>
            <text
              className="label S1901 L1"
              y="120"
              id="S1901"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="5" dy="3" fontSize="9px">
                방학
              </tspan>
            </text>
            <text
              className="label S1022 L1 S0412 L4"
              y="155"
              id="S0412"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                창동
              </tspan>
            </text>
            <text
              className="label S1021 L1"
              y="172.5"
              id="S1021"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="5" dy="3" fontSize="9px">
                녹천
              </tspan>
            </text>
            <text
              className="label S1020 L1"
              y="190"
              id="S1020"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="5" dy="3" fontSize="9px">
                월계
              </tspan>
            </text>
            <text
              className="label S1019 L1 S LG"
              y="210"
              id="S1019"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                광운대
              </tspan>
            </text>
            <text
              className="label S1018 L1 S2645 L6"
              y="225"
              id="S1018"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                석계
              </tspan>
            </text>
            <text
              className="label S1017 L1"
              y="245"
              id="S1017"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1065" dx="3" dy="11" fontSize="9px">
                신이문
              </tspan>
            </text>
            <text
              className="label S1016 L1"
              y="260"
              id="S1016"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1050" dx="3" dy="11" fontSize="9px">
                외대앞
              </tspan>
            </text>
            <text
              className="label S1015 L1 S1307 LG S101C LK"
              y="275"
              id="S1015"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1030" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                회기
              </tspan>
            </text>
            <text
              className="label S0158 L1 S1306 LG S1014 LK S1845 LB"
              y="275"
              id="S0158"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="995" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                청량리
              </tspan>
            </text>
            <text
              className="label S0157 L1"
              y="275"
              id="S0157"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="960" dx="0" dy="-5" fontSize="9px">
                제기동
              </tspan>
            </text>
            <text
              className="label S0156 L1 S0246 L2 S4713 LW"
              y="275"
              id="S0156"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="930" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                신설동
              </tspan>
            </text>
            <text
              className="label S0159 L1 S2637 L6"
              y="275"
              id="S0159"
              style={{ textAnchor: "end" }}
            >
              <tspan x="900" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                동묘앞
              </tspan>
            </text>
            <text
              className="label S0155 L1 S0421 L4"
              y="275"
              id="S0155"
              style={{ textAnchor: "end" }}
            >
              <tspan x="865" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                동대문
              </tspan>
            </text>
            <text
              className="label S0154 L1"
              y="275"
              id="S0154"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="795" dx="0" dy="-5" fontSize="9px">
                종로5가
              </tspan>
            </text>
            <text
              className="label S0153 L1 S0319 L3 S2535 L5"
              y="275"
              id="S0153"
              style={{ textAnchor: "start" }}
            >
              <tspan x="715" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                종로3가
              </tspan>
            </text>
            <text
              className="label S0152 L1"
              y="310"
              id="S0152"
              style={{ textAnchor: "end" }}
            >
              <tspan x="680" dx="-3" dy="-3" fontSize="9px">
                종각
              </tspan>
            </text>
            <text
              className="label S0151 L1 S0201 L2"
              y="345"
              id="S0151"
              style={{ textAnchor: "end" }}
            >
              <tspan x="655" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                시청
              </tspan>
            </text>
            <text
              className="label S0150 L1 S0426 L4 S4201 LA S1251 LK"
              y="400"
              id="S0150"
              style={{ textAnchor: "start" }}
            >
              <tspan x="655" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                서울역
              </tspan>
            </text>
            <text
              className="label S1002 L1"
              y="440"
              id="S1002"
              style={{ textAnchor: "start" }}
            >
              <tspan x="655" dx="5" dy="3" fontSize="9px">
                남영
              </tspan>
            </text>
            <text
              className="label S1003 L1 S100C LK"
              y="545"
              id="S1003"
              style={{ textAnchor: "start" }}
            >
              <tspan x="655" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                용산
              </tspan>
            </text>
            <text
              className="label S1004 L1 S4117 L9"
              y="565"
              id="S1004"
              style={{ textAnchor: "end" }}
            >
              <tspan x="590" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                노량진
              </tspan>
            </text>
            <text
              className="label S1005 L1 S4402 LSL"
              y="545"
              id="S1005"
              style={{ textAnchor: "end" }}
            >
              <tspan x="512.5" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                대방
              </tspan>
            </text>
            <text
              className="label S1032 L1 S2526 L5"
              y="515"
              id="S1032"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="475" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                신길
              </tspan>
            </text>
            <text
              className="label S1006 L1"
              y="530"
              id="S1006"
              style={{ textAnchor: "end" }}
            >
              <tspan x="460" dx="-3" dy="-3" fontSize="9px">
                영등포
              </tspan>
            </text>
            <text
              className="label S1007 L1 S0234 L2"
              y="550"
              id="S1007"
              style={{ textAnchor: "start" }}
            >
              <tspan x="440" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                신도림
              </tspan>
            </text>
            <text
              className="label S1701 S1701 L1"
              y="575"
              id="S1701"
              style={{ textAnchor: "start" }}
            >
              <tspan x="415" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                구로
              </tspan>
            </text>
            <text
              className="label S1813 L1"
              y="590"
              id="S1813"
              style={{ textAnchor: "end" }}
            >
              <tspan x="400" dx="-3" dy="-3" fontSize="9px">
                구일
              </tspan>
            </text>
            <text
              className="label S1801 L1"
              y="595"
              id="S1801"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="380" dx="0" dy="13" fontSize="9px">
                개봉
              </tspan>
            </text>
            <text
              className="label S1802 L1"
              y="595"
              id="S1802"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="355" dx="0" dy="13" fontSize="9px">
                오류동
              </tspan>
            </text>
            <text
              className="label S1821 L1 S2752 L7"
              y="600"
              id="S1821"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="330" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                온수
              </tspan>
            </text>
            <text
              className="label S1803 L1"
              y="625"
              id="S1803"
              style={{ textAnchor: "end" }}
            >
              <tspan x="305" dx="-3" dy="-3" fontSize="9px">
                역곡
              </tspan>
            </text>
            <text
              className="label S1814 L1 S4804 LSH"
              y="645"
              id="S1814"
              style={{ textAnchor: "end" }}
            >
              <tspan x="285" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                소사
              </tspan>
            </text>
            <text
              className="label S1804 L1"
              y="670"
              id="S1804"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="255" dx="0" dy="-5" fontSize="9px">
                부천
              </tspan>
            </text>
            <text
              className="label S1822 L1"
              y="670"
              id="S1822"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="222.5" dx="0" dy="-5" fontSize="9px">
                중동
              </tspan>
            </text>
            <text
              className="label S1805 L1"
              y="670"
              id="S1805"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="195" dx="0" dy="-5" fontSize="9px">
                송내
              </tspan>
            </text>
            <text
              className="label S1815 L1"
              y="670"
              id="S1815"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="167.5" dx="0" dy="-5" fontSize="9px">
                부개
              </tspan>
            </text>
            <text
              className="label S1806 L1 S3120 LI"
              y="670"
              id="S1806"
              style={{ textAnchor: "end" }}
            >
              <tspan x="140" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                부평
              </tspan>
            </text>
            <text
              className="label S1807 L1"
              y="670"
              id="S1807"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="115" dx="0" dy="-5" fontSize="9px">
                백운
              </tspan>
            </text>
            <text
              className="label S1808 L1"
              y="697.5"
              id="S1808"
              style={{ textAnchor: "start" }}
            >
              <tspan x="95" dx="5" dy="3" fontSize="9px">
                동암
              </tspan>
            </text>
            <text
              className="label S1816 L1"
              y="715"
              id="S1816"
              style={{ textAnchor: "start" }}
            >
              <tspan x="95" dx="5" dy="3" fontSize="9px">
                간석
              </tspan>
            </text>
            <text
              className="label S1809 L1 S3218 LI2"
              y="735"
              id="S1809"
              style={{ textAnchor: "start" }}
            >
              <tspan x="95" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                주안
              </tspan>
            </text>
            <text
              className="label S1823 L1"
              y="760"
              id="S1823"
              style={{ textAnchor: "end" }}
            >
              <tspan x="95" dx="-5" dy="3" fontSize="9px">
                도화
              </tspan>
            </text>
            <text
              className="label S1810 L1"
              y="800"
              id="S1810"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="125" dx="0" dy="-5" fontSize="9px">
                제물포
              </tspan>
            </text>
            <text
              className="label S1817 L1"
              y="800"
              id="S1817"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="155" dx="0" dy="-5" fontSize="9px">
                도원
              </tspan>
            </text>
            <text
              className="label S1811 L1"
              y="800"
              id="S1811"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="185" dx="0" dy="-5" fontSize="9px">
                동인천
              </tspan>
            </text>
            <text
              className="label S1812 L1 S1891 LB"
              y="800"
              id="S1812"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="220" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                인천
              </tspan>
            </text>
            <text
              className="label S1702 L1 S2748 L7"
              y="640"
              id="S1702"
              style={{ textAnchor: "end" }}
            >
              <tspan x="415" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                가산
              </tspan>
              <tspan
                x="415"
                dx="-7"
                dy="12"
                fontSize="9px"
                className="fdy660"
                fontWeight="bold"
              >
                디지털단지
              </tspan>
            </text>
            <text
              className="label S1714 L1"
              y="685"
              id="S1714"
              style={{ textAnchor: "start" }}
            >
              <tspan x="415" dx="5" dy="3" fontSize="9px">
                독산
              </tspan>
            </text>
            <text
              className="label S1703 S1703 L1"
              y="720"
              id="S1703"
              style={{ textAnchor: "start" }}
            >
              <tspan x="415" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                금천구청
              </tspan>
            </text>
            <text
              className="label S1750 L1"
              y="700"
              id="S1750"
              style={{ textAnchor: "end" }}
            >
              <tspan x="390" dx="-5" dy="3" fontSize="9px">
                광명
              </tspan>
            </text>
            <text
              className="label S1704 L1"
              y="720"
              id="S1704"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="470" dx="0" dy="13" fontSize="9px">
                석수
              </tspan>
            </text>
            <text
              className="label S1705 L1"
              y="750"
              id="S1705"
              style={{ textAnchor: "end" }}
            >
              <tspan x="515" dx="-5" dy="3" fontSize="9px">
                관악
              </tspan>
            </text>
            <text
              className="label S1706 L1"
              y="790"
              id="S1706"
              style={{ textAnchor: "end" }}
            >
              <tspan x="515" dx="-5" dy="3" fontSize="9px">
                안양
              </tspan>
            </text>
            <text
              className="label S1707 L1"
              y="830"
              id="S1707"
              style={{ textAnchor: "end" }}
            >
              <tspan x="515" dx="-5" dy="3" fontSize="9px">
                명학
              </tspan>
            </text>
            <text
              className="label S1708 L1 S1458 L4"
              y="860"
              id="S1708"
              style={{ textAnchor: "start" }}
            >
              <tspan x="515" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                금정
              </tspan>
            </text>
            <text
              className="label S1709 L1"
              y="910"
              id="S1709"
              style={{ textAnchor: "start" }}
            >
              <tspan x="530" dx="3" dy="-3" fontSize="9px">
                군포
              </tspan>
            </text>
            <text
              className="label S1729 L1"
              y="930"
              id="S1729"
              style={{ textAnchor: "end" }}
            >
              <tspan x="550" dx="-3" dy="11" fontSize="9px">
                당정
              </tspan>
            </text>
            <text
              className="label S1710 L1"
              y="950"
              id="S1710"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="585" dx="0" dy="-5" fontSize="9px">
                의왕
              </tspan>
            </text>
            <text
              className="label S1711 L1"
              y="950"
              id="S1711"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="620" dx="0" dy="-5" fontSize="9px">
                성균관대
              </tspan>
            </text>
            <text
              className="label S1712 L1"
              y="950"
              id="S1712"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="647.5" dx="0" dy="-5" fontSize="9px">
                화서
              </tspan>
            </text>
            <text
              className="label S1713 L1 S1846 LB"
              y="950"
              id="S1713"
              style={{ textAnchor: "start" }}
            >
              <tspan x="670" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                수원
              </tspan>
            </text>
            <text
              className="label S1715 L1"
              y="950"
              id="S1715"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="697.5" dx="0" dy="-5" fontSize="9px">
                세류
              </tspan>
            </text>
            <text
              className="label S1716 S1716 L1"
              y="950"
              id="S1716"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="730" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                병점
              </tspan>
            </text>
            <text
              className="label S1717 L1"
              y="950"
              id="S1717"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="760" dx="0" dy="-5" fontSize="9px">
                세마
              </tspan>
            </text>
            <text
              className="label S1718 L1"
              y="950"
              id="S1718"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="795" dx="0" dy="-5" fontSize="9px">
                오산대
              </tspan>
            </text>
            <text
              className="label S1719 L1"
              y="950"
              id="S1719"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="825" dx="0" dy="-5" fontSize="9px">
                오산
              </tspan>
            </text>
            <text
              className="label S1720 L1"
              y="950"
              id="S1720"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="855" dx="0" dy="-5" fontSize="9px">
                진위
              </tspan>
            </text>
            <text
              className="label S1721 L1"
              y="950"
              id="S1721"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="885" dx="0" dy="-5" fontSize="9px">
                송탄
              </tspan>
            </text>
            <text
              className="label S1722 L1"
              y="950"
              id="S1722"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="917.5" dx="0" dy="-5" fontSize="9px">
                서정리
              </tspan>
            </text>
            <text
              className="label S1723 L1"
              y="950"
              id="S1723"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="950" dx="0" dy="-5" fontSize="9px">
                평택지제
              </tspan>
            </text>
            <text
              className="label S1724 L1"
              y="950"
              id="S1724"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="980" dx="0" dy="-5" fontSize="9px">
                평택
              </tspan>
            </text>
            <text
              className="label S1725 L1"
              y="950"
              id="S1725"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1010" dx="0" dy="-5" fontSize="9px">
                성환
              </tspan>
            </text>
            <text
              className="label S1726 L1"
              y="950"
              id="S1726"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1040" dx="0" dy="-5" fontSize="9px">
                직산
              </tspan>
            </text>
            <text
              className="label S1727 L1"
              y="950"
              id="S1727"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1070" dx="0" dy="-5" fontSize="9px">
                두정
              </tspan>
            </text>
            <text
              className="label S1728 L1"
              y="950"
              id="S1728"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1100" dx="0" dy="-5" fontSize="9px">
                천안
              </tspan>
            </text>
            <text
              className="label S1401 L1"
              y="950"
              id="S1401"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1130" dx="0" dy="-5" fontSize="9px">
                봉명
              </tspan>
            </text>
            <text
              className="label S1402 L1"
              y="950"
              id="S1402"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1165" dx="0" dy="-5" fontSize="9px">
                쌍용
              </tspan>
            </text>
            <text
              className="label S1403 L1"
              y="950"
              id="S1403"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1197.5" dx="0" dy="-5" fontSize="9px">
                아산
              </tspan>
            </text>
            <text
              className="label S1404 L1"
              y="950"
              id="S1404"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1230" dx="0" dy="-5" fontSize="9px">
                탕정
              </tspan>
            </text>
            <text
              className="label S1405 L1"
              y="950"
              id="S1405"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1270" dx="0" dy="-5" fontSize="9px">
                배방
              </tspan>
            </text>
            <text
              className="label S1407 L1"
              y="950"
              id="S1407"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1310" dx="0" dy="-5" fontSize="9px">
                온양온천
              </tspan>
            </text>
            <text
              className="label S1408 L1"
              y="950"
              id="S1408"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1350" dx="0" dy="-5" fontSize="9px">
                신창
              </tspan>
            </text>
            <text
              className="label S1749 L1"
              y="920"
              id="S1749"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="730" dx="0" dy="-5" fontSize="9px">
                서동탄
              </tspan>
            </text>
            <text
              className="label S0200 L2 S2519 L5"
              y="460"
              id="S0200"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="290" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                까치산
              </tspan>
            </text>
            <text
              className="label S0249 L2"
              y="495"
              id="S0249"
              style={{ textAnchor: "start" }}
            >
              <tspan x="325" dx="3" dy="-3" fontSize="9px">
                신정네거리
              </tspan>
            </text>
            <text
              className="label S0248 L2"
              y="515"
              id="S0248"
              style={{ textAnchor: "start" }}
            >
              <tspan x="345" dx="3" dy="-3" fontSize="9px">
                양천구청
              </tspan>
            </text>
            <text
              className="label S0247 L2"
              y="535"
              id="S0247"
              style={{ textAnchor: "start" }}
            >
              <tspan x="365" dx="3" dy="-3" fontSize="9px">
                도림천
              </tspan>
            </text>
            <text
              className="label S0235 L2"
              y="500"
              id="S0235"
              style={{ textAnchor: "start" }}
            >
              <tspan x="415" dx="5" dy="3" fontSize="9px">
                문래
              </tspan>
            </text>
            <text
              className="label S0236 L2 S2524 L5"
              y="460"
              id="S0236"
              style={{ textAnchor: "end" }}
            >
              <tspan x="415" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                영등포구청
              </tspan>
            </text>
            <text
              className="label S0237 L2 S4113 L9"
              y="445"
              id="S0237"
              style={{ textAnchor: "end" }}
            >
              <tspan x="460" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                당산
              </tspan>
            </text>
            <text
              className="label S0238 L2 S2623 L6"
              y="445"
              id="S0238"
              style={{ textAnchor: "end" }}
            >
              <tspan x="510" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                합정
              </tspan>
            </text>
            <text
              className="label S0239 L2 S1264 LK S4203 LA"
              y="410"
              id="S0239"
              style={{ textAnchor: "start" }}
            >
              <tspan x="550" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                홍대입구
              </tspan>
            </text>
            <text
              className="label S0240 L2"
              y="382.5"
              id="S0240"
              style={{ textAnchor: "start" }}
            >
              <tspan x="550" dx="5" dy="3" fontSize="9px">
                신촌
              </tspan>
            </text>
            <text
              className="label S0241 L2"
              y="370"
              id="S0241"
              style={{ textAnchor: "end" }}
            >
              <tspan x="550" dx="-5" dy="3" fontSize="9px">
                이대
              </tspan>
            </text>
            <text
              className="label S0242 L2"
              y="355"
              id="S0242"
              style={{ textAnchor: "end" }}
            >
              <tspan x="550" dx="-5" dy="3" fontSize="9px">
                아현
              </tspan>
            </text>
            <text
              className="label S0243 L2 S2532 L5"
              y="345"
              id="S0243"
              style={{ textAnchor: "end" }}
            >
              <tspan x="605" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                충정로
              </tspan>
            </text>
            <text
              className="label S0202 L2"
              y="345"
              id="S0202"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="690" dx="0" dy="-5" fontSize="9px">
                을지로입구
              </tspan>
            </text>
            <text
              className="label S0203 L2 S0320 L3"
              y="345"
              id="S0203"
              style={{ textAnchor: "start" }}
            >
              <tspan x="720" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                을지로3가
              </tspan>
            </text>
            <text
              className="label S0204 L2 S2536 L5"
              y="345"
              id="S0204"
              style={{ textAnchor: "end" }}
            >
              <tspan x="790" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                을지로4가
              </tspan>
            </text>
            <text
              className="label S0205 L2 S0422 L4 S2537 L5"
              y="340"
              id="S0205"
              style={{ textAnchor: "end" }}
            >
              <tspan x="850" dx="-7" dy="-12" fontSize="9px" fontWeight="bold">
                동대문역사
              </tspan>
              <tspan
                x="850"
                dx="-7"
                dy="9"
                className="fdy330"
                fontSize="9px"
                fontWeight="bold"
              >
                문화공원
              </tspan>
            </text>
            <text
              className="label S0206 L2 S2636 L6"
              y="345"
              id="S0206"
              style={{ textAnchor: "start" }}
            >
              <tspan x="900" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                신당
              </tspan>
            </text>
            <text
              className="label S0207 L2"
              y="360"
              id="S0207"
              style={{ textAnchor: "end" }}
            >
              <tspan x="960" dx="-3" dy="11" fontSize="9px">
                상왕십리
              </tspan>
            </text>
            <text
              className="label S0208 L2 S2541 L5 S1013 LK S102C LB"
              y="390"
              id="S0208"
              style={{ textAnchor: "start" }}
            >
              <tspan x="990" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                왕십리
              </tspan>
            </text>
            <text
              className="label S0209 L2"
              y="420"
              id="S0209"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1020" dx="-3" dy="11" fontSize="9px">
                한양대
              </tspan>
            </text>
            <text
              className="label S0210 L2"
              y="435"
              id="S0210"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1035" dx="-3" dy="11" fontSize="9px">
                뚝섬
              </tspan>
            </text>
            <text
              className="label S0211 S0211 L2"
              y="455"
              id="S0211"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1055" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                성수
              </tspan>
            </text>
            <text
              className="label S0212 L2 S2729 L7"
              y="485"
              id="S0212"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1165" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                건대입구
              </tspan>
            </text>
            <text
              className="label S0213 L2"
              y="500"
              id="S0213"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1200" dx="3" dy="-3" fontSize="9px">
                구의
              </tspan>
            </text>
            <text
              className="label S0214 L2"
              y="530"
              id="S0214"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1230" dx="3" dy="-3" fontSize="9px">
                강변
              </tspan>
            </text>
            <text
              className="label S0215 L2"
              y="585"
              id="S0215"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1255" dx="5" dy="3" fontSize="9px">
                잠실나루
              </tspan>
            </text>
            <text
              className="label S0216 L2 S2815 L8"
              y="635"
              id="S0216"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1255" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                잠실
              </tspan>
            </text>
            <text
              className="label S0217 L2"
              y="680"
              id="S0217"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1237.5" dx="0" dy="-5" fontSize="9px">
                잠실새내
              </tspan>
            </text>
            <text
              className="label S0218 L2 S4130 L9"
              y="680"
              id="S0218"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1145" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                종합운동장
              </tspan>
            </text>
            <text
              className="label S0219 L2"
              y="680"
              id="S0219"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1085" dx="0" dy="-5" fontSize="9px">
                삼성
              </tspan>
            </text>
            <text
              className="label S0220 L2 S1023 LB"
              y="680"
              id="S0220"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1015" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                선릉
              </tspan>
            </text>
            <text
              className="label S0221 L2"
              y="680"
              id="S0221"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="970" dx="0" dy="-5" fontSize="9px">
                역삼
              </tspan>
            </text>
            <text
              className="label S0222 L2 S4307 LS"
              y="680"
              id="S0222"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="920" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                강남
              </tspan>
            </text>
            <text
              className="label S0223 L2 S0330 L3"
              y="680"
              id="S0223"
              style={{ textAnchor: "end" }}
            >
              <tspan x="860" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                교대
              </tspan>
            </text>
            <text
              className="label S0224 L2"
              y="680"
              id="S0224"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="805" dx="0" dy="13" fontSize="9px">
                서초
              </tspan>
            </text>
            <text
              className="label S0225 L2"
              y="680"
              id="S0225"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="760" dx="0" dy="13" fontSize="9px">
                방배
              </tspan>
            </text>
            <text
              className="label S0226 L2 S0433 L4"
              y="680"
              id="S0226"
              style={{ textAnchor: "start" }}
            >
              <tspan x="705" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                사당
              </tspan>
            </text>
            <text
              className="label S0227 L2"
              y="680"
              id="S0227"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="677.5" dx="0" dy="13" fontSize="9px">
                낙성대
              </tspan>
            </text>
            <text
              className="label S0228 L2"
              y="680"
              id="S0228"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="635" dx="0" dy="13" fontSize="9px">
                서울대입구
              </tspan>
            </text>
            <text
              className="label S0229 L2"
              y="680"
              id="S0229"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="585" dx="0" dy="13" fontSize="9px">
                봉천
              </tspan>
            </text>
            <text
              className="label S0230 L2 S4408 LSL"
              y="680"
              id="S0230"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="545" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                신림
              </tspan>
            </text>
            <text
              className="label S0231 L2"
              y="680"
              id="S0231"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="500" dx="0" dy="13" fontSize="9px">
                신대방
              </tspan>
            </text>
            <text
              className="label S0232 L2"
              y="670"
              id="S0232"
              style={{ textAnchor: "start" }}
            >
              <tspan x="460" dx="5" dy="3" fontSize="9px">
                구로디지털단지
              </tspan>
            </text>
            <text
              className="label S0233 L2 S2746 L7"
              y="640"
              id="S0233"
              style={{ textAnchor: "start" }}
            >
              <tspan x="460" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                대림
              </tspan>
            </text>
            <text
              className="label S0244 L2"
              y="420"
              id="S0244"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1055" dx="5" dy="3" fontSize="9px">
                용답
              </tspan>
            </text>
            <text
              className="label S0245 L2"
              y="315"
              id="S0245"
              style={{ textAnchor: "end" }}
            >
              <tspan x="975" dx="-3" dy="11" fontSize="9px">
                신답
              </tspan>
            </text>
            <text
              className="label S0250 L2"
              y="295"
              id="S0250"
              style={{ textAnchor: "end" }}
            >
              <tspan x="955" dx="-3" dy="11" fontSize="9px">
                용두
              </tspan>
            </text>
            <text
              className="label S1958 L3"
              y="175"
              id="S1958"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="80" dx="0" dy="-5" fontSize="9px">
                대화
              </tspan>
            </text>
            <text
              className="label S1957 L3"
              y="175"
              id="S1957"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="120" dx="0" dy="-5" fontSize="9px">
                주엽
              </tspan>
            </text>
            <text
              className="label S1956 L3"
              y="175"
              id="S1956"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="157.5" dx="0" dy="-5" fontSize="9px">
                정발산
              </tspan>
            </text>
            <text
              className="label S1955 L3"
              y="175"
              id="S1955"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="194.5" dx="0" dy="-5" fontSize="9px">
                마두
              </tspan>
            </text>
            <text
              className="label S1954 L3"
              y="175"
              id="S1954"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="230" dx="0" dy="-5" fontSize="9px">
                백석
              </tspan>
            </text>
            <text
              className="label S1953 L3 S0300 LK"
              y="175"
              id="S1953"
              style={{ textAnchor: "end" }}
            >
              <tspan x="265" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                대곡
              </tspan>
            </text>
            <text
              className="label S1952 L3"
              y="175"
              id="S1952"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="287.5" dx="0" dy="-5" fontSize="9px">
                화정
              </tspan>
            </text>
            <text
              className="label S1951 L3"
              y="175"
              id="S1951"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="315" dx="0" dy="-5" fontSize="9px">
                원당
              </tspan>
            </text>
            <text
              className="label S1948 L3"
              y="175"
              id="S1948"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="340" dx="0" dy="-5" fontSize="9px">
                원흥
              </tspan>
            </text>
            <text
              className="label S1950 L3"
              y="175"
              id="S1950"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="365" dx="0" dy="-5" fontSize="9px">
                삼송
              </tspan>
            </text>
            <text
              className="label S0309 L3"
              y="175"
              id="S0309"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="391" dx="0" dy="-5" fontSize="9px">
                지축
              </tspan>
            </text>
            <text
              className="label S0310 L3"
              y="175"
              id="S0310"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="419" dx="0" dy="-5" fontSize="9px">
                구파발
              </tspan>
            </text>
            <text
              className="label S0311 L3 S2615 L6"
              y="175"
              id="S0311"
              style={{ textAnchor: "end" }}
            >
              <tspan x="440" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                연신내
              </tspan>
            </text>
            <text
              className="label S0312 L3 S2613 L6"
              y="175"
              id="S0312"
              style={{ textAnchor: "start" }}
            >
              <tspan x="500" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                불광
              </tspan>
            </text>
            <text
              className="label S0313 L3"
              y="175"
              id="S0313"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="542.5" dx="0" dy="-5" fontSize="9px">
                녹번
              </tspan>
            </text>
            <text
              className="label S0314 L3"
              y="175"
              id="S0314"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="575" dx="0" dy="-5" fontSize="9px">
                홍제
              </tspan>
            </text>
            <text
              className="label S0315 L3"
              y="175"
              id="S0315"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="605" dx="0" dy="-5" fontSize="9px">
                무악재
              </tspan>
            </text>
            <text
              className="label S0316 L3"
              y="200"
              id="S0316"
              style={{ textAnchor: "start" }}
            >
              <tspan x="645" dx="3" dy="-3" fontSize="9px">
                독립문
              </tspan>
            </text>
            <text
              className="label S0317 L3"
              y="225"
              id="S0317"
              style={{ textAnchor: "start" }}
            >
              <tspan x="670" dx="3" dy="-3" fontSize="9px">
                경복궁
              </tspan>
            </text>
            <text
              className="label S0318 L3"
              y="245"
              id="S0318"
              style={{ textAnchor: "start" }}
            >
              <tspan x="690" dx="3" dy="-3" fontSize="9px">
                안국
              </tspan>
            </text>
            <text
              className="label S0321 L3 S0423 L4"
              y="400"
              id="S0321"
              style={{ textAnchor: "start" }}
            >
              <tspan x="775" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                충무로
              </tspan>
            </text>
            <text
              className="label S0322 L3"
              y="435"
              id="S0322"
              style={{ textAnchor: "end" }}
            >
              <tspan x="810" dx="-3" dy="11" fontSize="9px">
                동대입구
              </tspan>
            </text>
            <text
              className="label S0323 L3 S2634 L6"
              y="475"
              id="S0323"
              style={{ textAnchor: "start" }}
            >
              <tspan x="850" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                약수
              </tspan>
            </text>
            <text
              className="label S0324 L3"
              y="500"
              id="S0324"
              style={{ textAnchor: "start" }}
            >
              <tspan x="860" dx="5" dy="3" fontSize="9px">
                금호
              </tspan>
            </text>
            <text
              className="label S0325 L3 S1011 LK"
              y="530"
              id="S0325"
              style={{ textAnchor: "start" }}
            >
              <tspan x="860" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                옥수
              </tspan>
            </text>
            <text
              className="label S0326 L3"
              y="570"
              id="S0326"
              style={{ textAnchor: "start" }}
            >
              <tspan x="860" dx="5" dy="3" fontSize="9px">
                압구정
              </tspan>
            </text>
            <text
              className="label S0327 L3 S4304 LS"
              y="590"
              id="S0327"
              style={{ textAnchor: "end" }}
            >
              <tspan x="860" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                신사
              </tspan>
            </text>
            <text
              className="label S0328 L3"
              y="610"
              id="S0328"
              style={{ textAnchor: "start" }}
            >
              <tspan x="860" dx="5" dy="3" fontSize="9px">
                잠원
              </tspan>
            </text>
            <text
              className="label S0329 L3 S2736 L7 S4123 L9"
              y="645"
              id="S0329"
              style={{ textAnchor: "start" }}
            >
              <tspan x="860" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                고속터미널
              </tspan>
            </text>
            <text
              className="label S0331 L3"
              y="700"
              id="S0331"
              style={{ textAnchor: "end" }}
            >
              <tspan x="880" dx="-3" dy="11" fontSize="9px">
                남부터미널
              </tspan>
            </text>
            <text
              className="label S0332 L3 S4308 LS"
              y="725"
              id="S0332"
              style={{ textAnchor: "end" }}
            >
              <tspan x="920" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                양재
              </tspan>
            </text>
            <text
              className="label S0333 L3"
              y="725"
              id="S0333"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="960" dx="0" dy="-5" fontSize="9px">
                매봉
              </tspan>
            </text>
            <text
              className="label S0334 L3 S1025 LB"
              y="725"
              id="S0334"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1015" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                도곡
              </tspan>
            </text>
            <text
              className="label S0335 L3"
              y="725"
              id="S0335"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1065" dx="0" dy="-5" fontSize="9px">
                대치
              </tspan>
            </text>
            <text
              className="label S0336 L3"
              y="725"
              id="S0336"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1110" dx="0" dy="-5" fontSize="9px">
                학여울
              </tspan>
            </text>
            <text
              className="label S0337 L3"
              y="725"
              id="S0337"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1175" dx="0" dy="-5" fontSize="9px">
                대청
              </tspan>
            </text>
            <text
              className="label S0338 L3"
              y="725"
              id="S0338"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1220" dx="0" dy="-5" fontSize="9px">
                일원
              </tspan>
            </text>
            <text
              className="label S0339 L3 S1030 LB"
              y="765"
              id="S0339"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1285" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                수서
              </tspan>
            </text>
            <text
              className="label S0340 L3 S2818 L8"
              y="717.5"
              id="S2818"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1332.5" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                가락시장
              </tspan>
            </text>
            <text
              className="label S0341 L3"
              y="675"
              id="S0341"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1375" dx="-3" dy="-3" fontSize="9px">
                경찰병원
              </tspan>
            </text>
            <text
              className="label S0342 L3 S2558 L5"
              y="640"
              id="S2558"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                오금
              </tspan>
            </text>
            <text
              className="label S0405 L4"
              y="80"
              id="S0405"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1290" dx="-3" dy="-3" fontSize="9px">
                진접
              </tspan>
            </text>
            <text
              className="label S0406 L4"
              y="100"
              id="S0406"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1270" dx="-3" dy="-3" fontSize="9px">
                오남
              </tspan>
            </text>
            <text
              className="label S0408 L4"
              y="120"
              id="S0408"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1250" dx="-3" dy="-3" fontSize="9px">
                별내별가람
              </tspan>
            </text>
            <text
              className="label S0409 L4"
              y="140"
              id="S0409"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1230" dx="-3" dy="-3" fontSize="9px">
                당고개
              </tspan>
            </text>
            <text
              className="label S0410 L4"
              y="155"
              id="S0410"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1195" dx="0" dy="-5" fontSize="9px">
                상계
              </tspan>
            </text>
            <text
              className="label S0411 L4 S2715 L7"
              y="155"
              id="S0411"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1150" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                노원
              </tspan>
            </text>
            <text
              className="label S0413 L4"
              y="155"
              id="S0413"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1030" dx="0" dy="-5" fontSize="9px">
                쌍문
              </tspan>
            </text>
            <text
              className="label S0414 L4"
              y="155"
              id="S0414"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1000" dx="0" dy="-5" fontSize="9px">
                수유
              </tspan>
            </text>
            <text
              className="label S0415 L4"
              y="155"
              id="S0415"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="955" dx="0" dy="-5" fontSize="9px">
                미아
              </tspan>
            </text>
            <text
              className="label S0416 L4"
              y="155"
              id="S0416"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="915" dx="0" dy="-5" fontSize="9px">
                미아사거리
              </tspan>
            </text>
            <text
              className="label S0417 L4"
              y="155"
              id="S0417"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="880" dx="0" dy="-5" fontSize="9px">
                길음
              </tspan>
            </text>
            <text
              className="label S0418 L4 S4711 LW"
              y="170"
              id="S0418"
              style={{ textAnchor: "end" }}
            >
              <tspan x="865" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                성신여대입구
              </tspan>
            </text>
            <text
              className="label S0419 L4"
              y="200"
              id="S0419"
              style={{ textAnchor: "end" }}
            >
              <tspan x="865" dx="-5" dy="3" fontSize="9px">
                한성대입구
              </tspan>
            </text>
            <text
              className="label S0420 L4"
              y="230"
              id="S0420"
              style={{ textAnchor: "end" }}
            >
              <tspan x="865" dx="-5" dy="3" fontSize="9px">
                혜화
              </tspan>
            </text>
            <text
              className="label S0424 L4"
              y="400"
              id="S0424"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="745" dx="0" dy="-5" fontSize="9px">
                명동
              </tspan>
            </text>
            <text
              className="label S0425 L4"
              y="400"
              id="S0425"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="715" dx="0" dy="-5" fontSize="9px">
                회현
              </tspan>
            </text>
            <text
              className="label S0427 L4"
              y="435"
              id="S0427"
              style={{ textAnchor: "start" }}
            >
              <tspan x="690" dx="3" dy="-3" fontSize="9px">
                숙대입구
              </tspan>
            </text>
            <text
              className="label S0428 L4 S2629 L6"
              y="475"
              id="S0428"
              style={{ textAnchor: "end" }}
            >
              <tspan x="705" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                삼각지
              </tspan>
            </text>
            <text
              className="label S0429 L4"
              y="515"
              id="S0429"
              style={{ textAnchor: "end" }}
            >
              <tspan x="705" dx="-5" dy="3" fontSize="9px">
                신용산
              </tspan>
            </text>
            <text
              className="label S0430 L4 S1008 LK"
              y="545"
              id="S0430"
              style={{ textAnchor: "start" }}
            >
              <tspan x="705" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                이촌
              </tspan>
            </text>
            <text
              className="label S0431 L4 S4120 L9"
              y="600"
              id="S0431"
              style={{ textAnchor: "start" }}
            >
              <tspan x="705" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                동작
              </tspan>
            </text>
            <text
              className="label S0432 L4 S2738 L7"
              y="640"
              id="S0432"
              style={{ textAnchor: "start" }}
            >
              <tspan x="705" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                총신대입구
              </tspan>
            </text>
            <text
              className="label S0434 L4"
              y="705"
              id="S0434"
              style={{ textAnchor: "start" }}
            >
              <tspan x="705" dx="5" dy="3" fontSize="9px">
                남태령
              </tspan>
            </text>
            <text
              className="label S1450 L4"
              y="725"
              id="S1450"
              style={{ textAnchor: "start" }}
            >
              <tspan x="705" dx="5" dy="3" fontSize="9px">
                선바위
              </tspan>
            </text>
            <text
              className="label S1451 L4"
              y="745"
              id="S1451"
              style={{ textAnchor: "start" }}
            >
              <tspan x="695" dx="3" dy="11" fontSize="9px">
                경마공원
              </tspan>
            </text>
            <text
              className="label S1452 L4"
              y="765"
              id="S1452"
              style={{ textAnchor: "start" }}
            >
              <tspan x="675" dx="3" dy="11" fontSize="9px">
                대공원
              </tspan>
            </text>
            <text
              className="label S1453 L4"
              y="780"
              id="S1453"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="655" dx="0" dy="13" fontSize="9px">
                과천
              </tspan>
            </text>
            <text
              className="label S1454 L4"
              y="780"
              id="S1454"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="620" dx="0" dy="13" fontSize="9px">
                정부과천청사
              </tspan>
            </text>
            <text
              className="label S1455 L4"
              y="800"
              id="S1455"
              style={{ textAnchor: "start" }}
            >
              <tspan x="575" dx="3" dy="11" fontSize="9px">
                인덕원
              </tspan>
            </text>
            <text
              className="label S1456 L4"
              y="820"
              id="S1456"
              style={{ textAnchor: "start" }}
            >
              <tspan x="555" dx="3" dy="11" fontSize="9px">
                평촌
              </tspan>
            </text>
            <text
              className="label S1457 L4"
              y="840"
              id="S1457"
              style={{ textAnchor: "start" }}
            >
              <tspan x="535" dx="3" dy="11" fontSize="9px">
                범계
              </tspan>
            </text>
            <text
              className="label S1751 L4"
              y="880"
              id="S1751"
              style={{ textAnchor: "end" }}
            >
              <tspan x="495" dx="-3" dy="-3" fontSize="9px">
                산본
              </tspan>
            </text>
            <text
              className="label S1763 L4"
              y="900"
              id="S1763"
              style={{ textAnchor: "end" }}
            >
              <tspan x="475" dx="-3" dy="-3" fontSize="9px">
                수리산
              </tspan>
            </text>
            <text
              className="label S1752 L4"
              y="920"
              id="S1752"
              style={{ textAnchor: "end" }}
            >
              <tspan x="455" dx="-3" dy="-3" fontSize="9px">
                대야미
              </tspan>
            </text>
            <text
              className="label S1753 L4"
              y="945"
              id="S1753"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="410" dx="0" dy="-5" fontSize="9px">
                반월
              </tspan>
            </text>
            <text
              className="label S1754 L4"
              y="945"
              id="S1754"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="380" dx="0" dy="-5" fontSize="9px">
                상록수
              </tspan>
            </text>
            <text
              className="label S1755 L4 S1830 LB"
              y="945"
              id="S1755"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="350" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                한대앞
              </tspan>
            </text>
            <text
              className="label S1756 L4 S1831 LB"
              y="945"
              id="S1756"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="320" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                중앙
              </tspan>
            </text>
            <text
              className="label S1757 L4 S1832 LB"
              y="945"
              id="S1757"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="290" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                고잔
              </tspan>
            </text>
            <text
              className="label S1758 L4 S1833 LB S4813 LSH"
              y="945"
              id="S1758"
              style={{ textAnchor: "start" }}
            >
              <tspan x="260" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                초지
              </tspan>
            </text>
            <text
              className="label S1759 L4 S1834 LB"
              y="945"
              id="S1759"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="230" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                안산
              </tspan>
            </text>
            <text
              className="label S1760 L4 S1835 LB"
              y="945"
              id="S1760"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="195" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                신길온천
              </tspan>
            </text>
            <text
              className="label S1761 L4 S1836 LB"
              y="945"
              id="S1761"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="155" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                정왕
              </tspan>
            </text>
            <text
              className="label S1762 L4 S1800 LB"
              y="945"
              id="S1762"
              style={{ textAnchor: "start" }}
            >
              <tspan x="100" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                오이도
              </tspan>
            </text>
            <text
              className="label S2511 L5"
              y="275"
              id="S2511"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                방화
              </tspan>
            </text>
            <text
              className="label S2512 L5"
              y="310"
              id="S2512"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                개화산
              </tspan>
            </text>
            <text
              className="label S2513 L5 S4102 L9 S4929 LKP S4207 LA"
              y="350"
              id="S2513"
              style={{ textAnchor: "end" }}
            >
              <tspan x="210" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                김포공항
              </tspan>
            </text>
            <text
              className="label S2514 L5"
              y="377.5"
              id="S2514"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                송정
              </tspan>
            </text>
            <text
              className="label S2515 L5"
              y="402.5"
              id="S2515"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                마곡
              </tspan>
            </text>
            <text
              className="label S2516 L5"
              y="429"
              id="S2516"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                발산
              </tspan>
            </text>
            <text
              className="label S2517 L5"
              y="460"
              id="S2517"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="225" dx="0" dy="-5" fontSize="9px">
                우장산
              </tspan>
            </text>
            <text
              className="label S2518 L5"
              y="460"
              id="S2518"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="255" dx="0" dy="-5" fontSize="9px">
                화곡
              </tspan>
            </text>
            <text
              className="label S2520 L5"
              y="460"
              id="S2520"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="320" dx="0" dy="-5" fontSize="9px">
                신정
              </tspan>
            </text>
            <text
              className="label S2521 L5"
              y="460"
              id="S2521"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="345" dx="0" dy="-5" fontSize="9px">
                목동
              </tspan>
            </text>
            <text
              className="label S2522 L5"
              y="460"
              id="S2522"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="370" dx="0" dy="-5" fontSize="9px">
                오목교
              </tspan>
            </text>
            <text
              className="label S2523 L5"
              y="460"
              id="S2523"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="395" dx="0" dy="-5" fontSize="9px">
                양평
              </tspan>
            </text>
            <text
              className="label S2525 L5"
              y="485"
              id="S2525"
              style={{ textAnchor: "start" }}
            >
              <tspan x="442.5" dx="5" dy="3" fontSize="9px">
                영등포시장
              </tspan>
            </text>
            <text
              className="label S2527 L5 S4115 L9"
              y="505"
              id="S2527"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="525" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                여의도
              </tspan>
            </text>
            <text
              className="label S2528 L5"
              y="505"
              id="S2528"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="565" dx="0" dy="13" fontSize="9px">
                여의나루
              </tspan>
            </text>
            <text
              className="label S2529 L5"
              y="505"
              id="S2529"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="600" dx="0" dy="13" fontSize="9px">
                마포
              </tspan>
            </text>
            <text
              className="label S2530 L5 S2627 L6 S1262 LK S4202 LA"
              y="460"
              id="S2530"
              style={{ textAnchor: "end" }}
            >
              <tspan x="605" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                공덕
              </tspan>
            </text>
            <text
              className="label S2531 L5"
              y="365"
              id="S2531"
              style={{ textAnchor: "start" }}
            >
              <tspan x="605" dx="5" dy="3" fontSize="9px">
                애오개
              </tspan>
            </text>
            <text
              className="label S2533 L5"
              y="300"
              id="S2533"
              style={{ textAnchor: "start" }}
            >
              <tspan x="605" dx="5" dy="3" fontSize="9px">
                서대문
              </tspan>
            </text>
            <text
              className="label S2534 L5"
              y="275"
              id="S2534"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="645" dx="0" dy="-5" fontSize="9px">
                광화문
              </tspan>
            </text>
            <text
              className="label S2538 L5 S2635 L6"
              y="395"
              id="S2538"
              style={{ textAnchor: "start" }}
            >
              <tspan x="850" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                청구
              </tspan>
            </text>
            <text
              className="label S2539 L5"
              y="395"
              id="S2539"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="905" dx="0" dy="-5" fontSize="9px">
                신금호
              </tspan>
            </text>
            <text
              className="label S2540 L5"
              y="395"
              id="S2540"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="945" dx="0" dy="-5" fontSize="9px">
                행당
              </tspan>
            </text>
            <text
              className="label S2542 L5"
              y="395"
              id="S2542"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1035" dx="0" dy="13" fontSize="9px">
                마장
              </tspan>
            </text>
            <text
              className="label S2543 L5"
              y="395"
              id="S2543"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1085" dx="0" dy="-5" fontSize="9px">
                답십리
              </tspan>
            </text>
            <text
              className="label S2544 L5"
              y="395"
              id="S2544"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1130" dx="0" dy="-5" fontSize="9px">
                장한평
              </tspan>
            </text>
            <text
              className="label S2545 L5 S2727 L7"
              y="395"
              id="S2545"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                군자
              </tspan>
            </text>
            <text
              className="label S2546 L5"
              y="420"
              id="S2546"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1235" dx="3" dy="-3" fontSize="9px">
                아차산
              </tspan>
            </text>
            <text
              className="label S2547 L5"
              y="460"
              id="S2547"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1275" dx="3" dy="-3" fontSize="9px">
                광나루
              </tspan>
            </text>
            <text
              className="label S2548 L5 S2812 L8"
              y="540"
              id="S2548"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1355" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                천호
              </tspan>
            </text>
            <text
              className="label S2549 S2549 L5"
              y="540"
              id="S2549"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                강동
              </tspan>
            </text>
            <text
              className="label S2550 L5"
              y="515"
              id="S2550"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                길동
              </tspan>
            </text>
            <text
              className="label S2551 L5"
              y="490"
              id="S2551"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                굽은다리
              </tspan>
            </text>
            <text
              className="label S2552 L5"
              y="465"
              id="S2552"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                명일
              </tspan>
            </text>
            <text
              className="label S2553 L5"
              y="440"
              id="S2553"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                고덕
              </tspan>
            </text>
            <text
              className="label S2554 L5"
              y="415"
              id="S2554"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                상일동
              </tspan>
            </text>
            <text
              className="label S2562 L5"
              y="415"
              id="S2562"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1455" dx="5" dy="3" fontSize="9px">
                강일
              </tspan>
            </text>
            <text
              className="label S2563 L5"
              y="435"
              id="S2563"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1455" dx="5" dy="3" fontSize="9px">
                미사
              </tspan>
            </text>
            <text
              className="label S2564 L5"
              y="455"
              id="S2564"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1455" dx="5" dy="3" fontSize="9px">
                하남풍산
              </tspan>
            </text>
            <text
              className="label S2565 L5"
              y="475"
              id="S2565"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1455" dx="5" dy="3" fontSize="9px">
                하남시청
              </tspan>
            </text>
            <text
              className="label S2566 L5"
              y="495"
              id="S2566"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1455" dx="5" dy="3" fontSize="9px">
                하남검단산
              </tspan>
            </text>
            <text
              className="label S2555 L5"
              y="565"
              id="S2555"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                둔촌동
              </tspan>
            </text>
            <text
              className="label S2556 L5 S4136 L9"
              y="590"
              id="S2556"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                올림픽공원
              </tspan>
            </text>
            <text
              className="label S2557 L5"
              y="615"
              id="S2557"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                방이
              </tspan>
            </text>
            <text
              className="label S2559 L5"
              y="665"
              id="S2559"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                개롱
              </tspan>
            </text>
            <text
              className="label S2560 L5"
              y="690"
              id="S2560"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                거여
              </tspan>
            </text>
            <text
              className="label S2561 L5"
              y="715"
              id="S2561"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="5" dy="3" fontSize="9px">
                마천
              </tspan>
            </text>
            <text
              className="label S2649 L6 S1311 LG"
              y="255"
              id="S1311"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1260" dx="-9" dy="3" fontSize="9px" fontWeight="bold">
                신내
              </tspan>
            </text>
            <text
              className="label S2648 L6"
              y="240"
              id="S2648"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1245" dx="-5" dy="3" fontSize="9px">
                봉화산
              </tspan>
            </text>
            <text
              className="label S2647 L6"
              y="225"
              id="S2647"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1195" dx="3" dy="-3" fontSize="9px">
                화랑대
              </tspan>
            </text>
            <text
              className="label S2646 L6 S2719 L7"
              y="225"
              id="S2646"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1165" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                태릉입구
              </tspan>
            </text>
            <text
              className="label S2644 L6"
              y="225"
              id="S2644"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1045" dx="0" dy="-5" fontSize="9px">
                돌곶이
              </tspan>
            </text>
            <text
              className="label S2643 L6"
              y="225"
              id="S2643"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1010" dx="0" dy="-5" fontSize="9px">
                상월곡
              </tspan>
            </text>
            <text
              className="label S2642 L6"
              y="225"
              id="S2642"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="970" dx="0" dy="-5" fontSize="9px">
                월곡
              </tspan>
            </text>
            <text
              className="label S2641 L6"
              y="225"
              id="S2641"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="940" dx="0" dy="-5" fontSize="9px">
                고려대
              </tspan>
            </text>
            <text
              className="label S2640 L6"
              y="225"
              id="S2640"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="905" dx="0" dy="-5" fontSize="9px">
                안암
              </tspan>
            </text>
            <text
              className="label S2639 L6 S4712 LW"
              y="240"
              id="S2639"
              style={{ textAnchor: "start" }}
            >
              <tspan x="900" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                보문
              </tspan>
            </text>
            <text
              className="label S2638 L6"
              y="255"
              id="S2638"
              style={{ textAnchor: "end" }}
            >
              <tspan x="900" dx="-5" dy="3" fontSize="9px">
                창신
              </tspan>
            </text>
            <text
              className="label S2633 L6"
              y="475"
              id="S2633"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="825" dx="0" dy="13" fontSize="9px">
                버티고개
              </tspan>
            </text>
            <text
              className="label S2632 L6"
              y="475"
              id="S2632"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="795" dx="0" dy="13" fontSize="9px">
                한강진
              </tspan>
            </text>
            <text
              className="label S2631 L6"
              y="475"
              id="S2631"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="755" dx="0" dy="13" fontSize="9px">
                이태원
              </tspan>
            </text>
            <text
              className="label S2630 L6"
              y="475"
              id="S2630"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="725" dx="0" dy="13" fontSize="9px">
                녹사평
              </tspan>
            </text>
            <text
              className="label S2628 L6 S1261 LK"
              y="470"
              id="S2628"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="635" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                효창공원앞
              </tspan>
            </text>
            <text
              className="label S2626 L6"
              y="475"
              id="S2626"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="580" dx="0" dy="13" fontSize="9px">
                대흥
              </tspan>
            </text>
            <text
              className="label S2625 L6"
              y="475"
              id="S2625"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="545" dx="0" dy="13" fontSize="9px">
                광흥창
              </tspan>
            </text>
            <text
              className="label S2624 L6"
              y="460"
              id="S2624"
              style={{ textAnchor: "start" }}
            >
              <tspan x="525" dx="3" dy="-3" fontSize="9px">
                상수
              </tspan>
            </text>
            <text
              className="label S2622 L6"
              y="420"
              id="S2622"
              style={{ textAnchor: "start" }}
            >
              <tspan x="485" dx="3" dy="-3" fontSize="9px">
                망원
              </tspan>
            </text>
            <text
              className="label S2621 L6"
              y="375"
              id="S2621"
              style={{ textAnchor: "end" }}
            >
              <tspan x="470" dx="-5" dy="3" fontSize="9px">
                마포구청
              </tspan>
            </text>
            <text
              className="label S2620 L6"
              y="350"
              id="S2620"
              style={{ textAnchor: "end" }}
            >
              <tspan x="470" dx="-5" dy="3" fontSize="9px">
                월드컵경기장
              </tspan>
            </text>
            <text
              className="label S2619 L6 S1266 LK S4204 LA"
              y="310"
              id="S2619"
              style={{ textAnchor: "end" }}
            >
              <tspan x="470" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                디지털미디어시티
              </tspan>
            </text>
            <text
              className="label S2618 L6"
              y="280"
              id="S2618"
              style={{ textAnchor: "end" }}
            >
              <tspan x="470" dx="-5" dy="3" fontSize="9px">
                증산
              </tspan>
            </text>
            <text
              className="label S2617 L6"
              y="250"
              id="S2617"
              style={{ textAnchor: "end" }}
            >
              <tspan x="470" dx="-5" dy="3" fontSize="9px">
                새절
              </tspan>
            </text>
            <text
              className="label S2611 L6"
              y="205"
              id="S2611"
              style={{ textAnchor: "end" }}
            >
              <tspan x="470" dx="-3" dy="11" fontSize="9px">
                응암
              </tspan>
            </text>
            <text
              className="label S2612 L6"
              y="190"
              id="S2612"
              style={{ textAnchor: "start" }}
            >
              <tspan x="485" dx="3" dy="11" fontSize="9px">
                역촌
              </tspan>
            </text>
            <text
              className="label S2614 L6"
              y="145"
              id="S2614"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="470" dx="0" dy="-5" fontSize="9px">
                독바위
              </tspan>
            </text>
            <text
              className="label S2616 L6"
              y="190"
              id="S2616"
              style={{ textAnchor: "end" }}
            >
              <tspan x="455" dx="-3" dy="11" fontSize="9px">
                구산
              </tspan>
            </text>
            <text
              className="label S3763 L7 S3213 LI2"
              y="580"
              id="S3213"
              style={{ textAnchor: "start" }}
            >
              <tspan x="40" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                석남
              </tspan>
            </text>
            <text
              className="label S3762 L7"
              y="605"
              id="S3762"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="100" dx="0" dy="-5" fontSize="9px">
                산곡
              </tspan>
            </text>
            <text
              className="label S3761 L7 S3118 LI"
              y="605"
              id="S3118"
              style={{ textAnchor: "start" }}
            >
              <tspan x="140" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                부평구청
              </tspan>
            </text>
            <text
              className="label S3760 L7"
              y="550"
              id="S3760"
              style={{ textAnchor: "start" }}
            >
              <tspan x="195" dx="3" dy="11" fontSize="9px">
                굴포천
              </tspan>
            </text>
            <text
              className="label S3759 L7"
              y="535"
              id="S3759"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                삼산체육관
              </tspan>
            </text>
            <text
              className="label S3758 L7"
              y="515"
              id="S3758"
              style={{ textAnchor: "start" }}
            >
              <tspan x="210" dx="5" dy="3" fontSize="9px">
                상동
              </tspan>
            </text>
            <text
              className="label S3757 L7"
              y="495"
              id="S3757"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="240" dx="0" dy="-5" fontSize="9px">
                부천시청
              </tspan>
            </text>
            <text
              className="label S3756 L7"
              y="500"
              id="S3756"
              style={{ textAnchor: "start" }}
            >
              <tspan x="270" dx="3" dy="-3" fontSize="9px">
                신중동
              </tspan>
            </text>
            <text
              className="label S3755 L7"
              y="515"
              id="S3755"
              style={{ textAnchor: "start" }}
            >
              <tspan x="285" dx="3" dy="-3" fontSize="9px">
                춘의
              </tspan>
            </text>
            <text
              className="label S3754 L7"
              y="540"
              id="S3754"
              style={{ textAnchor: "start" }}
            >
              <tspan x="290" dx="5" dy="3" fontSize="9px">
                부천종합운동장
              </tspan>
            </text>
            <text
              className="label S3753 L7"
              y="565"
              id="S3753"
              style={{ textAnchor: "start" }}
            >
              <tspan x="290" dx="3" dy="-3" fontSize="9px">
                까치울
              </tspan>
            </text>
            <text
              className="label S2751 L7"
              y="615"
              id="S2751"
              style={{ textAnchor: "end" }}
            >
              <tspan x="340" dx="-3" dy="11" fontSize="9px">
                천왕
              </tspan>
            </text>
            <text
              className="label S2750 L7"
              y="630"
              id="S2750"
              style={{ textAnchor: "end" }}
            >
              <tspan x="355" dx="-3" dy="11" fontSize="9px">
                광명사거리
              </tspan>
            </text>
            <text
              className="label S2749 L7"
              y="640"
              id="S2749"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="390" dx="0" dy="-5" fontSize="9px">
                철산
              </tspan>
            </text>
            <text
              className="label S2747 L7"
              y="640"
              id="S2747"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="435" dx="0" dy="-5" fontSize="9px">
                남구로
              </tspan>
            </text>
            <text
              className="label S2745 L7"
              y="640"
              id="S2745"
              style={{ textAnchor: "end" }}
            >
              <tspan x="485" dx="-3" dy="-3" fontSize="9px">
                신풍
              </tspan>
            </text>
            <text
              className="label S2744 L7 S4404 LSL"
              y="640"
              id="S2744"
              style={{ textAnchor: "end" }}
            >
              <tspan x="520" dx="-7" dy="-7" fontSize="9px" fontWeight="bold">
                보라매
              </tspan>
            </text>
            <text
              className="label S2743 L7"
              y="640"
              id="S2743"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="555" dx="0" dy="-12" fontSize="9px">
                신대방
              </tspan>
              <tspan x="555" dx="0" dy="9" className="fdy630" fontSize="9px">
                삼거리
              </tspan>
            </text>
            <text
              className="label S2742 L7"
              y="640"
              id="S2742"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="585" dx="0" dy="-5" fontSize="9px">
                장승배기
              </tspan>
            </text>
            <text
              className="label S2741 L7"
              y="640"
              id="S2741"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="615" dx="0" dy="-5" fontSize="9px">
                상도
              </tspan>
            </text>
            <text
              className="label S2740 L7"
              y="640"
              id="S2740"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="650" dx="0" dy="-5" fontSize="9px">
                숭실대입구
              </tspan>
            </text>
            <text
              className="label S2739 L7"
              y="640"
              id="S2739"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="685" dx="0" dy="-5" fontSize="9px">
                남성
              </tspan>
            </text>
            <text
              className="label S2737 L7"
              y="640"
              id="S2737"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="795" dx="0" dy="-5" fontSize="9px">
                내방
              </tspan>
            </text>
            <text
              className="label S2735 L7"
              y="600"
              id="S2735"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="940" dx="0" dy="-5" fontSize="9px">
                반포
              </tspan>
            </text>
            <text
              className="label S2734 L7 S4305 LS"
              y="600"
              id="S2734"
              style={{ textAnchor: "start" }}
            >
              <tspan x="975" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                논현
              </tspan>
            </text>
            <text
              className="label S2733 L7"
              y="600"
              id="S2733"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1030" dx="0" dy="-5" fontSize="9px">
                학동
              </tspan>
            </text>
            <text
              className="label S2732 L7 S1849 LB"
              y="570"
              id="S2732"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1095" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                강남구청
              </tspan>
            </text>
            <text
              className="label S2731 L7"
              y="535"
              id="S2731"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1130" dx="3" dy="11" fontSize="9px">
                청담
              </tspan>
            </text>
            <text
              className="label S2730 L7"
              y="505"
              id="S2730"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1160" dx="3" dy="11" fontSize="9px">
                뚝섬유원지
              </tspan>
            </text>
            <text
              className="label S2728 L7"
              y="435"
              id="S2728"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                어린이대공원
              </tspan>
            </text>
            <text
              className="label S2726 L7"
              y="365"
              id="S2726"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                중곡
              </tspan>
            </text>
            <text
              className="label S2725 L7"
              y="345"
              id="S2725"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                용마산
              </tspan>
            </text>
            <text
              className="label S2724 L7"
              y="325"
              id="S2724"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                사가정
              </tspan>
            </text>
            <text
              className="label S2723 L7"
              y="305"
              id="S2723"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                면목
              </tspan>
            </text>
            <text
              className="label S2722 L7 S1309 LG S1202 LK"
              y="270"
              id="S2722"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                상봉
              </tspan>
            </text>
            <text
              className="label S2721 L7"
              y="255"
              id="S2721"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                중화
              </tspan>
            </text>
            <text
              className="label S2720 L7"
              y="240"
              id="S2720"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                먹골
              </tspan>
            </text>
            <text
              className="label S2718 L7"
              y="200"
              id="S2718"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                공릉
              </tspan>
            </text>
            <text
              className="label S2717 L7"
              y="185"
              id="S2717"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                하계
              </tspan>
            </text>
            <text
              className="label S2716 L7"
              y="170"
              id="S2716"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1165" dx="5" dy="3" fontSize="9px">
                중계
              </tspan>
            </text>
            <text
              className="label S2714 L7"
              y="130"
              id="S2714"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1125" dx="5" dy="3" fontSize="9px">
                마들
              </tspan>
            </text>
            <text
              className="label S2713 L7"
              y="110"
              id="S2713"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1105" dx="5" dy="3" fontSize="9px">
                수락산
              </tspan>
            </text>
            <text
              className="label S2711 L7"
              y="80"
              id="S2711"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1155" dx="0" dy="-5" fontSize="9px">
                장암
              </tspan>
            </text>
            <text
              className="label S2811 L8"
              y="500"
              id="S2811"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1355" dx="5" dy="3" fontSize="9px">
                암사
              </tspan>
            </text>
            <text
              className="label S2813 L8"
              y="569"
              id="S2813"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1325" dx="3" dy="11" fontSize="9px">
                강동구청
              </tspan>
            </text>
            <text
              className="label S2814 L8"
              y="597.5"
              id="S2814"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1295" dx="3" dy="11" fontSize="9px">
                몽촌토성
              </tspan>
            </text>
            <text
              className="label S2816 L8 S4133 L9"
              y="660"
              id="S2816"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1280" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                석촌
              </tspan>
            </text>
            <text
              className="label S2817 L8"
              y="685"
              id="S2817"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1305" dx="3" dy="-3" fontSize="9px">
                송파
              </tspan>
            </text>
            <text
              className="label S2819 L8"
              y="730"
              id="S2819"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1350" dx="3" dy="-3" fontSize="9px">
                문정
              </tspan>
            </text>
            <text
              className="label S2820 L8"
              y="750"
              id="S2820"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1370" dx="3" dy="-3" fontSize="9px">
                장지
              </tspan>
            </text>
            <text
              className="label S2821 L8 S1031 LB"
              y="765"
              id="S1031"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1385" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                복정
              </tspan>
            </text>
            <text
              className="label S2828 L8"
              y="790"
              id="S2828"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1410" dx="3" dy="-3" fontSize="9px">
                남위례
              </tspan>
            </text>
            <text
              className="label S2822 L8"
              y="810"
              id="S2822"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1425" dx="5" dy="3" fontSize="9px">
                산성
              </tspan>
            </text>
            <text
              className="label S2823 L8"
              y="840"
              id="S2823"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1425" dx="5" dy="3" fontSize="9px">
                남한산성입구
              </tspan>
            </text>
            <text
              className="label S2824 L8"
              y="845"
              id="S2824"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1392.5" dx="0" dy="-5" fontSize="9px">
                단대오거리
              </tspan>
            </text>
            <text
              className="label S2825 L8"
              y="845"
              id="S2825"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1355" dx="0" dy="-5" fontSize="9px">
                신흥
              </tspan>
            </text>
            <text
              className="label S2826 L8"
              y="835"
              id="S2826"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1315" dx="3" dy="-3" fontSize="9px">
                수진
              </tspan>
            </text>
            <text
              className="label S2827 L8 S1853 LB"
              y="805"
              id="S1853"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1295" dx="-7" dy="15" fontSize="9px" fontWeight="bold">
                모란
              </tspan>
            </text>
            <text
              className="label S4101 L9"
              y="275"
              id="S4101"
              style={{ textAnchor: "start" }}
            >
              <tspan x="185" dx="5" dy="3" fontSize="9px">
                개화
              </tspan>
            </text>
            <text
              className="label S4103 L9"
              y="345"
              id="S4103"
              style={{ textAnchor: "start" }}
            >
              <tspan x="230" dx="3" dy="-3" fontSize="9px">
                공항시장
              </tspan>
            </text>
            <text
              className="label S4104 L9"
              y="355"
              id="S4104"
              style={{ textAnchor: "start" }}
            >
              <tspan x="255" dx="3" dy="-3" fontSize="9px">
                신방화
              </tspan>
            </text>
            <text
              className="label S4105 L9 S4206 LA"
              y="375"
              id="S4105"
              style={{ textAnchor: "start" }}
            >
              <tspan x="275" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                마곡나루
              </tspan>
            </text>
            <text
              className="label S4106 L9"
              y="390"
              id="S4106"
              style={{ textAnchor: "start" }}
            >
              <tspan x="290" dx="3" dy="-3" fontSize="9px">
                양천향교
              </tspan>
            </text>
            <text
              className="label S4107 L9"
              y="415"
              id="S4107"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="330" dx="0" dy="-5" fontSize="9px">
                가양
              </tspan>
            </text>
            <text
              className="label S4108 L9"
              y="415"
              id="S4108"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="360" dx="0" dy="-5" fontSize="9px">
                증미
              </tspan>
            </text>
            <text
              className="label S4109 L9"
              y="415"
              id="S4109"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="385" dx="0" dy="-5" fontSize="9px">
                등촌
              </tspan>
            </text>
            <text
              className="label S4110 L9"
              y="415"
              id="S4110"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="415" dx="0" dy="-5" fontSize="9px">
                염창
              </tspan>
            </text>
            <text
              className="label S4111 L9"
              y="425"
              id="S4111"
              style={{ textAnchor: "start" }}
            >
              <tspan x="440" dx="3" dy="-3" fontSize="9px">
                신목동
              </tspan>
            </text>
            <text
              className="label S4112 L9"
              y="435"
              id="S4112"
              style={{ textAnchor: "start" }}
            >
              <tspan x="450" dx="3" dy="-3" fontSize="9px">
                선유도
              </tspan>
            </text>
            <text
              className="label S4114 L9"
              y="470"
              id="S4114"
              style={{ textAnchor: "start" }}
            >
              <tspan x="487.5" dx="3" dy="11" fontSize="9px">
                국회의사당
              </tspan>
            </text>
            <text
              className="label S4116 L9 S4401 LSL"
              y="525"
              id="S4116"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="548.5" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                샛강
              </tspan>
            </text>
            <text
              className="label S4118 L9"
              y="590"
              id="S4118"
              style={{ textAnchor: "end" }}
            >
              <tspan x="615" dx="-3" dy="11" fontSize="9px">
                노들
              </tspan>
            </text>
            <text
              className="label S4119 L9"
              y="600"
              id="S4119"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="660" dx="0" dy="-5" fontSize="9px">
                흑석
              </tspan>
            </text>
            <text
              className="label S4121 L9"
              y="600"
              id="S4121"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="765" dx="0" dy="-5" fontSize="9px">
                구반포
              </tspan>
            </text>
            <text
              className="label S4122 L9"
              y="600"
              id="S4122"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="810" dx="0" dy="-5" fontSize="9px">
                신반포
              </tspan>
            </text>
            <text
              className="label S4124 L9"
              y="645"
              id="S4124"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="935" dx="0" dy="-5" fontSize="9px">
                사평
              </tspan>
            </text>
            <text
              className="label S4125 L9 S4306 LS"
              y="645"
              id="S4125"
              style={{ textAnchor: "start" }}
            >
              <tspan x="975" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                신논현
              </tspan>
            </text>
            <text
              className="label S4126 L9"
              y="645"
              id="S4126"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1025" dx="0" dy="-5" fontSize="9px">
                언주
              </tspan>
            </text>
            <text
              className="label S4127 L9 S1850 LB"
              y="645"
              id="S1850"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1050" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                선정릉
              </tspan>
            </text>
            <text
              className="label S4128 L9"
              y="645"
              id="S4128"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1115" dx="0" dy="-5" fontSize="9px">
                삼성중앙
              </tspan>
            </text>
            <text
              className="label S4129 L9"
              y="650"
              id="S4129"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1145" dx="5" dy="3" fontSize="9px">
                봉은사
              </tspan>
            </text>
            <text
              className="label S4131 L9"
              y="695"
              id="S4131"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1195" dx="0" dy="13" fontSize="9px">
                삼전
              </tspan>
            </text>
            <text
              className="label S4132 L9"
              y="695"
              id="S4132"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1260" dx="0" dy="13" fontSize="9px">
                석촌고분
              </tspan>
            </text>
            <text
              className="label S4134 L9"
              y="630"
              id="S4134"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1315" dx="5" dy="3" fontSize="9px">
                송파나루
              </tspan>
            </text>
            <text
              className="label S4135 L9"
              y="600"
              id="S4135"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1345" dx="5" dy="3" fontSize="9px">
                한성백제
              </tspan>
            </text>
            <text
              className="label S4137 L9"
              y="590"
              id="S4137"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1450" dx="0" dy="-5" fontSize="9px">
                둔촌오륜
              </tspan>
            </text>
            <text
              className="label S4138 L9"
              y="565"
              id="S4138"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1470" dx="5" dy="3" fontSize="9px">
                중앙
              </tspan>
              <tspan x="1470" dx="5" dy="12" fontSize="9px">
                보훈병원
              </tspan>
            </text>

            <text
              className="label S1308 LG S1201 LK"
              y="280"
              id="S1201"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1105" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                중랑
              </tspan>
            </text>
            <text
              className="label S1310 LG S1203 LK"
              y="280"
              id="S1203"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1240" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                망우
              </tspan>
            </text>

            <text
              className="label S1285 LK"
              y="80"
              id="S1285"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="40" dx="0" dy="13" fontSize="9px">
                임진강
              </tspan>
            </text>
            <text
              className="label S1284 S1284 LK"
              y="80"
              id="S1284"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="75" dx="0" dy="17" fontSize="9px" fontWeight="bold">
                문산
              </tspan>
            </text>
            <text
              className="label S1283 LK"
              y="80"
              id="S1283"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="100" dx="0" dy="13" fontSize="9px">
                파주
              </tspan>
            </text>
            <text
              className="label S1282 LK"
              y="80"
              id="S1282"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="125" dx="0" dy="13" fontSize="9px">
                월롱
              </tspan>
            </text>
            <text
              className="label S1280 LK"
              y="80"
              id="S1280"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="150" dx="0" dy="13" fontSize="9px">
                금촌
              </tspan>
            </text>
            <text
              className="label S1279 LK"
              y="80"
              id="S1279"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="175" dx="0" dy="13" fontSize="9px">
                금릉
              </tspan>
            </text>
            <text
              className="label S1278 LK"
              y="80"
              id="S1278"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="200" dx="0" dy="13" fontSize="9px">
                운정
              </tspan>
            </text>
            <text
              className="label S1277 LK"
              y="80"
              id="S1277"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="225" dx="0" dy="13" fontSize="9px">
                야당
              </tspan>
            </text>
            <text
              className="label S1276 LK"
              y="80"
              id="S1276"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="250" dx="0" dy="13" fontSize="9px">
                탄현
              </tspan>
            </text>
            <text
              className="label S1275 LK"
              y="90"
              id="S1275"
              style={{ textAnchor: "start" }}
            >
              <tspan x="265" dx="5" dy="3" fontSize="9px">
                일산
              </tspan>
            </text>
            <text
              className="label S1274 LK"
              y="110"
              id="S1274"
              style={{ textAnchor: "start" }}
            >
              <tspan x="265" dx="5" dy="3" fontSize="9px">
                풍산
              </tspan>
            </text>
            <text
              className="label S1273 LK"
              y="130"
              id="S1273"
              style={{ textAnchor: "start" }}
            >
              <tspan x="265" dx="5" dy="3" fontSize="9px">
                백마
              </tspan>
            </text>
            <text
              className="label S1272 LK"
              y="150"
              id="S1272"
              style={{ textAnchor: "start" }}
            >
              <tspan x="265" dx="5" dy="3" fontSize="9px">
                곡산
              </tspan>
            </text>
            <text
              className="label S1271 LK"
              y="210"
              id="S1271"
              style={{ textAnchor: "start" }}
            >
              <tspan x="280" dx="3" dy="-3" fontSize="9px">
                능곡
              </tspan>
            </text>
            <text
              className="label S1270 LK"
              y="230"
              id="S1270"
              style={{ textAnchor: "start" }}
            >
              <tspan x="300" dx="3" dy="-3" fontSize="9px">
                행신
              </tspan>
            </text>
            <text
              className="label S1269 LK"
              y="255"
              id="S1269"
              style={{ textAnchor: "start" }}
            >
              <tspan x="325" dx="3" dy="-3" fontSize="9px">
                강매
              </tspan>
            </text>
            <text
              className="label S1268 LK"
              y="275"
              id="S1268"
              style={{ textAnchor: "start" }}
            >
              <tspan x="345" dx="3" dy="-3" fontSize="9px">
                화전
              </tspan>
            </text>
            <text
              className="label S1267 LK"
              y="295"
              id="S1267"
              style={{ textAnchor: "start" }}
            >
              <tspan x="365" dx="3" dy="-3" fontSize="9px">
                수색
              </tspan>
            </text>
            <text
              className="label S1265 S1265 LK"
              y="315"
              id="S1265"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="495" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                가좌
              </tspan>
            </text>
            <text
              className="label S1252 LK"
              y="315"
              id="S1252"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="525" dx="0" dy="-5" fontSize="9px">
                신촌
              </tspan>
            </text>
            {/* <text
              className="label S1251 LK"
              y="385"
              id="S1251"
              style={{ textAnchor: "end" }}
            >
              <tspan x="645" dx="-3" dy="11" fontSize="9px">
                서울역
              </tspan>
            </text> */}
            <text
              className="label S1263 LK"
              y="440"
              id="S1263"
              style={{ textAnchor: "start" }}
            >
              <tspan x="550" dx="5" dy="3" fontSize="9px">
                서강대
              </tspan>
            </text>
            <text
              className="label S1009 LK"
              y="545"
              id="S1009"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="780" dx="0" dy="-5" fontSize="9px">
                서빙고
              </tspan>
            </text>
            <text
              className="label S1010 LK"
              y="545"
              id="S1010"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="825" dx="0" dy="-5" fontSize="9px">
                한남
              </tspan>
            </text>
            <text
              className="label S1012 LK"
              y="465"
              id="S1012"
              style={{ textAnchor: "end" }}
            >
              <tspan x="925" dx="-3" dy="-3" fontSize="9px">
                응봉
              </tspan>
            </text>
            <text
              className="label S1204 LK"
              y="285"
              id="S1204"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1275" dx="0" dy="-5" fontSize="9px">
                양원
              </tspan>
            </text>
            <text
              className="label S1205 LK"
              y="285"
              id="S1205"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1300" dx="0" dy="-5" fontSize="9px">
                구리
              </tspan>
            </text>
            <text
              className="label S1206 LK"
              y="285"
              id="S1206"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1325" dx="0" dy="-5" fontSize="9px">
                도농
              </tspan>
            </text>
            <text
              className="label S1207 LK"
              y="285"
              id="S1207"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1350" dx="0" dy="-5" fontSize="9px">
                양정
              </tspan>
            </text>
            <text
              className="label S1208 LK"
              y="285"
              id="S1208"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1375" dx="0" dy="-5" fontSize="9px">
                덕소
              </tspan>
            </text>
            <text
              className="label S1209 LK"
              y="285"
              id="S1209"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1400" dx="0" dy="-5" fontSize="9px">
                도심
              </tspan>
            </text>
            <text
              className="label S1210 LK"
              y="300"
              id="S1210"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1435" dx="-5" dy="3" fontSize="9px">
                팔당
              </tspan>
            </text>
            <text
              className="label S1211 LK"
              y="320"
              id="S1211"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1435" dx="-5" dy="3" fontSize="9px">
                운길산
              </tspan>
            </text>
            <text
              className="label S1212 LK"
              y="340"
              id="S1212"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1435" dx="-5" dy="3" fontSize="9px">
                양수
              </tspan>
            </text>
            <text
              className="label S1213 LK"
              y="360"
              id="S1213"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1435" dx="-5" dy="3" fontSize="9px">
                신원
              </tspan>
            </text>
            <text
              className="label S1214 LK"
              y="375"
              id="S1214"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1400" dx="0" dy="-5" fontSize="9px">
                국수
              </tspan>
            </text>
            <text
              className="label S1215 LK"
              y="375"
              id="S1215"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1375" dx="0" dy="-5" fontSize="9px">
                아신
              </tspan>
            </text>
            <text
              className="label S1216 LK"
              y="375"
              id="S1216"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1350" dx="0" dy="-5" fontSize="9px">
                오빈
              </tspan>
            </text>
            <text
              className="label S1217 LK"
              y="375"
              id="S1217"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1325" dx="0" dy="-5" fontSize="9px">
                양평
              </tspan>
            </text>
            <text
              className="label S1218 LK"
              y="375"
              id="S1218"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1300" dx="0" dy="-5" fontSize="9px">
                원덕
              </tspan>
            </text>
            <text
              className="label S1219 LK"
              y="375"
              id="S1219"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1275" dx="0" dy="-5" fontSize="9px">
                용문
              </tspan>
            </text>
            <text
              className="label S1220 LK"
              y="375"
              id="S1220"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1250" dx="0" dy="-5" fontSize="9px">
                지평
              </tspan>
            </text>
            <text
              className="label S1890 LB"
              y="800"
              id="S1890"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="255" dx="0" dy="-5" fontSize="9px">
                신포
              </tspan>
            </text>
            <text
              className="label S1889 LB"
              y="805"
              id="S1889"
              style={{ textAnchor: "start" }}
            >
              <tspan x="275" dx="3" dy="-3" fontSize="9px">
                숭의
              </tspan>
            </text>
            <text
              className="label S1888 LB"
              y="818"
              id="S1888"
              style={{ textAnchor: "start" }}
            >
              <tspan x="287.5" dx="3" dy="-3" fontSize="9px">
                인하대
              </tspan>
            </text>
            <text
              className="label S1886 LB"
              y="831.5"
              id="S1886"
              style={{ textAnchor: "start" }}
            >
              <tspan x="300" dx="3" dy="-3" fontSize="9px">
                송도
              </tspan>
            </text>
            <text
              className="label S1885 LB"
              y="845"
              id="S1885"
              style={{ textAnchor: "start" }}
            >
              <tspan x="312.5" dx="3" dy="-3" fontSize="9px">
                연수
              </tspan>
            </text>
            <text
              className="label S1883 LB"
              y="900"
              id="S1883"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="285" dx="0" dy="-12" fontSize="9px">
                남동
              </tspan>
              <tspan x="285" dx="0" dy="9" className="fdy891" fontSize="9px">
                인더스파크
              </tspan>
            </text>
            <text
              className="label S1882 LB"
              y="900"
              id="S1882"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="245" dx="0" dy="-5" fontSize="9px">
                호구포
              </tspan>
            </text>
            <text
              className="label S1881 LB"
              y="900"
              id="S1881"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="205" dx="0" dy="-5" fontSize="9px">
                인천논현
              </tspan>
            </text>
            <text
              className="label S1880 LB"
              y="900"
              id="S1880"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="160" dx="0" dy="-5" fontSize="9px">
                소래포구
              </tspan>
            </text>
            <text
              className="label S1879 LB"
              y="900"
              id="S1879"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="120" dx="0" dy="-5" fontSize="9px">
                월곶
              </tspan>
            </text>
            <text
              className="label S1878 LB"
              y="920"
              id="S1878"
              style={{ textAnchor: "start" }}
            >
              <tspan x="100" dx="5" dy="3" fontSize="9px">
                달월
              </tspan>
            </text>
            <text
              className="label S1877 LB"
              y="965"
              id="S1877"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="400" dx="0" dy="13" fontSize="9px">
                사리
              </tspan>
            </text>
            <text
              className="label S1876 LB"
              y="965"
              id="S1876"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="455" dx="0" dy="13" fontSize="9px">
                야목
              </tspan>
            </text>
            <text
              className="label S1875 LB"
              y="965"
              id="S1875"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="510" dx="0" dy="13" fontSize="9px">
                어천
              </tspan>
            </text>
            <text
              className="label S1874 LB"
              y="965"
              id="S1874"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="565" dx="0" dy="13" fontSize="9px">
                오목천
              </tspan>
            </text>
            <text
              className="label S1873 LB"
              y="965"
              id="S1873"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="620" dx="0" dy="13" fontSize="9px">
                고색
              </tspan>
            </text>
            <text
              className="label S1872 LB"
              y="910"
              id="S1872"
              style={{ textAnchor: "end" }}
            >
              <tspan x="670" dx="-5" dy="3" fontSize="9px">
                매교
              </tspan>
            </text>
            <text
              className="label S1871 LB"
              y="890"
              id="S1871"
              style={{ textAnchor: "end" }}
            >
              <tspan x="670" dx="-5" dy="3" fontSize="9px">
                수원시청
              </tspan>
            </text>
            <text
              className="label S1870 LB"
              y="870"
              id="S1870"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="695" dx="0" dy="-5" fontSize="9px">
                매탄권선
              </tspan>
            </text>
            <text
              className="label S1869 LB"
              y="870"
              id="S1869"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="735" dx="0" dy="-5" fontSize="9px">
                망포
              </tspan>
            </text>
            <text
              className="label S1868 LB"
              y="870"
              id="S1868"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="770" dx="0" dy="-5" fontSize="9px">
                영통
              </tspan>
            </text>
            <text
              className="label S1867 LB"
              y="870"
              id="S1867"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="800" dx="0" dy="-5" fontSize="9px">
                청명
              </tspan>
            </text>
            <text
              className="label S1866 LB"
              y="870"
              id="S1866"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="835" dx="0" dy="-5" fontSize="9px">
                상갈
              </tspan>
            </text>
            <text
              className="label S1865 LB S4501 LE"
              y="870"
              id="S1865"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="865" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                기흥
              </tspan>
            </text>
            <text
              className="label S1864 LB"
              y="870"
              id="S1864"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="895" dx="0" dy="-5" fontSize="9px">
                신갈
              </tspan>
            </text>
            <text
              className="label S1863 LB"
              y="870"
              id="S1863"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="940" dx="0" dy="-5" fontSize="9px">
                구성
              </tspan>
            </text>
            <text
              className="label S1861 LB"
              y="870"
              id="S1861"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="975" dx="0" dy="-5" fontSize="9px">
                보정
              </tspan>
            </text>
            <text
              className="label S1862 LB"
              y="870"
              id="S1862"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1010" dx="0" dy="-5" fontSize="9px">
                죽전
              </tspan>
            </text>
            <text
              className="label S1859 LB"
              y="870"
              id="S1859"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1045" dx="0" dy="-5" fontSize="9px">
                오리
              </tspan>
            </text>
            <text
              className="label S1858 LB S4313 LS"
              y="850"
              id="S1858"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1070" dx="7" dy="15" fontSize="9px" fontWeight="bold">
                미금
              </tspan>
            </text>
            <text
              className="label S1857 LB S4312 LS"
              y="830"
              id="S1857"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1090" dx="9" dy="3" fontSize="9px" fontWeight="bold">
                정자
              </tspan>
            </text>
            <text
              className="label S1856 LB"
              y="805"
              id="S1856"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1135" dx="0" dy="13" fontSize="9px">
                수내
              </tspan>
            </text>
            <text
              className="label S1855 LB"
              y="805"
              id="S1855"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1170" dx="0" dy="13" fontSize="9px">
                서현
              </tspan>
            </text>
            <text
              className="label S1860 LB S1502 LKK"
              y="805"
              id="S1860"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1210" dx="7" dy="-7" fontSize="9px" fontWeight="bold">
                이매
              </tspan>
            </text>
            <text
              className="label S1854 LB"
              y="805"
              id="S1854"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1245" dx="0" dy="13" fontSize="9px">
                야탑
              </tspan>
            </text>
            <text
              className="label S1852 LB"
              y="805"
              id="S1852"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1330" dx="0" dy="-5" fontSize="9px">
                태평
              </tspan>
            </text>
            <text
              className="label S1851 LB"
              y="785"
              id="S1851"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1360" dx="-3" dy="-3" fontSize="9px">
                가천대
              </tspan>
            </text>
            <text
              className="label S1028 LB"
              y="765"
              id="S1028"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1195" dx="0" dy="-5" fontSize="9px">
                대모산입구
              </tspan>
            </text>
            <text
              className="label S1027 LB"
              y="765"
              id="S1027"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1135" dx="0" dy="-5" fontSize="9px">
                개포동
              </tspan>
            </text>
            <text
              className="label S1026 LB"
              y="765"
              id="S1026"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1075" dx="0" dy="-5" fontSize="9px">
                구룡
              </tspan>
            </text>
            <text
              className="label S1024 LB"
              y="700"
              id="S1024"
              style={{ textAnchor: "start" }}
            >
              <tspan x="1015" dx="5" dy="3" fontSize="9px">
                한티
              </tspan>
            </text>
            <text
              className="label S1848 LB"
              y="535"
              id="S1848"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1060" dx="-3" dy="11" fontSize="9px">
                압구정로데오
              </tspan>
            </text>
            <text
              className="label S1847 LB"
              y="485"
              id="S1847"
              style={{ textAnchor: "end" }}
            >
              <tspan x="1010" dx="-3" dy="11" fontSize="9px">
                서울숲
              </tspan>
            </text>
            <text
              className="label S4309 LS"
              y="775"
              id="S4309"
              style={{ textAnchor: "start" }}
            >
              <tspan x="930" dx="3" dy="-3" fontSize="9px">
                양재시민의숲
              </tspan>
            </text>
            <text
              className="label S4310 LS"
              y="800"
              id="S4310"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="980" dx="0" dy="-5" fontSize="9px">
                청계산입구
              </tspan>
            </text>
            <text
              className="label S4311 LS S1501 LKK"
              y="800"
              id="S4311"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1045" dx="0" dy="-9" fontSize="9px" fontWeight="bold">
                판교
              </tspan>
            </text>
            <text
              className="label S4314 LS"
              y="835"
              id="S4314"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1045" dx="0" dy="-5" fontSize="9px">
                동천
              </tspan>
            </text>
            <text
              className="label S4315 LS"
              y="835"
              id="S4315"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="1010" dx="0" dy="-5" fontSize="9px">
                수지구청
              </tspan>
            </text>
            <text
              className="label S4316 LS"
              y="835"
              id="S4316"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="975" dx="0" dy="-5" fontSize="9px">
                성복
              </tspan>
            </text>
            <text
              className="label S4317 LS"
              y="835"
              id="S4317"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="940" dx="0" dy="-5" fontSize="9px">
                상현
              </tspan>
            </text>
            <text
              className="label S4318 LS"
              y="835"
              id="S4318"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="905" dx="0" dy="-5" fontSize="9px">
                광교중앙
              </tspan>
            </text>
            <text
              className="label S4319 LS"
              y="835"
              id="S4319"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="870" dx="0" dy="-5" fontSize="9px">
                광교
              </tspan>
            </text>

            <text
              className="label S4710 LW"
              y="140"
              id="S4710"
              style={{ textAnchor: "start" }}
            >
              <tspan x="840" dx="3" dy="-3" fontSize="9px">
                정릉
              </tspan>
            </text>
            <text
              className="label S4709 LW"
              y="135"
              id="S4709"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="815" dx="0" dy="13" fontSize="9px">
                북한산보국문
              </tspan>
            </text>
            <text
              className="label S4708 LW"
              y="135"
              id="S4708"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="780" dx="0" dy="13" fontSize="9px">
                솔샘
              </tspan>
            </text>
            <text
              className="label S4707 LW"
              y="135"
              id="S4707"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="745" dx="0" dy="13" fontSize="9px">
                삼양사거리
              </tspan>
            </text>
            <text
              className="label S4706 LW"
              y="135"
              id="S4706"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="710" dx="0" dy="13" fontSize="9px">
                삼양
              </tspan>
            </text>
            <text
              className="label S4705 LW"
              y="135"
              id="S4705"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="680" dx="0" dy="13" fontSize="9px">
                화계
              </tspan>
            </text>
            <text
              className="label S4704 LW"
              y="135"
              id="S4704"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="650" dx="0" dy="13" fontSize="9px">
                가오리
              </tspan>
            </text>
            <text
              className="label S4703 LW"
              y="135"
              id="S4703"
              style={{ textAnchor: "middle" }}
            >
              <tspan
                x="610"
                dx="0"
                dy="13"
                className="fdx588 fdw46"
                fontSize="9px"
              >
                4·19민주묘지
              </tspan>
            </text>
            <text
              className="label S4702 LW"
              y="110"
              id="S4702"
              style={{ textAnchor: "end" }}
            >
              <tspan x="575" dx="-3" dy="11" fontSize="9px">
                솔밭공원
              </tspan>
            </text>
            <text
              className="label S4701 LW"
              y="95"
              id="S4701"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="525" dx="0" dy="13" fontSize="9px">
                북한산우이
              </tspan>
            </text>
            <text
              className="label S4403 LSL"
              y="595"
              id="S4403"
              style={{ textAnchor: "end" }}
            >
              <tspan x="512.5" dx="-5" dy="3" fontSize="9px">
                서울지방
              </tspan>
              <tspan x="512.5" dx="-5" dy="12" fontSize="9px">
                병무청
              </tspan>
            </text>
            <text
              className="label S4405 LSL"
              y="650"
              id="S4405"
              style={{ textAnchor: "start" }}
            >
              <tspan x="525" dx="5" dy="3" fontSize="9px">
                보라매공원
              </tspan>
            </text>
            <text
              className="label S4406 LSL"
              y="660"
              id="S4406"
              style={{ textAnchor: "start" }}
            >
              <tspan x="530" dx="5" dy="3" fontSize="9px">
                보라매병원
              </tspan>
            </text>
            <text
              className="label S4407 LSL"
              y="670"
              id="S4407"
              style={{ textAnchor: "start" }}
            >
              <tspan x="540" dx="5" dy="3" fontSize="9px">
                당곡
              </tspan>
            </text>
            <text
              className="label S4409 LSL"
              y="710"
              id="S4409"
              style={{ textAnchor: "end" }}
            >
              <tspan x="575" dx="-5" dy="3" fontSize="9px">
                서원
              </tspan>
            </text>
            <text
              className="label S4410 LSL"
              y="725"
              id="S4410"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="605" dx="0" dy="13" fontSize="9px">
                서울대벤처타운
              </tspan>
            </text>
            <text
              className="label S4411 LSL"
              y="725"
              id="S4411"
              style={{ textAnchor: "middle" }}
            >
              <tspan x="635" dx="0" dy="-5" fontSize="9px">
                관악산(서울대)
              </tspan>
            </text>
          </g>
          <svg
            className="selectedMarker"
            width="100%"
            height="100%"
            viewBox="0 0 1500 1000"
          />
        </svg>
      </div>
    </div>
  );
};

export default MetroMap;
