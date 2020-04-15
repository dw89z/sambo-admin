import React from "react";
import "../../../globals";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BootstrapTable from "react-bootstrap-table-next";
import ReactSummernote from "react-summernote";
import DatePicker from "react-datepicker";
import Dropzone from "react-dropzone";
import axios from "axios";
import "react-summernote/dist/react-summernote.css";
import "react-summernote/lang/summernote-ko-KR";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import InnerLoading from "../../InnerLoading";
import { postApi } from "../../../api";
import "../SystNotify/SystNotify.scss";

class TextEditor extends React.Component {
  state = {
    innerLoading: false,
    userSearch: "",
    userList: [],
    libraryauth: [],
    columns: [
      {
        dataField: "logid",
        text: "로그인ID",
        sort: true,
      },
      {
        dataField: "cvnas",
        text: "사용자명",
        sort: true,
      },
    ],
    errorSearch: true,
    library: {
      crtdat: "",
      gubun: "0",
      title: "",
      logid: this.props.user.logid,
      bdata: "",
      stdat: "",
      eddat: "",
    },
    file: [],
    tabIndex: 0,
    libraryfilelist: [],
    deleteList: [],
    stdat: "",
    eddat: new Date(),
    crtdat: new Date(),
  };

  init = () => {
    this.setState({
      library: {
        crtdat: "",
        gubun: "0",
        title: "",
        logid: this.props.user.logid,
        bdata: "",
        stdat: "",
        eddat: "",
      },
      file: [],
      tabIndex: 0,
      libraryauth: [],
      libraryfilelist: [],
      deletelist: [],
    });
  };

  onDrop = (files) => {
    const { file } = this.state;
    this.setState({ file: [...file, ...files] });
  };

