import lineData from "./lineData";

function isOverlap(arr, val) {
  for (let i = 0; i < arr.length; i += 1) {
    if (val === arr[i]) {
      return true;
    }
  }
  return false;
}

export default function isAnswer(targetLine, val, arr) {
  if (isOverlap(arr, val)) {
    return "중복";
  }
  // eslint-disable-next-line consistent-return
  for (let i = 0; i < lineData[Number(targetLine)].stations.length; i += 1) {
    if (lineData[Number(targetLine)].stations[i].name === val) {
      return "정답";
    }
  }
  return "오답";
}
