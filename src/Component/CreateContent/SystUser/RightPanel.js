import React from "react";
import close from "../../../assets/img/close.svg";
import { postApi, putApi } from "../../../api";

class RightPanel extends React.Component {
  state = {
    typing: false,
    typingTimeout: 0,
    user: {
      logid: "",
      passwd: "",
      cvnas: "",
      cvcod: "",
      gubn: "",
      hphone: "",
      email: "",
      telno: "",
      auth: ""
    },
    idpass: false,
    cvcodpass: false,
    error: {
      id: {
        error: false,
        message: ""
      },
      cvcod: {
        error: false,
        message: ""
      }
    },
    cvcodList: {
      visible: false,
      list: []
    }
  };

  inputUpdate = e => {
    const user = this.state.user;
    this.setState({
      user: {
        ...user,
        [e.target.name]: e.target.value
      }
    });
  };

  inputUpdateId = e => {
    const { addMode, openEdit } = this.props;
    const data = {
      userid: e.target.value.trim()
    };
    const user = this.state.user;

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      user: {
        ...user,
        [e.target.name]: e.target.value
      },
      idpass: false,
      typingTimeout: setTimeout(async () => {
        const userid = this.state.user.logid.trim();
        const error = this.state.error;
        if (userid !== "") {
          await postApi("admin/um/checkuser", JSON.stringify(data)).then(
            res => {
              const { data } = res;
              if (data.data.result) {
                this.setState({
                  error: {
                    ...error,
                    id: {
                      error: false,
                      message: data.errorMessage
                    }
                  },
                  idpass: true
                });
              } else {
                this.setState({
                  error: {
                    ...error,
                    id: {
                      error: true,
                      message: data.errorMessage
                    }
                  },
                  idpass: false
                });
              }
            }
          );
        } else {
          this.setState({
            error: {
              ...error,
              id: {
                error: false,
                message: ""
              }
            }
          });
        }
      }, 300)
    });
  };

  inputUpdateCod = e => {
    const cvTrim = e.target.value.trim();
    const cvUpper = cvTrim.toUpperCase();
    const data = {
      searchKeyword: cvUpper
    };
    const user = this.state.user;

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      user: {
        ...user,
        [e.target.name]: e.target.value
      },
      cvcodpass: false,
      typingTimeout: setTimeout(async () => {
        const usercvcod = this.state.user.cvcod.trim();
        const error = this.state.error;
        if (usercvcod !== "") {
          await postApi(
            "admin/um/searchconnections",
            JSON.stringify(data)
          ).then(res => {
            const { data } = res;

            if (data.data) {
              this.setState({
                cvcodList: {
                  visible: true,
                  list: data.data
                },
                error: {
                  ...error,
                  cvcod: {
                    error: false,
                    message: ""
                  }
                }
              });
            } else if (data.status === "Fail") {
              this.setState({
                error: {
                  ...error,
                  cvcod: {
                    error: true,
                    message: data.errorMessage
                  }
                },
                cvcodpass: false
              });
            }
          });
        } else {
        }
      }, 500)
    });
  };

  submitUser = async e => {
    e.preventDefault();
    const { addMode, openEdit } = this.props;
    const data = {
      logid: this.state.user.logid,
      passwd: this.state.user.passwd,
      cvcod: this.state.user.cvcod,
      cvnas: this.state.user.cvnas,
      telno: this.state.user.telno,
      email: this.state.user.email,
      auth: this.state.user.auth,
      gubn: this.state.user.gubn,
      hphone: this.state.user.hphone
    };
    if (addMode) {
      await postApi("admin/um/user", JSON.stringify(data)).then(res => {
        console.log(res);
        const { data } = res;
        if (!data.errorCode) {
          this.props.closeAllMode();
        }
      });
    } else if (openEdit) {
      await putApi("admin/um/user", JSON.stringify(data)).then(res => {
        console.log(res);
        const { data } = res;
        if (!data.errorCode) {
          this.props.closeAllMode();
        }
      });
    }
  };

  setCvcod = e => {
    const cvcod = e.currentTarget.getAttribute("data-cvcod");
    const cvnas = e.currentTarget.getAttribute("data-cvnas");
    const user = this.state.user;
    this.setState({
      user: {
        ...user,
        cvcod,
        cvnas
      },
      cvcodList: {
        visible: false
      },
      cvcodpass: true
    });
  };

  componentDidUpdate(props) {
    if (props.openEdit !== this.props.openEdit) {
      this.setState({
        user: this.props.selectedRow
      });
    }
    if (props.addMode !== this.props.addMode) {
      this.setState({
        user: {
          logid: "",
          passwd: "",
          cvnas: "",
          cvcod: "",
          gubn: "",
          hphone: "",
          email: "",
          telno: "",
          auth: ""
        }
      });
    }
  }

  render() {
    const { user, idpass, cvcodpass, error, cvcodList } = this.state;
    console.log(user);

    return (
      <>
        <div
          className={
            this.props.addMode || this.props.openEdit
              ? "right-panel active"
              : "right-panel"
          }
        >
          <h3>{this.props.title}</h3>
          <div className="close-btn" onClick={this.props.closeAllMode}>
            <img src={close} alt="" />
          </div>
          <form onSubmit={this.submitUser}>
            <div className="input-div">
              <p>로그인ID</p>
              <input
                type="text"
                placeholder="ID를 입력해 주세요"
                name="logid"
                spellCheck="false"
                onChange={this.inputUpdateId}
                value={user.logid}
                autoComplete="off"
                required
              />
              <span className={error.id.error ? "error" : "error none"}>
                {error.id.message}
              </span>
            </div>

            <div className="input-div">
              <p>비밀번호</p>
              <input
                type="text"
                placeholder="비밀번호를 입력해 주세요"
                name="passwd"
                spellCheck="false"
                value={user.passwd}
                autoComplete="off"
                onChange={this.inputUpdate}
                required
              />
            </div>

            <div className="input-div">
              <p>거래처코드</p>
              <input
                type="text"
                placeholder="거래처코드를 검색해 주세요"
                name="cvcod"
                spellCheck="false"
                value={user.cvcod}
                autoComplete="off"
                onChange={this.inputUpdateCod}
                required
              />
              {cvcodList.visible ? (
                <ul className="search-cod-list">
                  {cvcodList.list.map((list, index) => {
                    return (
                      <li
                        key={index}
                        onClick={this.setCvcod}
                        data-cvcod={list.cvcod}
                        data-cvnas={list.cvnas2}
                      >
                        <span>{list.cvcod}</span>
                        <span>{list.cvnas2}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              <span className={error.cvcod.error ? "error" : "error none"}>
                {error.cvcod.message}
              </span>
            </div>

            <div className="input-div">
              <p>거래처명</p>
              <input
                type="text"
                placeholder="거래처명을 입력해 주세요"
                name="cvnas"
                spellCheck="false"
                value={user.cvnas}
                autoComplete="off"
                onChange={this.inputUpdate}
                required
              />
            </div>

            <div className="input-div">
              <p>권한구분</p>
              <div className="radio-section">
                <div className="radio">
                  <input
                    type="radio"
                    name="auth"
                    id="normal"
                    value="0"
                    checked={user.auth === "0"}
                    onChange={this.inputUpdate}
                    required
                  />
                  <label htmlFor="normal">일반</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    name="auth"
                    id="admin"
                    value="1"
                    checked={user.auth === "1"}
                    onChange={this.inputUpdate}
                    required
                  />
                  <label htmlFor="admin">관리자</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    name="auth"
                    id="corop"
                    value="2"
                    checked={user.auth === "2"}
                    onChange={this.inputUpdate}
                    required
                  />
                  <label htmlFor="corop">협력사</label>
                </div>
              </div>
            </div>

            <div className="input-div">
              <p>거래처구분</p>
              <div className="radio-section">
                <div className="radio">
                  <input
                    type="radio"
                    name="gubn"
                    id="outer"
                    value="0"
                    checked={user.gubn === "0"}
                    onChange={this.inputUpdate}
                    required
                  />
                  <label htmlFor="outer">외주업체</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    name="gubn"
                    id="buyer"
                    value="1"
                    checked={user.gubn === "1"}
                    onChange={this.inputUpdate}
                    required
                  />
                  <label htmlFor="buyer">구매업체</label>
                </div>
              </div>
            </div>

            <div className="input-div">
              <p>핸드폰</p>
              <input
                type="tel"
                placeholder="핸드폰 번호를 입력해 주세요"
                name="hphone"
                spellCheck="false"
                value={user.hphone}
                onChange={this.inputUpdate}
              />
            </div>

            <div className="input-div">
              <p>회사전화</p>
              <input
                type="tel"
                placeholder="전화 번호를 입력해 주세요"
                name="telno"
                spellCheck="false"
                value={user.telno}
                onChange={this.inputUpdate}
              />
            </div>

            <div className="input-div">
              <p>이메일</p>
              <input
                type="email"
                placeholder="이메일을 입력해 주세요"
                name="email"
                spellCheck="false"
                value={user.email}
                onChange={this.inputUpdate}
              />
            </div>
            {idpass && cvcodpass ? (
              <button className="save">저장</button>
            ) : (
              <button className="save" disabled>
                저장
              </button>
            )}
          </form>
        </div>
      </>
    );
  }
}

export default RightPanel;
