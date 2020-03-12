import { loginApi } from "../api";

class Auth {
  constructor() {
    this.authenticated = false;
    this.isAuthenticated();
  }

  async login(id, password, callback) {
    await loginApi(id, password).then(({ data: { data } }) => {
      if (data) {
        sessionStorage.setItem("token", data);
        this.authenticated = true;
        callback();
      } else {
        this.authenticated = false;
      }
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
