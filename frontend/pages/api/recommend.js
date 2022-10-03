import { API } from "./index";

// 취향별 맛집 추천 받기
export const themeRecommend = async (choices) => {
  try {
    const res = await API.get(`/individual/recommendation/${choices}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// 인덱스 기반 추천 받기
export const indexRes = async (data) => {
  try {
    const res = await API.get(`/individual/recommendation/list/${data}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const recommandIndexByStation = async (station) => {
  const stationName = encodeURIComponent(station);
  console.log(station, stationName);
  try {
    const res = await API.get(`/subway/recommendation/find/${stationName}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const recommandByStoreIndex = async (index) => {
  try {
    const res = await API.get(`/subway/recommendation/${index}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
