import React from "react";
import "../../../globals";
import ReactSummernote from "react-summernote";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
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
  onImageUpload = fileList => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ReactSummernote.insertImage(reader.result);
    };
    reader.readAsDataURL(fileList[0]);
  };

  render() {
    console.log(this.props.user);
    return (
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

        <ReactSummernote
          value=""
          options={{
            lang: "ko-KR",
            height: 380,
            dialogsInBody: true,
            spellCheck: false,
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
        <Dropzone />
      </form>
    );
  }
}

export default TextEditor;
