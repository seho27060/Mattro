/* eslint-disable use-isnan */
/* eslint-disable no-else-return */
import lineData from "./lineData";

function isOverlap(arr, val) {
  for (let i = 0; i < arr.length; i += 1) {
    if (val === arr[i]) {
      return true;
    }
  }
  return false;
}

function changeToAlpha(line) {
  if (line === "경의중앙") {
    return "K";
  }
  if (line === "수인분당") {
    return "B";
  }
  if (line === "신분당") {
    return "S";
  }
  if (line === "우아신설") {
    return "W";
  }
  if (line === "신림") {
    return "SL";
  }
  return "";
}

function isNumeric(value) {
  return /^\d+$/.test(value);
}

export default function isAnswer(targetLine, val, arr) {
  if (isOverlap(arr, val)) {
    return "중복";
  }
  if (!isNumeric(targetLine)) {
    for (
      let i = 0;
      i < lineData[changeToAlpha(targetLine)].stations.length;
      i += 1
    ) {
      if (lineData[changeToAlpha(targetLine)].stations[i].name === val) {
        return "정답";
      }
    }
  } else {
    // eslint-disable-next-line consistent-return
    for (let i = 0; i < lineData[Number(targetLine)].stations.length; i += 1) {
      if (lineData[Number(targetLine)].stations[i].name === val) {
        return "정답";
      }
    }
  }
  return "오답";
}
