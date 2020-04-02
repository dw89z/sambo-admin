import React from "react";
import "../../../globals";
import edit from "../../../assets/img/edit.svg";
import search from "../../../assets/img/search-blue.svg";
import BootstrapTable from "react-bootstrap-table-next";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import TextEditor from "./TextEditor";
import Loading from "../../Loading";
import { postApi, getApi } from "../../../api";
import "./SystNotify.scss";

export default class extends React.Component {
  state = {
    loading: false,
    typing: false,
    typingTimeout: 0,
    date: [],
    columns: [
      {
        dataField: "seqno",
        text: "번호",
        sort: true
      },
      {
        dataField: "crtdat",
        text: "등록일자",
        sort: true
      },
      {
        dataField: "mslvl",
        text: "메시지구분",
        sort: true,
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return <span>{formatExtraData[cell]}</span>;
        },
        formatExtraData: {
          0: "일반",
          1: "중요"
        }
      },
      {
        dataField: "gubun",
        text: "전달구분",
        sort: true,
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return <span>{formatExtraData[cell]}</span>;
        },
        formatExtraData: {
          0: "전체",
          1: "특정ID"
        }
      },
      {
        dataField: "title",
        text: "제목",
        sort: true,
        classes: "notice-title",
        headerClasses: "notice-title notice-title-header"
      },
      {
        dataField: "logid",
        text: "등록자명",
        sort: true
      }
    ],
    noticeList: [],
    userList: {
      visible: false,
      list: []
    },
    title: "",
    userId: "",
    cvnas: "",
    errorSearch: true,
    listMode: false
  };

  changeMode = () => {
    this.setState({
      listMode: !this.state.listMode
    });
  };

  getDate = () => {
    const date = new Date();
    const today = date.setDate(date.getDate());
    const before = date.setDate(date.getDate() - 60);
    this.setState({
      date: [before, today]
    });
  };

  inputUpdate = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  inputUpdateId = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    const value = e.target.value;

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      typingTimeout: setTimeout(async () => {
        if (value !== "") {
          const userId = {
            searchKeyword: value.trim()
          };
          await postApi("admin/um/searchusers", userId).then(res => {
            const {
              data: { data }
            } = res;
            this.setState({
              userList: {
                visible: true,
                list: data
              }
            });
          });
        } else if (value === "") {
          this.setState({
            userList: {
              visible: false,
              list: []
            }
          });
        }
      }, 300)
    });
  };

  setSearchId = async e => {
    const userId = e.currentTarget.getAttribute("data-logid");
    await getApi(`admin/um/user/${userId}`).then(res => {
      const {
        data: {
          data: { userinfo }
        }
      } = res;

      this.setState({
        userId: userinfo.logid,
        cvnas: userinfo.cvnas,
        userList: {
          visible: false,
          list: []
        }
      });
    });
  };

  onDataChange = date => this.setState({ date });

  submits = {
    formatDate: date => {
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
      return fulldate;
    },

    searchOption: async e => {
      e.preventDefault();
      const { date, userId } = this.state;
      const rawFromDate = new Date(date[0]);
      const rawToDate = new Date(date[1]);
      const fromdate = this.submits.formatDate(rawFromDate);
      const todate = this.submits.formatDate(rawToDate);
      const searchoption = {
        searchoption: {
          logid: userId,
          fromdate,
          todate
        }
      };
      await postApi("admin/notify/noticeList", searchoption).then(res => {
        const {
          data: {
            data: { noticelist }
          }
        } = res;
        const modifyDate = noticelist.map(list => {
          const year = list.crtdat.substr(0, 4);
          const month = list.crtdat.substr(4, 2);
          const day = list.crtdat.substr(6, 2);
          const date = `${year}-${month}-${day}`;
          list.crtdat = date;
          return list;
        });
        if (noticelist.length === 0) {
          console.log("did");
          this.setState({
            errorSearch: true,
            noticeList: []
          });
        } else {
          this.setState({
            noticeList: noticelist,
            errorSearch: false
          });
        }
      });
    }
  };

  componentDidMount() {
    this.getDate();
    const {
      user: { userinfo }
    } = this.props;

    this.setState({
      userId: "system",
      cvnas: userinfo.cvnas
    });
  }

  render() {
    const {
      loading,
      userList,
      noticeList,
      columns,
      errorSearch,
      listMode
    } = this.state;
    const {
      user: { userinfo }
    } = this.props;
    const submits = this.submits;
    return (
      <>
        <div className="content-component notify data-room">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              {listMode ? (
                <>
                  <form onSubmit={submits.searchOption}>
                    <div className="notify-header form">
                      <span className="label">사용자 조회</span>
                      <input
                        name="userId"
                        placeholder="로그인ID로 검색"
                        className="auth-search main-search"
                        type="text"
                        onChange={this.inputUpdateId}
                        value={this.state.userId}
                        onKeyPress={e => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      {userList.visible && userList.list ? (
                        <ul className="user-list">
                          {userList.list.map((list, index) => {
                            return (
                              <li
                                key={index}
                                onClick={this.setSearchId}
                                data-logid={list.logid}
                              >
                                <span>{list.logid}</span>
                                <span>{list.cvnas}</span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                      <div className="user-info">
                        <span>사용자명</span>
                        <span className="info-cvnas">{this.state.cvnas}</span>
                      </div>
                      <span className="label">등록일자</span>
                      <DateRangePicker
                        onChange={this.onDataChange}
                        value={this.state.date}
                        calendarIcon={null}
                        clearIcon={null}
                        required={true}
                        locale={"ko-KR"}
                      />
                      <div className="utils">
                        <button
                          type="submit"
                          className="util-button"
                          onClick={this.openAddMode}
                        >
                          <img src={search} alt="add" />
                          <span>조회</span>
                        </button>
                        <button
                          type="button"
                          className="util-button"
                          onClick={this.changeMode}
                        >
                          <img src={edit} alt="edit" />
                          <span>신규</span>
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="table">
                    <div className={errorSearch ? "error active" : "error"}>
                      검색된 데이터가 없습니다.
                    </div>
                    <BootstrapTable
                      wrapperClasses={
                        this.props.menuAxis
                          ? "notice-table"
                          : "notice-table left"
                      }
                      keyField="seqno"
                      data={noticeList}
                      columns={columns}
                    />
                  </div>
                </>
              ) : (
                <TextEditor user={userinfo} changeMode={this.changeMode} />
              )}
            </>
          )}
        </div>
      </>
    );
  }
}
