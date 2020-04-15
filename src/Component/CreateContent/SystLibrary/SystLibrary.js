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
import "../SystNotify/SystNotify.scss";

export default class extends React.Component {
  state = {
    loading: false,
    typing: false,
    typingTimeout: 0,
    stdat: "",
    eddat: "",
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
        dataField: "stdat",
        text: "시작일자",
        sort: true,
      },
      {
        dataField: "eddat",
        text: "종료일자",
        sort: true,
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
    libraryList: [],
    userList: {
      visible: false,
      list: [],
    },
    title: "",
    userId: "",
    cvnas: "",
    errorSearch: true,
    listMode: true,
    editData: {},
    editMode: false,
    isMast: true,
  };

  inputs = {
    liveResult: (result) => {
      this.setState({
        userId: result,
      });
    },
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
    const eddat = date.setDate(date.getDate());
    const stdat = date.setDate(date.getDate() - 60);
    this.setState({
      stdat,
      eddat,
    });
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

  stDatChange = (date) => {
    this.setState({
      stdat: date,
    });
  };

  edDatChange = (date) => {
    this.setState({
      eddat: date,
    });
  };

  submits = {
    formatDate: (date) => {
      const toDate = new Date(date);
      const yearNum = toDate.getFullYear();
      let monthNum = toDate.getMonth() + 1;
      let dayNum = toDate.getDate();
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
      const { userId, stdat, eddat } = this.state;
      const fromdate = this.submits.formatDate(stdat);
      const todate = this.submits.formatDate(eddat);
      const searchoption = {
        searchoption: {
          logid: userId,
          fromdate,
          todate,
        },
      };
      await postApi("admin/library/libraryList", searchoption).then((res) => {
        const {
          data: {
            data: { libraryList },
          },
        } = res;
        console.log(res);
        const modifyDate = libraryList.map((list) => {
          const crtyear = list.crtdat.substring(0, 4);
          const crtmonth = list.crtdat.substring(4, 6);
          const crtday = list.crtdat.substring(6, 8);
          const crtdate = `${crtyear}-${crtmonth}-${crtday}`;
          list.crtdat = crtdate;
          const styear = list.stdat.substring(0, 4);
          const stmonth = list.stdat.substring(4, 6);
          const stday = list.stdat.substring(6, 8);
          const stdate = `${styear}-${stmonth}-${stday}`;
          list.stdat = stdate;
          const edyear = list.eddat.substring(0, 4);
          const edmonth = list.eddat.substring(4, 6);
          const edday = list.eddat.substring(6, 8);
          const eddate = `${edyear}-${edmonth}-${edday}`;
          list.eddat = eddate;
          return list;
        });
        if (libraryList.length === 0) {
          this.setState({
            errorSearch: true,
            libraryList: [],
          });
        } else {
          this.setState({
            libraryList: libraryList,
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
      await postApi(`admin/library/getlibrary/${row.seqno}`, {}).then((res) => {
        const {
          data: { data },
        } = res;
        this.setState({
          editData: data,
          editMode: true,
          listMode: false,
        });
      });
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

    console.log("mount", userinfo);

    this.setState({
      userId: userinfo.logid,
      cvnas: userinfo.cvnas,
    });
  }

  render() {
    const {
      loading,
      libraryList,
      columns,
      errorSearch,
      listMode,
      editData,
      editMode,
      stdat,
      eddat,
      isMast,
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
                        selected={stdat}
                        dateFormat="yyyy-MM-dd"
                        onChange={this.stDatChange}
                      />
                      <span className="date-divider">~</span>
                      <DatePicker
                        selected={eddat}
                        dateFormat="yyyy-MM-dd"
                        onChange={this.edDatChange}
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
                      data={libraryList}
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
