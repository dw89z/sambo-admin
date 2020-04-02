import React from "react";
import "../../../globals";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BootstrapTable from "react-bootstrap-table-next";
import ReactSummernote from "react-summernote";
import DatePicker from "react-date-picker";
import Dropzone from "react-dropzone-uploader";
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
    userList: [],
    checkedList: [],
    columns: [
      {
        dataField: "seqno",
        text: "로그인ID",
        sort: true
      },
      {
        dataField: "seqno",
        text: "사용자명",
        sort: true
      }
    ]
  };

  onImageUpload = fileList => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ReactSummernote.insertImage(reader.result);
    };
    reader.readAsDataURL(fileList[0]);
  };

  // specify upload params and url for your files
  getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  // receives array of files that are done uploading when submit button is clicked
  handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta));
    allFiles.forEach(f => f.remove());
  };

  render() {
    const { userList, columns, checkedList } = this.state;

    return (
      <>
        <div className="close-btn" onClick={this.props.changeMode}></div>
        <form>
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
            </div>

            <span className="textedit-label">제목</span>
            <input
              className="textedit-title"
              type="text"
              name="title"
              required
              autoComplete="false"
            />
          </div>

          <div className="notice-editor">
            <ReactSummernote
              value=""
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
              onChange={() => console.log()}
            />
            <Dropzone
              getUploadParams={this.getUploadParams}
              onChangeStatus={this.handleChangeStatus}
              onSubmit={this.handleSubmit}
            />
          </div>
        </form>
        <div className="user-select-section">
          <div className="user-selection">
            <Tabs className="user-select-tabs">
              <TabList className="user-select-tabs-list">
                <Tab className="tab">특정ID</Tab>
                <Tab className="tab">전체</Tab>
              </TabList>

              <TabPanel className="user-entire-panel">
                <form className="user-input-form">
                  <div className="user-input">
                    <span className="label">검색ID</span>
                    <input type="text" />
                    <button className="search-btn"></button>
                  </div>
                </form>

                <div className="table">
                  <BootstrapTable
                    wrapperClasses="user-list-table"
                    keyField="seqno"
                    data={userList}
                    columns={columns}
                    selectRow={{
                      mode: "checkbox",
                      clickToSelect: true,
                      selected: this.state.checkedList,
                      onSelect: (row, isSelect, rowIndex, e) => {}
                    }}
                  />
                </div>
              </TabPanel>
              <TabPanel className="user-specific-panel">
                <p>공지사항이 전체 사용자에게 보여집니다.</p>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}

export default TextEditor;
