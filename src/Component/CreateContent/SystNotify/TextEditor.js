import React from "react";
import "../../../globals";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BootstrapTable from "react-bootstrap-table-next";
import ReactSummernote from "react-summernote";
import DatePicker from "react-date-picker";
import Dropzone from "react-dropzone";
import axios from "axios";
import "react-dropzone-uploader/dist/styles.css";
import "react-summernote/dist/react-summernote.css";
import "react-summernote/lang/summernote-ko-KR";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import Loading from "../../Loading";
import { postApi, getApi } from "../../../api";
import "./SystNotify.scss";

class TextEditor extends React.Component {
  state = {
    userSearch: "",
    userList: [],
    checkedList: [],
    columns: [
      {
        dataField: "logid",
        text: "로그인ID",
        sort: true
      },
      {
        dataField: "cvnas",
        text: "사용자명",
        sort: true
      }
    ],
    errorSearch: true,
    notify: {
      crtdat: "",
      mslvl: "",
      gubun: "0",
      title: "",
      logid: this.props.user.logid,
      bdata: ""
    }
  };

  onImageUpload = fileList => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ReactSummernote.insertImage(reader.result);
    };
    reader.readAsDataURL(fileList[0]);
  };

  inputs = {
    inputUpdate: e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    },

    inputNotice: e => {
      const { notify } = this.state;
      this.setState({
        notify: {
          ...notify,
          [e.target.name]: e.target.value
        }
      });
    },

    deleteSelected: e => {
      const { checkedList } = this.state;
      const btn = e.currentTarget;
      const logidSpan = btn.previousElementSibling.previousElementSibling;
      const logid = logidSpan.innerHTML;
      const result = checkedList.filter(list => list.logid !== logid);
      this.setState({
        checkedList: result
      });
    },

    selectAll: () => {
      const { userList, checkedList } = this.state;
      const result = checkedList
        .filter(list => !userList.includes(list))
        .concat(userList.filter(list => !checkedList.includes(list)));
      this.setState({
        checkedList: [...checkedList, ...result]
      });
    },

    deselectAll: () => {
      this.setState({
        checkedList: []
      });
    }
  };

  notice = {
    // specify upload params and url for your files
    getUploadParams: ({ meta }) => {
      return { url: "https://httpbin.org/post" };
    },

    // called every time a file's `status` changes
    handleChangeStatus: ({ meta, file }, status) => {
      console.log(status, meta, file);
    },

    // receives array of files that are done uploading when submit button is clicked
    handleSubmit: (files, allFiles) => {
      console.log(files.map(f => f.meta));
      allFiles.forEach(f => f.remove());
    }
  };

  submits = {
    searchUser: async e => {
      e.preventDefault();
      const { userSearch } = this.state;
      const data = {
        searchKeyword: userSearch
      };
      this.setState({
        userList: []
      });
      await postApi("admin/um/searchusers", data).then(res => {
        const {
          data: { data }
        } = res;
        if (data.length === 0) {
          this.setState({
            userList: [],
            errorSearch: true
          });
        } else {
          const result = data.map((data, index) => {
            const list = {
              id: index,
              logid: data.logid,
              cvnas: data.cvnas
            };
            return list;
          });
          this.setState({
            userList: result,
            errorSearch: false
          });
        }
      });
    },

    saveNotice: async e => {
      e.preventDefault();
      const { notify } = this.state;
      const jsonNotify = JSON.stringify(notify);
      const token = sessionStorage.getItem("token");
      const config = {
        "Content-Type": "multipart/form-data",
        Authorization: token
      };
      let formData = new FormData();
      formData.append("notify", jsonNotify);
      await axios
        .post(
          "http://192.168.75.104:8080/admin/notify/insertnotice",
          formData,
          { headers: config }
        )
        .then(res => console.log(res));
    }
  };

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      const { checkedList } = this.state;

      if (checkedList.length === 0) {
        this.setState({
          checkedList: [row]
        });
      } else {
        let result;
        for (let i in checkedList) {
          if (!checkedList.includes(row)) {
            result = row;
          } else {
            result = null;
          }
        }

        if (result !== null) {
          this.setState({
            checkedList: [...checkedList, result]
          });
        }
      }
    }
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
        crtdat: fulldate
      }
    });
  };

  componentDidMount() {
    this.formatDate();
  }

  render() {
    const {
      userList,
      columns,
      checkedList,
      userSearch,
      errorSearch,
      notify
    } = this.state;
    const notice = this.notice;
    const submits = this.submits;
    const inputs = this.inputs;

    return (
      <>
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
                height: 380,
                dialogsInBody: true,
                spellCheck: false,
                disableDragAndDrop: true,
                toolbar: [
                  ["style", ["style"]],
                  ["font", ["bold", "underline", "clear", "fontsize", "color"]],
                  ["para", ["ul", "ol", "paragraph"]],
                  ["table", ["table"]],
                  ["insert", ["link", "picture", "video"]]
                ]
              }}
              onImageUpload={this.onImageUpload}
              onChange={content => {
                const { notify } = this.state;
                this.setState({
                  notify: {
                    ...notify,
                    bdata: content
                  }
                });
              }}
            />
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <button className="save">저장</button>
        </form>
        <div className="user-select-section">
          <div className="user-selection">
            <Tabs className="user-select-tabs">
              <TabList className="user-select-tabs-list">
                <Tab
                  className="tab"
                  onClick={() => {
                    this.setState({
                      notify: {
                        ...notify,
                        gubun: 0
                      }
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
                        gubun: 1
                      }
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
                    {checkedList.length !== 0 ? (
                      <ul>
                        {checkedList.map((list, index) => {
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
                      checkedList.length === 0
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