  onImageUpload = (fileList) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ReactSummernote.insertImage(reader.result);
    };
    reader.readAsDataURL(fileList[0]);
  };

  inputs = {
    stDatChange: (date) => {
      const { library } = this.state;
      const stdat = this.formatLibDate(date);
      this.setState({
        stdat: date,
        library: {
          ...library,
          stdat,
        },
      });
    },

    edDatChange: (date) => {
      const { library } = this.state;
      const eddat = this.formatLibDate(date);
      this.setState({
        eddat: date,
        library: {
          ...library,
          eddat,
        },
      });
    },

    delFile: (e) => {
      const { file } = this.state;
      const toDelFile = file.filter((file) => file.name !== e.currentTarget.id);
      this.setState({
        file: toDelFile,
      });
    },

    deleteFile: (e) => {
      const { libraryfilelist, deleteList } = this.state;
      const toDelFile = libraryfilelist.filter(
        (file) => file.stored_file_name !== e.currentTarget.id
      );
      const delFile = libraryfilelist.filter(
        (file) => file.stored_file_name === e.currentTarget.id
      );
      const delStored = delFile.map((file) => file.stored_file_name);
      this.setState({
        libraryfilelist: toDelFile,
        deleteList: [...deleteList, ...delStored],
      });
    },

    inputUpdate: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    },

    inputLibrary: (e) => {
      const { library } = this.state;
      this.setState({
        library: {
          ...library,
          [e.target.name]: e.target.value,
        },
      });
    },

    deleteSelected: (e) => {
      const { libraryauth } = this.state;
      const btn = e.currentTarget;
      const logidSpan = btn.previousElementSibling.previousElementSibling;
      const logid = logidSpan.innerHTML;
      const result = libraryauth.filter((list) => list.logid !== logid);
      this.setState({
        libraryauth: result,
      });
    },

    selectAll: () => {
      const { userList, libraryauth } = this.state;
      const jsonAuth = libraryauth.map((list) => JSON.stringify(list));
      const jsonUser = userList.map((list) => JSON.stringify(list));
      const remain = jsonAuth
        .filter((list) => !jsonUser.includes(list))
        .concat(jsonUser.filter((list) => !jsonAuth.includes(list)));
      const authResult = remain.map((remain) => JSON.parse(remain));
      this.setState({
        libraryauth: [...libraryauth, ...authResult],
      });
    },

    deselectAll: () => {
      this.setState({
        libraryauth: [],
      });
    },
  };

  submits = {
    searchUser: async (e) => {
      e.preventDefault();
      const { userSearch } = this.state;
      const data = {
        searchKeyword: userSearch,
      };
      this.setState({
        userList: [],
      });
      await postApi("admin/um/searchusers", data).then((res) => {
        const {
          data: { data },
        } = res;
        if (data.length === 0) {
          this.setState({
            userList: [],
            errorSearch: true,
          });
        } else {
          const result = data.map((data) => {
            const list = {
              logid: data.logid,
              cvnas: data.cvnas,
            };
            return list;
          });
          this.setState({
            userList: result,
            errorSearch: false,
          });
        }
      });
    },

    deleteLibrary: async (e) => {
      e.preventDefault();
      const {
        editData: { library },
      } = this.props;
      await postApi(`admin/library/deletelibrary/${library.seqno}`, {}).then(
        (res) => {
          if (!res.data.errorCode) {
            this.init();
            this.props.done(res.data.data.message);
            this.props.changeMode();
          } else {
            this.props.error(res.data.errorMessage);
          }
        }
      );
    },

    saveLibrary: async (e) => {
      e.preventDefault();
      this.setState({
        innerLoading: true,
      });
      const { library, libraryauth, file, deleteList } = this.state;
      let formData = new FormData();
      if (this.props.editMode) {
        delete library.crtdat;
        delete library.logid;
        if (deleteList.length > 0) {
          const jsonDeleteList = JSON.stringify(deleteList);
          formData.append("deletelist", jsonDeleteList);
        }
      } else {
        delete library.seqno;
      }

      const jsonLibrary = JSON.stringify(library);
      const token = sessionStorage.getItem("token");
      const config = {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      };

      formData.append("library", jsonLibrary);

      if (library.gubun === 1) {
        const users = libraryauth.map((list) => list.logid);
        const jsonAuth = JSON.stringify(users);
        formData.append("libraryauth", jsonAuth);
      }

      if (file.length > 0) {
        for (let i in file) {
          formData.append("file", file[i]);
        }
      }

      if (!this.props.editMode) {
        await axios
          .post(
            "http://125.141.30.222:8757/admin/library/insertlibrary",
            formData,
            { headers: config }
          )
          .then((res) => {
            if (!res.data.errorCode) {
              this.init();
              this.props.changeMode();
              this.props.done(res.data.data.message);
            } else {
              this.props.error(res.data.data.errorMessage);
            }
          });
      } else {
        await axios
          .post(
            "http://125.141.30.222:8757/admin/library/modifylibrary",
            formData,
            { headers: config }
          )
          .then((res) => {
            if (!res.data.errorCode) {
              this.init();
              this.props.changeMode();
              this.props.done(res.data.data.message);
            } else {
              this.props.error(res.data.data.message);
            }
          });
      }
    },
  };

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      const { libraryauth } = this.state;

      if (libraryauth.length === 0) {
        this.setState({
          libraryauth: [row],
        });
      } else {
        let result;
        for (let i in libraryauth) {
          if (!libraryauth.includes(row)) {
            result = row;
          } else {
            result = null;
          }
        }

        if (result !== null) {
          this.setState({
            libraryauth: [...libraryauth, result],
          });
        }
      }
    },
  };

  formatDate = () => {
    const { library } = this.state;
    const date = new Date();
    const yearNum = date.getFullYear();
    const stdat = date.setMonth(date.getMonth() - 2);
    let monthNum = date.getMonth() + 1;
    let dayNum = date.getDate();
    let year = yearNum.toString();
    let month = monthNum.toString();
    let beforeMonth = month - 2;
    let day = dayNum.toString();
    month = month.length === 1 ? "0" + month : month;
    beforeMonth =
      beforeMonth.toString().length === 1 ? "0" + beforeMonth : beforeMonth;
    day = day.length === 1 ? "0" + day : day;
    const fulldate = `${year}${month}${day}`;
    const beforeDate = `${year}${beforeMonth}${day}`;
    this.setState({
      library: {
        ...library,
        stdat: beforeDate,
        eddat: fulldate,
        crtdat: fulldate,
      },
      stdat,
    });
  };

  formatLibDate = (date) => {
    const yearNum = date.getFullYear();
    let monthNum = date.getMonth() + 1;
    let dayNum = date.getDate();
    let year = yearNum.toString();
    let month = monthNum.toString();
    let day = dayNum.toString();
    month = month.length === 1 ? "0" + month : month;
    day = day.length === 1 ? "0" + day : day;
    const fulldate = `${year}${month}${day}`;
    return fulldate;
  };

  formatDateObj = (date) => {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6) - 1;
    const day = date.substring(6, 8);
    return new Date(year, month, day);
  };

  formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  componentDidMount() {
    if (this.props.editMode) {
      const {
        editData: { library, libraryauth, libraryfilelist },
      } = this.props;
      const stdat = this.formatDateObj(library.stdat);
      const eddat = this.formatDateObj(library.eddat);
      const crtdat = this.formatDateObj(library.crtdat);
      this.setState({
        library: {
          crtdat: library.crtdat,
          gubun: library.gubun,
          title: library.title,
          logid: this.props.user.logid,
          bdata: library.bdata,
          seqno: library.seqno,
          stdat: library.stdat,
          eddat: library.eddat,
        },
        stdat,
        eddat,
        crtdat,
        libraryfilelist: [],
      });
      if (libraryfilelist) {
        this.setState({
          libraryfilelist,
        });
      }

      if (library.gubun === 1) {
        this.setState({
          libraryauth,
          tabIndex: 1,
        });
      }
    } else {
      this.setState({
        library: {
          crtdat: "",
          gubun: "0",
          title: "",
          logid: this.props.user.logid,
          bdata: "",
          stdat: "",
          eddat: "",
        },
        file: [],
        tabIndex: 0,
        libraryauth: [],
      });
      this.formatDate();
    }
  }

  render() {
    const {
      userList,
      columns,
      libraryauth,
      userSearch,
      errorSearch,
      library,
      file,
      tabIndex,
      libraryfilelist,
      stdat,
      eddat,
      crtdat,
      innerLoading,
    } = this.state;
    const submits = this.submits;
    const inputs = this.inputs;
    const files = file.map((file, index) => (
      <li key={index}>
        {file.name} - {this.formatBytes(file.size)}
        <span
          className="del-btn"
          onClick={inputs.delFile}
          id={file.name}
        ></span>
      </li>
    ));

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="close-btn" onClick={this.props.changeMode}></div>
        <form onSubmit={submits.saveLibrary}>
          <div className="textedit-section">
            <div className="textedit-header">
              <span className="label">사용자ID</span>
              <input
                name="userId"
                placeholder="-"
                className="auth-search main-search"
                type="text"
                value={this.props.user.logid}
                autoComplete="off"
                spellCheck="false"
                readOnly
              />
              <span className="label calendar">노출기간</span>
              <DatePicker
                selected={stdat}
                onChange={inputs.stDatChange}
                dateFormat="yyyy-MM-dd"
              />
              <span className="date-divider">~</span>
              <DatePicker
                selected={eddat}
                onChange={inputs.edDatChange}
                dateFormat="yyyy-MM-dd"
              />
              <span className="label ml">등록일자</span>
              <DatePicker selected={crtdat} dateFormat="yyyy-MM-dd" disabled />
            </div>

            <span className="textedit-label">제목</span>
            <input
              placeholder="제목을 입력해 주세요"
              className="textedit-title"
              type="text"
              name="title"
              onChange={inputs.inputLibrary}
              value={library.title}
              required
              autoComplete="false"
            />
          </div>

          <div className="notice-editor">
            <ReactSummernote
              value={library.bdata}
              className="summernote"
              options={{
                lang: "ko-KR",
                height: 350,
                dialogsInBody: true,
                spellCheck: false,
                disableDragAndDrop: true,
                toolbar: [
                  ["style", ["style"]],
                  ["font", ["bold", "underline", "clear", "fontsize", "color"]],
                  ["para", ["ul", "ol", "paragraph"]],
                  ["table", ["table"]],
                  ["insert", ["link", "picture", "video"]],
                ],
              }}
              onImageUpload={this.onImageUpload}
              onChange={(content) => {
                const { library } = this.state;
                this.setState({
                  library: {
                    ...library,
                    bdata: content,
                  },
                });
              }}
            />
            {this.props.editMode && libraryfilelist.length > 0 ? (
              <>
                <div className="modify-file-section">
                  <span className="file-label">기존 업로드 파일</span>
                  <ul className="modify-list">
                    {libraryfilelist.map((list, index) => (
                      <li key={index} className="modify-file">
                        {list.org_file_name}
                        <span
                          id={list.stored_file_name}
                          className="del-btn"
                          onClick={inputs.deleteFile}
                        ></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
            <Dropzone onDrop={this.onDrop} multiple>
              {({ getRootProps, getInputProps }) => (
                <section className="dzu-dropzone">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p className="droparea">
                      클릭, 혹은 드래그하여 파일을 추가하세요
                    </p>
                  </div>
                  <aside>
                    <ul>{files}</ul>
                  </aside>
                </section>
              )}
            </Dropzone>
          </div>
          <button className="save">저장</button>
          {this.props.editMode ? (
            <button className="save delete" onClick={submits.deleteLibrary}>
              삭제
            </button>
          ) : null}
        </form>
        <div className="user-select-section">
          <div className="user-selection">
            <Tabs
              className="user-select-tabs"
              selectedIndex={tabIndex}
              onSelect={(tabIndex) => this.setState({ tabIndex })}
            >
              <TabList className="user-select-tabs-list">
                <Tab
                  className="tab"
                  onClick={() => {
                    this.setState({
                      library: {
                        ...library,
                        gubun: 0,
                      },
                    });
                  }}
                >
                  전체
                </Tab>
                <Tab
                  className="tab"
                  onClick={() => {
                    this.setState({
                      library: {
                        ...library,
                        gubun: 1,
                      },
                    });
                  }}
                >
                  특정ID
                </Tab>
              </TabList>

              <TabPanel className="user-entire-panel">
                <p>자료실이 전체 사용자에게 보여집니다.</p>
              </TabPanel>
              <TabPanel className="user-specific-panel">
                <form className="user-input-form" onSubmit={submits.searchUser}>
                  <div className="user-input">
                    <span className="label">검색ID</span>
                    <input
                      type="text"
                      name="userSearch"
                      onChange={inputs.inputUpdate}
                      value={userSearch}
                      placeholder="검색ID를 입력하세요"
                    />
                    <button className="search-btn"></button>
                    <div
                      className={
                        userList.length === 0
                          ? "select-all wait"
                          : "select-all active"
                      }
                      onClick={userList.length === 0 ? null : inputs.selectAll}
                    >
                      전체선택
                    </div>
                  </div>
                </form>

                <div className="table">
                  <div className={errorSearch ? "error active" : "error"}>
                    검색된 데이터가 없습니다.
                  </div>
                  <BootstrapTable
                    wrapperClasses="user-list-table"
                    keyField="logid"
                    data={userList}
                    columns={columns}
                    rowEvents={this.rowEvents}
                  />

                  <div className="selected-users">
                    <p className="selected-label">선택된 특정ID</p>
                    {libraryauth.length !== 0 ? (
                      <ul>
                        {libraryauth.map((list, index) => {
                          return (
                            <li key={index}>
                              <span className="logid">{list.logid}</span>
                              <span className="cvnas">{list.cvnas}</span>
                              <span
                                className="del-btn"
                                onClick={inputs.deleteSelected}
                              ></span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="none">추가된 사용자가 없습니다.</p>
                    )}
                  </div>
                  <div
                    className={
                      libraryauth.length === 0
                        ? "deselect-all wait"
                        : "deselect-all active"
                    }
                    onClick={inputs.deselectAll}
                  >
                    전체삭제
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}

export default TextEditor;
