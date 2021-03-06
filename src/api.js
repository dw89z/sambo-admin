import axios from "axios";

const BASE_URL = "http://125.141.30.222:8757/";

//axios 기본 url 설정
export const api = axios.create({
  baseURL: BASE_URL,
});

//토큰을 받아오는 함수
const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

//axios 헤더 인터셉트, 모든 요청에 토큰을 실어서 요청
api.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json; charset=utf8",
      "Access-Control-Allow-Origin": "*",
      Authorization: getAuthToken(),
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//로그인 api
export const loginApi = (id, password) => {
  const data = {
    logid: id,
    passwd: password,
  };
  return api.post("/auth/login", JSON.stringify(data));
};

//post요청 공용 api
export const postApi = (url, params, config) => {
  return api.post(url, JSON.stringify(params), config);
};

//get요청 공용 api
export const getApi = (url) => {
  return api.get(url);
};

//delete요청 공용 api
export const deleteApi = (url, param) => {
  return api.delete(`${url}/${param}`);
};

//put요청 공용 api
export const putApi = (url, params, config) => {
  return api.put(url, params, config);
};
