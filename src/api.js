import axios from "axios";
import qs from "querystring";

//axios 기본 설정
export const api = axios.create({
  baseURL: "http://localhost:8757/"
});

//토큰을 받아오는 함수
const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

//axios 헤더 인터셉트, 모든 요청에 토큰을 실어서 요청
api.interceptors.request.use(
  function(config) {
    config.headers = {
      ...config.headers,
      Authorization: getAuthToken(),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

//로그인 api
export const loginApi = (id, password) => {
  const data = {
    logid: id,
    passwd: password
  };
  return api.post("/auth/login", qs.stringify(data));
};

//post요청 공용 api
export const postApi = (url, params, config) => {
  return api.post(url, params, config);
};
