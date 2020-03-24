import React from "react";
import "../../../globals";
import ReactSummernote from "react-summernote";
import DatePicker from "react-date-picker";
import Dropzone from "react-dropzone-uploader";
import "react-summernote/dist/react-summernote.css";
import "react-summernote/lang/summernote-ko-KR";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import Loading from "../../Loading";
import { postApi, getApi } from "../../../api";
import "./SystNotify.scss";

export default class extends React.Component {
  state = {
    loading: false,
    date: "",
    title: ""
  };

  getDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 60);
    this.setState({
      date
    });
  };

  onImageUpload = fileList => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ReactSummernote.insertImage(reader.result);
    };
    reader.readAsDataURL(fileList[0]);
  };

  onChange = date => this.setState({ date });

  componentDidMount() {
    this.getDate();
  }

  render() {
    const { loading } = this.state;
    const {
      user: { userinfo }
    } = this.props;
    return (
      <>
        <div className="content-component notify data-room">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <div className="notify-header">
                <span className="label">로그인ID</span>
                <span>{userinfo.logid}</span>
                <span className="label">사용자명</span>
                <span>{userinfo.cvnas}</span>
                <span className="label">등록일자</span>
                <DatePicker
                  onChange={this.onChange}
                  value={this.state.date}
                  calendarIcon={null}
                  clearIcon={null}
                  locale={"ko-KR"}
                />
                <span className="divider">~</span>
                <DatePicker
                  value={new Date()}
                  calendarIcon={null}
                  clearIcon={null}
                  locale={"ko-KR"}
                  disabled
                />
              </div>
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
                    [
                      "font",
                      ["bold", "underline", "clear", "fontsize", "color"]
                    ],
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
          )}
        </div>
      </>
    );
  }
}
