import axios from "axios";
import qs from "querystring";

axios.defaults.baseURL = 'http://125.141.30.222:8757';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export const jsonApi = {
  getUser: () => axios.get("users")
};

export const LoginApi = (id, password) => {
  const data = {
    logid: id,
    passwd: password
  };
  const response = axios.post(
    "/auth/login",
    qs.stringify(data),
  );
  return response;
};

export const postApi = (url, params, config) => {
  const response = axios.post(url, params, config);
  return response;
};

