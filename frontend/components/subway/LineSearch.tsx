import React, { useState, ChangeEvent, useRef } from "react";
import { searchByName } from "../../constants/lineData";
import LineCircle, { LineCircleProps } from "./LineCircle";
import styles from "./LineSearch.module.scss";

type SearchListType = {
  id: string;
  name: string;
  lines: LineCircleProps[];
};

type LineSearchProps = {
  setSearchId: (id: string) => void;
  setScaleSize: (size: number) => void;
};
const LineSearch = ({ setSearchId, setScaleSize }: LineSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchList, setSearchList] = useState<SearchListType[]>([]);
  // searchByName("화");
  const searchByKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    const keyword = e.target.value;
    if (keyword) {
      setSearchList(searchByName(keyword));
    } else {
      setSearchList([]);
    }
  };
  return (
    <div id="lineSearch">
      <input
        type="text"
        className={`fs-20 notoBold ${styles.input}`}
        placeholder="지하철 역 검색"
        onChange={searchByKeyword}
        ref={inputRef}
      />
      <ul className={`${styles.ul}`}>
        {searchList.map((item) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <li
            key={item.id}
            className={`flex align-center ${styles.li}`}
            onClick={(e) => {
              setSearchId(item.id);
              setScaleSize(4);
              setSearchList([]);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            {item.lines.map((line) => (
              <LineCircle
                key={line.id}
                id={line.id}
                name={line.name}
                togggleSelectedLines={null}
              />
            ))}
            <span id="test" className="notoBold flex align-center">
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineSearch;
