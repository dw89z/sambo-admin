import { LoginApi } from "../api";

class Auth {
  constructor() {
    this.authenticated = false;
    this.isAuthenticated();
  }

  login(id, password, callback) {
    const response = LoginApi(id, password);
    response.then(res => {
      const {
        data: { data }
      } = res;
      if (data) {
        sessionStorage.setItem("token", data);
        this.authenticated = true;
        callback();
      }
      return;
    });
  }

  logout(callback) {
    sessionStorage.clear();
    this.authenticated = false;
    callback();
  }

  isAuthenticated() {
    const isToken = sessionStorage.getItem("token");
    if (isToken) {
      this.authenticated = true;
      return this.authenticated;
    }
    return this.authenticated;
  }
}

export default new Auth();
