import React from "react";
import "../Scss/Login.css";
import logo from "../assets/img/logo.png";
import userIcon from "../assets/img/login-user.svg";
import passwordIcon from "../assets/img/password.svg";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleId = this.handleId.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  state = {
    userId: "",
    password: "",
    user: {
      id: "bselpin",
      password: "bselpin"
    },
    loginFailed: false
  };

  // userID를 업데이트 및 엔터키 로그인 바인딩
  handleId(e) {
    const {
      userId,
      password: pass,
      user: { id, password }
    } = this.state;
    this.setState({
      userId: e.target.value
    });
    if (e.charCode === 13) {
      if (id === userId && pass === password) {
        e.preventDefault();
        this.props.login(e);
      } else {
        this.handleError(e);
      }
    }
  }

  // password를 업데이트 및 엔터키 로그인 바인딩
  handlePassword(e) {
    const {
      userId,
      password: pass,
      user: { id, password }
    } = this.state;
    this.setState({
      password: e.target.value
    });
    if (e.charCode === 13) {
      if (id === userId && pass === password) {
        e.preventDefault();
        this.props.login(e);
      } else {
        this.handleError(e);
      }
    }
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
    const {
      loginFailed,
      userId,
      password: pass,
      user: { id, password }
    } = this.state;

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
            <form action="">
              <div className="login-inner">
                <img src={userIcon} alt="user" className="icon" />
                <input
                  id="id"
                  className="login-input id"
                  type="text"
                  required
                  value={this.state.userId}
                  onChange={this.handleId}
                />
                <label htmlFor="id" className={userId ? "active" : ""}>
                  ID
                </label>
              </div>
              <div className="login-inner">
                <img src={passwordIcon} alt="password" className="icon" />
                <input
                  id="password"
                  className="login-input password"
                  type="password"
                  required
                  value={this.state.password}
                  onChange={this.handlePassword}
                />
                <label htmlFor="password" className={pass ? "active" : ""}>
                  PASSWORD
                </label>
              </div>

              <button
                className={loginFailed ? "wrong login-submit" : "login-submit"}
                onClick={
                  userId === id && pass === password
                    ? this.props.login
                    : this.handleError
                }
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

export default Login;
