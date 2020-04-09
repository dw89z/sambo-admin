import React from "react";
import "./MastEntry.scss";
import Dropzone from "react-dropzone";
import { postApi, getApi } from "../../../api";
import axios from "axios";
import LiveSearch from "../common/LiveSeach";
import InnerLoading from "../../InnerLoading";

export default class extends React.Component {
  state = {
    signImage: [],
    isSign: false,
    logid: "",
    passwd: "",
    changepasswd: "",
    checkpasswd: "",
    auth: "",
    cvnas: "협력사명",
    gubun: "업체구분",
    subcontractor: {},
    checkPass: false,
    checkError: false,
    innerLoading: false,
    signURL: "",
    isMast: true,
  };

  inputs = {
    inputUpdate: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    },

    inputCheck: (e) => {
      const { name, value } = e.target;
      this.setState({
        [name]: value,
      });
      if (this.state.changepasswd && this.state.checkpasswd) {
        this.setState({
          checkPass: true,
        });
      }
    },

    liveResult: (result) => {
      this.setState({
        logid: result,
      });
    },

    onDrop: (file) => {
      this.setState({
        signImage: file.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
        isSign: true,
      });
      this.submits.uploadSign();
    },
  };

  submits = {
    getContractor: async () => {
      this.setState({
        innerLoading: true,
      });
      const logid = {
        logid: this.state.logid,
      };
      await postApi("scm/subcontractor/getSubcontractor", logid).then((res) => {
        const {
          data: { data },
        } = res;
        console.log(res);
        this.setState({
          subcontractor: data.subcontractor,
          innerLoading: false,
        });
      });
      console.log(logid);
      await getApi(`admin/um/user/${logid}`).then((res) => {
        console.log(res);
        // this.setState({
        //   userId: userinfo.logid,
        //   cvnas: userinfo.cvnas,
        // });
      });
    },

    changePass: async (e) => {
      e.preventDefault();
      const { logid, changepasswd, checkpasswd } = this.state;
      const changePassword = {
        logid,
        changepasswd,
      };
      if (changepasswd === checkpasswd) {
        this.setState({
          checkError: false,
          changepasswd: "",
          checkpasswd: "",
          passwd: "",
        });
        await postApi(
          "scm/subcontractor/chagnepasswdauth",
          changePassword
        ).then((res) => {
          if (!res.data.errorCode) {
            this.props.done(res.data.data.message);
          } else {
            this.props.error(res.data.errorMessage);
          }
        });
      } else {
        this.setState({
          checkError: true,
        });
      }
    },

    uploadSign: async () => {
      const { signImage, subcontractor } = this.state;
      const token = sessionStorage.getItem("token");
      const config = {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      };
      let formData = new FormData();
      formData.append("cvcod", subcontractor.cvcod);
      formData.append("file", signImage[0]);

      await axios
        .post(
          "http://125.141.30.222:8757/scm/subcontractor/stampupload",
          formData,
          { headers: config }
        )
        .then((res) => {
          console.log(res);
          if (res.data.errorCode === "") {
            this.props.done(res.data.data.message);
          } else if (res.data.errorCode === "1") {
            this.props.error(res.data.errorMessage);
          }
        });
    },
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.logid !== this.state.logid) {
      this.submits.getContractor();
    }
  }

  async componentDidMount() {
    const auth = parseInt(this.props.user.userinfo.auth);
    const { userinfo } = this.props.user;

    if (auth) {
      this.setState({
        logid: userinfo.logid,
        auth: true,
      });
    } else {
      this.setState({
        logid: userinfo.logid,
        auth: false,
      });
    }

    const logidPost = {
      logid: userinfo.logid,
    };
    await postApi("scm/subcontractor/getSubcontractor", logidPost).then(
      (res) => {
        const {
          data: { data },
        } = res;
        console.log(res);
        this.setState({
          subcontractor: data.subcontractor,
        });
      }
    );
  }

  comp = {
    resultSpan: (auth) => {
      const { userinfo } = this.props.user;
      const { subcontractor } = this.state;
      let spans;
      if (auth === "1") {
        spans = (
          <>
            <span className="result-span">{userinfo.cvnas}</span>
            <span className="result-span">
              {userinfo.gubn === "0" ? "외주업체" : "구매업체"}
            </span>
          </>
        );
      } else {
        spans = (
          <>
            <span className="result-span">{subcontractor.cvnas}</span>
            <span className="result-span">
              {subcontractor.gubn === "0" ? "외주업체" : "구매업체"}
            </span>
          </>
        );
      }
      return spans;
    },
  };

  render() {
    const {
      signImage,
      isSign,
      passwd,
      checkpasswd,
      changepasswd,
      auth,
      subcontractor,
      checkPass,
      checkError,
      innerLoading,
      isMast,
    } = this.state;
    const { userinfo } = this.props.user;
    const submits = this.submits;
    const inputs = this.inputs;
    const thumbs = signImage.map((file) => (
      <div key={file.name} className="sign-image-box">
        <img src={file.preview} alt="sign" className="sign-image" />
      </div>
    ));

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component mast-entry">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onSubmit={submits.getContractor}>
              <div className="input-div">
                <span className="label">로그인ID</span>
                <LiveSearch
                  user={userinfo}
                  isMast={isMast}
                  liveResult={inputs.liveResult}
                />
                {this.comp.resultSpan()}
              </div>
            </form>
          </div>
          <div className="mast-section">
            <table>
              <tbody>
                <tr>
                  <th colSpan="1">거래처코드</th>
                  <td colSpan="3">{subcontractor.cvcod}</td>
                </tr>
                <tr>
                  <th>거래처명</th>
                  <td>{subcontractor.cvnas}</td>
                  <th>거래처 약명</th>
                  <td>{subcontractor.cvnas2}</td>
                </tr>
                <tr>
                  <th>사업자 등록번호</th>
                  <td>{subcontractor.sano}</td>
                  <th>대표자명</th>
                  <td>{subcontractor.ownam}</td>
                </tr>
                <tr>
                  <th>대표전화</th>
                  <td>{subcontractor.telno}</td>
                  <th>FAX번호</th>
                  <td>{subcontractor.faxno}</td>
                </tr>
                <tr>
                  <th>업태</th>
                  <td>{subcontractor.uptae}</td>
                  <th>업종</th>
                  <td>{subcontractor.jongk}</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td>{subcontractor.addr}</td>
                  <th>우편번호</th>
                  <td>{subcontractor.posno}</td>
                </tr>
              </tbody>
            </table>

            <div className="mast-modify">
              <div className="password-section">
                <h4>비밀번호 변경</h4>
                <form onSubmit={submits.changePass}>
                  <div className="input-div">
                    {auth ? null : (
                      <>
                        <span className="label">현재 비밀번호</span>
                        <input
                          type="text"
                          name="passwd"
                          value={passwd}
                          onChange={inputs.inputUpdate}
                          required
                        />
                      </>
                    )}
                  </div>
                  <div className="input-div nmt">
                    <span className="label">변경할 비밀번호</span>
                    <input
                      type="text"
                      name="changepasswd"
                      value={changepasswd}
                      onChange={inputs.inputCheck}
                      required
                    />
                  </div>
                  <div className="input-div">
                    <span className="label">비밀번호 재확인</span>
                    <input
                      type="text"
                      name="checkpasswd"
                      value={checkpasswd}
                      onChange={inputs.inputCheck}
                      required
                    />
                    <span className={checkError ? "error" : "error none"}>
                      변경 비밀번호가 일치하지 않습니다
                    </span>
                  </div>

                  <button className="save" disabled={!checkPass}>
                    비밀번호 변경
                  </button>
                </form>
              </div>
              <div className="sign-section">
                <h4>거래명세서 도장 관리</h4>
                <div className="sign-section-inner">
                  <div className="infos">
                    <p className="file-info main-info">
                      도장 그림 영역을 클릭하거나, <br />
                      파일을 드래그하여 추가하세요
                    </p>
                    <p className="file-info">
                      *도장 파일이 등록/변경되면 자동으로 저장됩니다
                    </p>
                  </div>
                  <form>
                    <Dropzone onDrop={inputs.onDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <section className="sign-dropzone">
                          <div
                            {...getRootProps({
                              className: "dropzone",
                            })}
                          >
                            <input
                              className="sign-drag-box"
                              {...getInputProps({ accept: "image/*" })}
                            />
                            <p className="drag-info">
                              {isSign ? "" : "도장 그림파일 영역"}
                            </p>
                          </div>
                          {thumbs}
                        </section>
                      )}
                    </Dropzone>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
