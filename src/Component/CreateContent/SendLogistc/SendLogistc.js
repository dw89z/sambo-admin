import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import { postApi, deleteApi } from "../../../api";
import DatePicker from "react-datepicker";
import "./SendLogistc.scss";
import "react-datepicker/dist/react-datepicker.css";

export default class extends React.Component {
  state = {
    date: {
      startDate: new Date(),
      lastDate: new Date(),
    },
    users: [],
    columns: [
      {
        dataField: "logid",
        text: "번호",
        sort: true,
      },
      {
        dataField: "logid",
        text: "선택",
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
        text: "발주수량",
        sort: true,
      },
      {
        dataField: "logid",
        text: "납기예정일",
        sort: true,
      },
      {
        dataField: "logid",
        text: "발주잔량",
        sort: true,
      },
      {
        dataField: "logid",
        text: "사용자재 LOT",
        sort: true,
      },
      {
        dataField: "logid",
        text: "제조 LOT",
        sort: true,
      },
      {
        dataField: "logid",
        text: "납품수량",
        sort: true,
      },
      {
        dataField: "logid",
        text: "4M",
        sort: true,
      },
      {
        dataField: "logid",
        text: "변경일자",
        sort: true,
      },
      {
        dataField: "logid",
        text: "EO.NO",
        sort: true,
      },
      {
        dataField: "logid",
        text: "부품식별표",
        sort: true,
      },
      {
        dataField: "logid",
        text: "용기TYPE",
        sort: true,
      },
      {
        dataField: "logid",
        text: "적입량",
        sort: true,
      },
    ],
    errorSearch: true,
  };

  componentDidMount() {}

  render() {
    const { date, users, columns } = this.state;

    return (
      <>
        <div className="content-component send-logistc">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form>
              <div className="input-divide">
                <div className="input-div">
                  <span className="label mr">납기예정일</span>
                </div>
                <DatePicker
                  selected={date.startDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy/MM/dd"
                />
                <span className="date-divider">~</span>
                <DatePicker
                  selected={date.lastDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy/MM/dd"
                />
                <div className="input-div">
                  <span className="label ml mr-2">협력사</span>
                  <input type="text" />
                  <span className="result-span">협력사 ID</span>
                  <span className="result-span">구분번호</span>
                </div>
              </div>
              <div className="input-divide">
                <div className="input-div">
                  <span className="label">품번/검색어</span>
                  <input type="text" />
                </div>
                <span className="label ml">출발일자</span>
                <DatePicker
                  selected={date.lastDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy/MM/dd"
                />
                <span className="label ml">시작품</span>
                <input type="checkbox" />
              </div>
            </form>
          </div>
          <div className="table">
            <BootstrapTable
              wrapperClasses={
                this.props.menuAxis ? "send-table" : "send-table left"
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
