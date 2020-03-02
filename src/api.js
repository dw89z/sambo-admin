import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/"
});

export const jsonApi = {
  getUser: () => api.get("users")
};
