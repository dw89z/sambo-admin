import React from "react";
import "./Login.css";
import userIcon from "../../assets/img/login-user.svg";
import passwordIcon from "../../assets/img/password.svg";
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
    }, 500);

    setTimeout(() => {
      this.setState({
        loginFailed: false
      });
    }, 1700);
  }

  //
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
          {/* <p>
            삼보모터스
            <br />
            공급망 관리 <br />
            시스템
          </p> */}
          <div className="login-wrap">
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
