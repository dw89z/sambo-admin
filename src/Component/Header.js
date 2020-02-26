import React from "react";
import "../Scss/Header.css";
import user from "../assets/img/user.svg";
import logout from "../assets/img/logout.svg";
import logo from "../assets/img/logo.png";
import ui from "../assets/img/ui.svg";

class Header extends React.Component {
  render() {
    return (
      <>
        <div className="logo-section">
          <h1>
            <img src={logo} alt="logo" />
          </h1>
          <p>Supply Chain Mangement</p>
        </div>
        <div className="header">
          <div className="util-box">
            <p>삼모모터스㈜ – (구매) 환영합니다.</p>
            <div onClick={this.props.toggleMenuAxis}>
              <img src={ui} alt="" />
              <span>UI변경</span>
            </div>
            <div>
              <img src={user} alt="" />
              <span>회원정보</span>
            </div>
            <div>
              <img src={logout} alt="" />
              <span>로그아웃</span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Header;
