import React from "react";
import "../../../globals";
import edit from "../../../assets/img/edit.svg";
import search from "../../../assets/img/search-blue.svg";
import LiveSearch from "../common/LiveSeach";
import BootstrapTable from "react-bootstrap-table-next";
import DatePicker from "react-datepicker";
import TextEditor from "./TextEditor";
import Loading from "../../Loading";
import { postApi, getApi } from "../../../api";
import "./SystNotify.scss";

export default class extends React.Component {
  state = {
    loading: false,
    typing: false,
    typingTimeout: 0,
    fromDate: "",
    toData: "",
    columns: [
      {
        dataField: "seqno",
        text: "번호",
        sort: true,
      },
      {
        dataField: "crtdat",
        text: "등록일자",
        sort: true,
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
          1: "중요",
        },
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
          1: "특정ID",
        },
      },
      {
        dataField: "title",
        text: "제목",
        sort: true,
        classes: "notice-title",
        headerClasses: "notice-title notice-title-header",
      },
      {
        dataField: "logid",
        text: "등록자명",
        sort: true,
      },
    ],
    noticeList: [],
    title: "",
    userId: "",
    cvnas: "",
    errorSearch: true,
    listMode: true,
    editData: {},
    editMode: false,
  };

  changeMode = () => {
    this.setState({
      listMode: !this.state.listMode,
      editMode: false,
    });
    this.submits.searchList();
  };

  getDate = () => {
    const date = new Date();
    const toDate = date.setDate(date.getDate());
    const fromDate = date.setDate(date.getDate() - 60);
    this.setState({
      toDate,
      fromDate,
    });
  };

  inputs = {
    liveResult: (result) => {
      this.setState({
        userId: result,
      });
    },
  };

  setSearchId = async () => {
    const { userId } = this.state;
    await getApi(`admin/um/user/${userId}`).then((res) => {
      const {
        data: {
          data: { userinfo },
        },
      } = res;

      this.setState({
        userId: userinfo.logid,
        cvnas: userinfo.cvnas,
      });
    });
  };

  submits = {
    formatDate: (date) => {
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

    searchList: async () => {
      const { fromDate, toDate, userId } = this.state;
      const rawFromDate = new Date(fromDate);
      const rawToDate = new Date(toDate);
      const fromdate = this.submits.formatDate(rawFromDate);
      const todate = this.submits.formatDate(rawToDate);
      const searchoption = {
        searchoption: {
          logid: userId,
          fromdate,
          todate,
        },
      };
      await postApi("admin/notify/noticeList", searchoption).then((res) => {
        const {
          data: {
            data: { noticelist },
          },
        } = res;
        const modifyDate = noticelist.map((list) => {
          const year = list.crtdat.substr(0, 4);
          const month = list.crtdat.substr(4, 2);
          const day = list.crtdat.substr(6, 2);
          const date = `${year}-${month}-${day}`;
          list.crtdat = date;
          return list;
        });
        if (noticelist.length === 0) {
          this.setState({
            errorSearch: true,
            noticeList: [],
          });
        } else {
          this.setState({
            noticeList: noticelist,
            errorSearch: false,
          });
        }
      });
    },

    searchOption: async (e) => {
      e.preventDefault();
      this.submits.searchList();
    },
  };

  rowEvents = {
    onClick: async (e, row, rowIndex) => {
      await postApi(`admin/notify/getnoticedetail/${row.seqno}`, {}).then(
        (res) => {
          const {
            data: { data },
          } = res;
          this.setState({
            editData: data,
            editMode: true,
            listMode: false,
          });
        }
      );
    },
  };

  componentDidUpdate(prevProp, prevState) {
    if (this.state.userId !== prevState.userId) {
      this.setSearchId();
    }
  }

  componentDidMount() {
    this.getDate();
    const {
      user: { userinfo },
    } = this.props;

    this.setState({
      userId: userinfo.logid,
      cvnas: userinfo.cvnas,
    });
  }

  render() {
    const {
      loading,
      noticeList,
      columns,
      errorSearch,
      listMode,
      editData,
      editMode,
      isMast,
      fromDate,
      toDate,
    } = this.state;
    const {
      user: { userinfo },
    } = this.props;
    const submits = this.submits;
    const inputs = this.inputs;

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
                      <LiveSearch
                        user={userinfo}
                        isMast={isMast}
                        liveResult={inputs.liveResult}
                      />
                      <div className="user-info">
                        <span>사용자명</span>
                        <span className="info-cvnas">{this.state.cvnas}</span>
                      </div>
                      <span className="label">등록일자</span>
                      <DatePicker
                        selected={fromDate}
                        onChange={this.handleChange}
                        dateFormat="yyyy/MM/dd"
                      />
                      <span className="date-divider">~</span>
                      <DatePicker
                        selected={toDate}
                        onChange={this.handleChange}
                        dateFormat="yyyy/MM/dd"
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
                      rowEvents={this.rowEvents}
                    />
                  </div>
                </>
              ) : (
                <TextEditor
                  user={userinfo}
                  changeMode={this.changeMode}
                  done={this.props.done}
                  error={this.props.error}
                  editData={editData}
                  editMode={editMode}
                />
              )}
            </>
          )}
        </div>
      </>
    );
  }
}
