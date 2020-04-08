import React from "react";
import Loading from "../../Loading";
import { postApi, getApi } from "../../../api";
import BootstrapTable from "react-bootstrap-table-next";
import "./PlanMonth.scss";

export default class extends React.Component {
  state = {
    loading: false,
    users: [],
    columns: [
      {
        dataField: "logid",
        text: "번호",
        sort: true,
      },
      {
        dataField: "logid",
        text: "품번",
        sort: true,
      },
      {
        dataField: "logid",
        text: "품명",
        sort: true,
      },
      {
        dataField: "logid",
        text: "규격",
        sort: true,
      },
      {
        dataField: "logid",
        text: "합계",
        sort: true,
      },
      {
        dataField: "logid",
        text: "1월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "2월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "3월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "4월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "5월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "6월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "7월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "8월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "9월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "10월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "11월",
        sort: true,
      },
      {
        dataField: "logid",
        text: "12월",
        sort: true,
      },
    ],
    errorSearch: true,
  };

  componentDidMount() {}

  render() {
    const { users, columns, errorSearch } = this.state;
    return (
      <>
        <div className="content-component plan-month">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onSubmit={this.userSearch}>
              <span className="label">계획년도</span>
              <input
                name="userSearch"
                placeholder="로그인ID 및 거래처명으로 검색"
                className="user-search main-search"
                type="text"
                onChange={this.inputUpdate}
              />
              <span className="label ml">검색어</span>
              <input
                name="searchKeyword"
                placeholder="검색어를 입력하세요"
                className="user-search main-search"
                type="text"
                onChange={this.inputUpdate}
              />
              <button className="search-btn"></button>
            </form>
          </div>
          <div className="table">
            <div className={errorSearch ? "error active" : "error"}>
              검색된 데이터가 없습니다
            </div>
            <BootstrapTable
              wrapperClasses={
                this.props.menuAxis ? "year-table" : "year-table left"
              }
              keyField="id"
              data={users}
              columns={columns}
            />
          </div>
        </div>
      </>
    );
  }
}
