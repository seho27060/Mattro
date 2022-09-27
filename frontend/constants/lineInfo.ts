import {
  UsedLineIdType,
  UsedLinNameType,
  UnusedLineIdType,
  UnusedLineNameType
} from "./lineType";

const lineInfos: { id: UsedLineIdType; name: UsedLinNameType }[] = [
  { id: "L1", name: "1" },
  { id: "L2", name: "2" },
  { id: "L3", name: "3" },
  { id: "L4", name: "4" },
  { id: "L5", name: "5" },
  { id: "L6", name: "6" },
  { id: "L7", name: "7" },
  { id: "L8", name: "8" },
  { id: "L9", name: "9" },
  { id: "LK", name: "경의중앙" },
  { id: "LB", name: "수인분당" },
  { id: "LS", name: "신분당" },
  { id: "LW", name: "우이신설" },
  { id: "LSL", name: "신림" }
];

export const unUsedLineInfos: {
  id: UnusedLineIdType;
  name: UnusedLineNameType;
}[] = [
  { id: "LI", name: "인천1" },
  { id: "LI2", name: "인천2" },
  { id: "LA", name: "공항철도" },
  { id: "LG", name: "경춘" },
  { id: "LU", name: "의정부경전철" },
  { id: "LE", name: "용인경전철" },
  { id: "LKK", name: "경강선" },
  { id: "LSH", name: "서해선" },
  { id: "LKP", name: "김포도시철도" }
];

export default lineInfos;
