import React from "react";
import "./MastEntry.scss";
import Dropzone from "react-dropzone";

export default class extends React.Component {
  state = {
    signImage: [],
    isSign: false,
  };

  inputs = {
    onDrop: (file) => {
      this.setState({
        signImage: file.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
        isSign: true,
      });
    },
  };

  componentDidMount() {}

  submits = {
    search: (e) => {
      e.preventDefault();
    },

    modifyPassword: (e) => {
      e.preventDefault();
    },

    uploadSign: (e) => {
      e.preventDefault();
    },
  };

  render() {
    const { signImage, isSign } = this.state;
    const submits = this.submits;
    const inputs = this.inputs;
    const thumbs = signImage.map((file) => (
      <div key={file.name} className="sign-image-box">
        <img src={file.preview} alt="sign" className="sign-image" />
      </div>
    ));
    console.log(signImage);

    return (
      <>
        <div className="content-component mast-entry">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onChange={submits.search}>
              <div className="input-div">
                <span className="label">로그인ID</span>
                <input type="text" />
                <button className="search-btn"></button>
                <span className="result-span">협력사명</span>
                <span className="result-span">업체구분</span>
              </div>
            </form>
          </div>
          <div className="mast-section">
            <table>
              <tbody>
                <tr>
                  <th colSpan="1">거래처코드</th>
                  <td colSpan="3">코드변수</td>
                </tr>
                <tr>
                  <th>거래처명</th>
                  <td>변수</td>
                  <th>거래처 약명</th>
                  <td>변수</td>
                </tr>
                <tr>
                  <th>사업자 등록번호</th>
                  <td>변수</td>
                  <th>대표자명</th>
                  <td>변수</td>
                </tr>
                <tr>
                  <th>대표전화</th>
                  <td>변수</td>
                  <th>FAX번호</th>
                  <td>변수</td>
                </tr>
                <tr>
                  <th>업태</th>
                  <td>변수</td>
                  <th>업종</th>
                  <td>변수</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td>변수</td>
                  <th>우편번호</th>
                  <td>변수</td>
                </tr>
              </tbody>
            </table>

            <div className="mast-modify">
              <div className="password-section">
                <h4>비밀번호 변경</h4>
                <form>
                  <div className="input-div">
                    <span className="label">현재 비밀번호</span>
                    <input type="text" />
                  </div>
                  <div className="input-div">
                    <span className="label">변경할 비밀번호</span>
                    <input type="text" />
                  </div>
                  <div className="input-div">
                    <span className="label">비밀전호 재확인</span>
                    <input type="text" />
                  </div>
                  <button className="save">비밀번호 변경</button>
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
                      *도장 파일이 등록/변경하면 자동으로 저장됩니다
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
