import React, { useState, ChangeEvent } from "react";
import { searchByName } from "../../constants/lineData";
import LineCircle, { LineCircleProps } from "./LineCircle";
import styles from "./LineSearch.module.scss";

type SearchListType = {
  id: string;
  name: string;
  lines: LineCircleProps[];
};

const LineSearch = () => {
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
      />
      <ul className={`${styles.ul}`}>
        {searchList.map((item) => (
          <li key={item.id} className={`flex align-center ${styles.li}`}>
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
