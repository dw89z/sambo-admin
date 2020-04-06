import React from "react";
import "./Header.scss";
import user from "../../assets/img/user.svg";
import logout from "../../assets/img/logout.svg";
import ui from "../../assets/img/ui.svg";
import auth from "../auth";

export default class extends React.Component {
  render() {
    return (
      <>
        <div className="header">
          <div className="util-box">
            <p>{this.props.user.userinfo.cvnas} - 환영합니다.</p>
            <div onClick={this.props.toggleMenuAxis}>
              <img src={ui} alt="ui" />
              <span>UI변경</span>
            </div>
            <div>
              <img src={user} alt="user" />
              <span>회원정보</span>
            </div>
            <div
              onClick={() => {
                auth.logout(() => {
                  this.props.history.push("/");
                });
              }}
            >
              <img src={logout} alt="logout" />
              <span>로그아웃</span>
            </div>
          </div>
        </div>
      </>
    );
  }
}
