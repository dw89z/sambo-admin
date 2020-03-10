import React from "react";
import axios from "axios";
import "./Login.css";
import logo from "../../assets/img/logo.png";
import userIcon from "../../assets/img/login-user.svg";
import passwordIcon from "../../assets/img/password.svg";
import qs from "querystring";
import auth from "../auth";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.handleError = this.handleError.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  state = {
    id: "",
    password: "",
    loginFailed: false
  };

  handleUpdate(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // 로그인이 실패했을 경우 버튼 스타일 변경 및 애니메이션 호출
  handleError(e) {
    e.preventDefault();

    this.setState({
      loginFailed: true
    });

    setTimeout(() => {
      this.setState({
        loginFailed: false
      });
    }, 2000);
  }

  render() {
    const { loginFailed, id, password } = this.state;

    return (
      <>
        <div className="container">
          {/* <p>
            삼보모터스
            <br />
            공급망 관리 <br />
            시스템
          </p> */}
          <div className="login-wrap">
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
              className={loginFailed ? "wrong login-submit" : "login-submit"}
              onClick={() => {
                auth.login(() => {
                  this.props.history.push("/main");
                });
              }}
            >
              {loginFailed ? "로그인 정보가 올바르지 않습니다" : "로그인"}
            </button>
          </div>
        </div>
      </>
    );
  }
}
