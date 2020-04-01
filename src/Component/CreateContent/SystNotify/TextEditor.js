import React from "react";
import "../../../globals";
import ReactSummernote from "react-summernote";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import Dropzone from "react-dropzone-uploader";
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
    return (
      <form>
        <div className="submit-section">
          <span className="label">제목</span>
          <input type="text" name="title" required autoComplete="false" />
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
