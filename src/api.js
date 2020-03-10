import axios from "axios";
import qs from "querystring";

const api = axios.create({
  baseURL: "http://125.141.30.222:8757"
});

const config = {
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
  return api.post("/auth/login", qs.stringify(data), config).then(res => {
    return res;
  });
};
