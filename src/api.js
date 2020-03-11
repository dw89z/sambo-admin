import axios from "axios";
import qs from "querystring";

const api = axios.create({
  baseURL: "http://125.141.30.222:8757"
});

const loginConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

export const jsonApi = {
  getUser: () => api.get("users")
};

export const LoginApi = (id, password) => {
  const data = {
    logid: id,
    passwd: password
  };
  const response = api.post(
    "/auth/login",
    qs.stringify(data),
    loginConfig
  );
  return response;
};

export const postApi = (url, params, config) => {
  const response = api.post(url, params, config);
  return response;
};

