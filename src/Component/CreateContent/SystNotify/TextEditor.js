import React from "react";
import "../../../globals";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BootstrapTable from "react-bootstrap-table-next";
import ReactSummernote from "react-summernote";
import DatePicker from "react-date-picker";
import Dropzone from "react-dropzone";
import axios from "axios";
import "react-summernote/dist/react-summernote.css";
import "react-summernote/lang/summernote-ko-KR";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import InnerLoading from "../../InnerLoading";
import { postApi } from "../../../api";
import "./SystNotify.scss";

class TextEditor extends React.Component {
  state = {
    innerLoading: false,
    userSearch: "",
    userList: [],
    notifyauth: [],
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
    notify: {
      crtdat: "",
      mslvl: "",
      gubun: "0",
      title: "",
      logid: this.props.user.logid,
      bdata: "",
    },
    file: [],
    tabIndex: 0,
    notifyfilelist: [],
    deleteList: [],
  };

  init = () => {
    this.setState({
      notify: {
        crtdat: "",
        mslvl: "",
        gubun: "0",
        title: "",
        logid: this.props.user.logid,
        bdata: "",
      },
      file: [],
      tabIndex: 0,
      notifyauth: [],
      notifyfilelist: [],
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
    delFile: (e) => {
      const { file } = this.state;
      const toDelFile = file.filter((file) => file.name !== e.currentTarget.id);
      this.setState({
        file: toDelFile,
      });
    },

    deleteFile: (e) => {
      const { notifyfilelist, deleteList } = this.state;
      const toDelFile = notifyfilelist.filter(
        (file) => file.stored_file_name !== e.currentTarget.id
      );
      const delFile = notifyfilelist.filter(
        (file) => file.stored_file_name === e.currentTarget.id
      );
      const delStored = delFile.map((file) => file.stored_file_name);
      this.setState({
        notifyfilelist: toDelFile,
        deleteList: [...deleteList, ...delStored],
      });
    },

    inputUpdate: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    },

    inputNotice: (e) => {
      const { notify } = this.state;
      this.setState({
        notify: {
          ...notify,
          [e.target.name]: e.target.value,
        },
      });
    },

    deleteSelected: (e) => {
      const { notifyauth } = this.state;
      const btn = e.currentTarget;
      const logidSpan = btn.previousElementSibling.previousElementSibling;
      const logid = logidSpan.innerHTML;
      const result = notifyauth.filter((list) => list.logid !== logid);
      this.setState({
        notifyauth: result,
      });
    },

    selectAll: () => {
      const { userList, notifyauth } = this.state;

      const jsonAuth = notifyauth.map((list) => JSON.stringify(list));
      const jsonUser = userList.map((list) => JSON.stringify(list));
      const remain = jsonAuth
        .filter((list) => !jsonUser.includes(list))
        .concat(jsonUser.filter((list) => !jsonAuth.includes(list)));
      const authResult = remain.map((remain) => JSON.parse(remain));
      this.setState({
        notifyauth: [...notifyauth, ...authResult],
      });
    },

    deselectAll: () => {
      this.setState({
        notifyauth: [],
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

    deleteNotice: async (e) => {
      e.preventDefault();
      const {
        editData: { notifydetail },
      } = this.props;
      await postApi(`admin/notify/deletenotice/${notifydetail.seqno}`, {}).then(
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

    saveNotice: async (e) => {
      e.preventDefault();
      this.setState({
        innerLoading: true,
      });
      const { notify, notifyauth, file, deleteList } = this.state;
      let formData = new FormData();
      if (this.props.editMode) {
        delete notify.crtdat;
        delete notify.logid;
        if (deleteList.length > 0) {
          const jsonDeleteList = JSON.stringify(deleteList);
          formData.append("deletelist", jsonDeleteList);
        }
      } else {
        delete notify.seqno;
      }

      const jsonNotify = JSON.stringify(notify);
      const token = sessionStorage.getItem("token");
      const config = {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      };

      formData.append("notify", jsonNotify);

      if (notify.gubun === 1) {
        const users = notifyauth.map((list) => list.logid);
        const jsonAuth = JSON.stringify(users);
        formData.append("notifyauth", jsonAuth);
      }

      if (file.length > 0) {
        for (let i in file) {
          formData.append("file", file[i]);
        }
      }

      if (!this.props.editMode) {
        await axios
          .post(
            "http://125.141.30.222:8757/admin/notify/insertnotice",
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
            "http://125.141.30.222:8757/admin/notify/modifynotice",
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
      }
    },
  };

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      const { notifyauth } = this.state;

      if (notifyauth.length === 0) {
        this.setState({
          notifyauth: [row],
        });
      } else {
        let result;
        for (let i in notifyauth) {
          if (!notifyauth.includes(row)) {
            result = row;
          } else {
            result = null;
          }
        }

        if (result !== null) {
          this.setState({
            notifyauth: [...notifyauth, result],
          });
        }
      }
    },
  };

  formatDate = () => {
    const { notify } = this.state;
    const date = new Date();
    const yearNum = date.getFullYear();
    let monthNum = date.getMonth() + 1;
    let dayNum = date.getDate();
    let year = yearNum.toString();
    let month = monthNum.toString();
    let day = dayNum.toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    if (day.length === 1) {
      day = "0" + day;
    }
    const fulldate = `${year}${month}${day}`;
    this.setState({
      notify: {
        ...notify,
        crtdat: fulldate,
      },
    });
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
        editData: { notifydetail, notifyauth, notifyfilelist },
      } = this.props;
      this.setState({
        notify: {
          crtdat: notifydetail.crtdat,
          mslvl: notifydetail.mslvl.toString(),
          gubun: notifydetail.gubun,
          title: notifydetail.title,
          logid: this.props.user.logid,
          bdata: notifydetail.bdata,
          seqno: notifydetail.seqno,
        },
        notifyfilelist: [],
      });
      if (notifyfilelist) {
        this.setState({
          notifyfilelist,
        });
      }

      if (notifydetail.gubun === 1) {
        this.setState({
          notifyauth,
          tabIndex: 1,
        });
      }
    } else {
      this.setState({
        notify: {
          crtdat: "",
          mslvl: "",
          gubun: "0",
          title: "",
          logid: this.props.user.logid,
          bdata: "",
        },
        file: [],
        tabIndex: 0,
        notifyauth: [],
      });
      this.formatDate();
    }
  }

  render() {
    const {
      userList,
      columns,
      notifyauth,
      userSearch,
      errorSearch,
      notify,
      file,
      tabIndex,
      notifyfilelist,
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
        <form onSubmit={submits.saveNotice}>
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
              <div className="user-info">
                <span className="label">사용자명</span>
                <span className="info-cvnas">{this.props.user.cvnas}</span>
              </div>
              <span className="label calendar">등록일자</span>
              <DatePicker
                value={new Date()}
                calendarIcon={null}
                clearIcon={null}
                disabled
                locale={"ko-KR"}
              />
              <div className="radio-section">
                <div className="radio">
                  <input
                    type="radio"
                    name="mslvl"
                    id="normal"
                    value="0"
                    checked={notify.mslvl === "0"}
                    onChange={inputs.inputNotice}
                    required
                  />
                  <label htmlFor="normal">일반</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    name="mslvl"
                    id="admin"
                    value="1"
                    checked={notify.mslvl === "1"}
                    onChange={inputs.inputNotice}
                    required
                  />
                  <label htmlFor="admin">중요</label>
                </div>
              </div>
            </div>

            <span className="textedit-label">제목</span>
            <input
              placeholder="제목을 입력해 주세요"
              className="textedit-title"
              type="text"
              name="title"
              onChange={inputs.inputNotice}
              value={notify.title}
              required
              autoComplete="false"
            />
          </div>

          <div className="notice-editor">
            <ReactSummernote
              value={notify.bdata}
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
                const { notify } = this.state;
                this.setState({
                  notify: {
                    ...notify,
                    bdata: content,
                  },
                });
              }}
            />
            {this.props.editMode && notifyfilelist.length > 0 ? (
              <>
                <div className="modify-file-section">
                  <span className="file-label">기존 업로드 파일</span>
                  <ul className="modify-list">
                    {notifyfilelist.map((list, index) => (
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
            <button className="save delete" onClick={submits.deleteNotice}>
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
                      notify: {
                        ...notify,
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
                      notify: {
                        ...notify,
                        gubun: 1,
                      },
                    });
                  }}
                >
                  특정ID
                </Tab>
              </TabList>

              <TabPanel className="user-entire-panel">
                <p>공지사항이 전체 사용자에게 보여집니다.</p>
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
                    keyField="id"
                    data={userList}
                    columns={columns}
                    rowEvents={this.rowEvents}
                  />

                  <div className="selected-users">
                    <p className="selected-label">선택된 특정ID</p>
                    {notifyauth.length !== 0 ? (
                      <ul>
                        {notifyauth.map((list, index) => {
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
                      notifyauth.length === 0
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
