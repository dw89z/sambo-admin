import React from "react";
import "./Login.scss";
import userIcon from "../../assets/img/login-user.svg";
import passwordIcon from "../../assets/img/password.svg";
import logo from "../../assets/img/login-logo.svg";
import mainlogo from "../../assets/img/login-main-logo.svg";

import auth from "../auth";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.detectLoginFail = this.detectLoginFail.bind(this);
  }

  state = {
    id: "",
    password: "",
    loginFailed: auth.isAuthenticated()
  };

  detectLoginFail(e) {
    e.preventDefault();
    setTimeout(() => {
      this.setState({
        loginFailed: !auth.isAuthenticated()
      });
    }, 250);

    setTimeout(() => {
      this.setState({
        loginFailed: false
      });
    }, 1700);
  }

  handleUpdate(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { loginFailed, id, password } = this.state;

    return (
      <>
        <div className="container">
          <div className="back-wrap">
            <div className="title">
              <p>
                삼보모터스 <br /> 공급망 관리 <br /> 시스템
              </p>
            </div>
            <img src={logo} alt="logo" />
          </div>
          <div className="login-wrap">
            <div className="login-logo">
              <img src={mainlogo} alt="logo" />
              <p>
                Global leading company <br /> <strong>SAMBOMOTORS</strong>
              </p>
            </div>
            <form action="" onSubmit={this.detectLoginFail}>
              <div className="login-inner">
                <img src={userIcon} alt="user" className="icon" />
                <input
                  id="id"
                  className="login-input id"
                  type="text"
                  name="id"
                  value={id}
                  onChange={this.handleUpdate}
                />
                <label htmlFor="id" className={id ? "active" : ""}>
                  ID
                </label>
              </div>
              <div className="login-inner">
                <img src={passwordIcon} alt="password" className="icon" />
                <input
                  id="password"
                  className="login-input password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleUpdate}
                />
                <label htmlFor="password" className={password ? "active" : ""}>
                  PASSWORD
                </label>
              </div>

              <button
                type="submit"
                className={loginFailed ? "wrong login-submit" : "login-submit"}
                onClick={() => {
                  auth.login(id, password, () => {
                    this.props.history.push("/main");
                  });
                }}
              >
                {loginFailed ? "로그인 정보가 올바르지 않습니다" : "로그인"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
