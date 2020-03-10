import axios from "axios";
import qs from "querystring";
import { LoginApi } from "../api";

class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(id, password, callback) {
    const response = LoginApi(id, password);
    response.then(res => {
      const {
        data: { data }
      } = res;
      if (data) {
        this.authenticated = true;
        callback();
      } else {
      }
    });
  }

  logout(callback) {
    this.authenticated = false;
    callback();
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
