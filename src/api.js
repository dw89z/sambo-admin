import axios from "axios";
import qs from "querystring";

// axios.defaults.baseURL = "http://125.141.30.222:8757";
// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";
export const api = axios.create({
  baseURL: "http://192.168.75.199:8080",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

api.interceptors.request.use(
  function(config) {
    config.headers = { ...config.headers, Authorization: getAuthToken() };
    // you can also do other modification in config
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export const LoginApi = (id, password) => {
  const data = {
    logid: id,
    passwd: password
  };
  const response = api.post("/auth/login", qs.stringify(data));
  return response;
};

export const postApi = (url, params, config) => {
  const response = api.post(url, params, config);
  return response;
};
