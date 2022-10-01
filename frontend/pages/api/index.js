import axios from "axios";

export const BASE_URL = "https://j7c206.p.ssafy.io/api";
// process.env.NODE_ENV === "development"
//   ? "https://j7c206.p.ssafy.io/api"
//   : "https://j7c206.p.ssafy.io/api";

export const API = axios.create({
  baseURL: BASE_URL,
  header: {
    "Access-Control-Allow-Origin": "/api",
    withCredentials: true
  }
});
