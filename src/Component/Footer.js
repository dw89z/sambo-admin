import React from "react";
import "../Scss/Footer.css";
import cLogo from "../assets/img/f-logo01.png";
import pLogo from "../assets/img/f-logo02.png";

class Footer extends React.Component {
  render() {
    return (
      <div className={this.props.axis ? "footer non-padding" : "footer"}>
        <div className="preloading">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div className="footer-util">
          <ul>
            <li>자료실</li>
            <li>사용자매뉴얼 / 폰트</li>
            <li>공지사항</li>
          </ul>
        </div>
        <div className="footer-info">
          <div className="client">
            <img src={cLogo} alt="logo" />
            <span>Copyright ⓒ Willdo All Rights Reserved.</span>
          </div>
          <div className="production">
            <img src={pLogo} alt="logo" />
            <a
              rel="noopener noreferrer"
              href="http://willdo.co.kr/"
              target="_blank"
            >
              원격지원
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
