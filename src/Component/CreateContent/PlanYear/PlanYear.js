import React from "react";
import Loading from "../../Loading";
import InnerLoading from "../../InnerLoading";
import { postApi, getApi } from "../../../api";
import BootstrapTable from "react-bootstrap-table-next";
import "./PlanYear.scss";

export default class extends React.Component {
  state = {
    loading: false,
    year: "",
    cvcod: "",
    searchkeyword: "",
    yearplan: [],
    columns: [
      {
        dataField: "rowseq",
        text: "번호",
        sort: true,
      },
      {
        dataField: "itnbr",
        text: "품번",
        sort: true,
      },
      {
        dataField: "itdsc",
        text: "품명",
        sort: true,
      },
      {
        dataField: "ispec",
        text: "규격",
        sort: true,
      },
      {
        dataField: "qty_sum",
        text: "합계",
        sort: true,
      },
      {
        dataField: "qty_01",
        text: "1월",
        sort: true,
      },
      {
        dataField: "qty_02",
        text: "2월",
        sort: true,
      },
      {
        dataField: "qty_03",
        text: "3월",
        sort: true,
      },
      {
        dataField: "qty_04",
        text: "4월",
        sort: true,
      },
      {
        dataField: "qty_05",
        text: "5월",
        sort: true,
      },
      {
        dataField: "qty_06",
        text: "6월",
        sort: true,
      },
      {
        dataField: "qty_07",
        text: "7월",
        sort: true,
      },
      {
        dataField: "qty_08",
        text: "8월",
        sort: true,
      },
      {
        dataField: "qty_09",
        text: "9월",
        sort: true,
      },
      {
        dataField: "qty_10",
        text: "10월",
        sort: true,
      },
      {
        dataField: "qty_11",
        text: "11월",
        sort: true,
      },
      {
        dataField: "qty_12",
        text: "12월",
        sort: true,
      },
    ],
    errorSearch: true,
    InnerLoading: true,
  };

  componentDidMount() {
    const date = new Date();
    const year = date.getFullYear();

    this.setState(
      {
        year,
        cvcod: this.props.user.userinfo.cvcod,
        innerLoading: true,
      },
      async () => {
        const data = {
          year: this.state.year,
          cvcod: this.state.cvcod,
          searchkeyword: "",
        };
        console.log(data);
        await postApi("scm/purchaseplan/yearplan", data).then((res) => {
          console.log(res);
          const {
            data: {
              data: { yearplan },
            },
          } = res;
          this.setState({
            yearplan,
            innerLoading: false,
            errorSearch: false,
          });
        });
      }
    );
  }

  render() {
    const { yearplan, columns, errorSearch, innerLoading } = this.state;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component plan-year">
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
              data={yearplan}
              columns={columns}
            />
          </div>
        </div>
      </>
    );
  }
}
