import { API } from "./index";

// 취향별 맛집 추천 받기
export const themeRecommend = async (choices) => {
  try {
    const res = await API.get(`/individual/recommendation/${choices}`);
    return res.data;
  } catch (error) {
    console.log("Error");
  }
};

// 인덱스 기반 추천 받기
export const indexRes = async (data) => {
  try {
    const res = await API.get(`/individual/recommendation/list/${data}`);
    return res.data;
  } catch (error) {
    console.log("Error");
  }
};

export const ex = () => {};
