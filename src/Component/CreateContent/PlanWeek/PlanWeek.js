import React from "react";
import Loading from "../../Loading";
import { postApi, getApi } from "../../../api";
import BootstrapTable from "react-bootstrap-table-next";
import InnerLoading from "../../InnerLoading";
import "./PlanWeek.scss";

export default class extends React.Component {
  state = {
    loading: false,
    weekplan: [],
    d: [],
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
        dataField: "unprc",
        text: "단가",
        sort: true,
      },
      {
        dataField: "qty_sum",
        text: "합계",
        sort: true,
      },
      {
        dataField: "qty_01",
        text: "-",
        sort: true,
      },
      {
        dataField: "qty_02",
        text: "-",
        sort: true,
      },
      {
        dataField: "qty_03",
        text: "-",
        sort: true,
      },
      {
        dataField: "qty_04",
        text: "-",
        sort: true,
      },
      {
        dataField: "qty_05",
        text: "-",
        sort: true,
      },
      {
        dataField: "qty_06",
        text: "-",
        sort: true,
      },
    ],
    errorSearch: true,
  };

  componentDidMount() {
    const date = new Date();
    const year = date.getFullYear();

    this.setState(
      {
        date,
        cvcod: this.props.user.userinfo.cvcod,
        innerLoading: true,
      },
      async () => {
        const data = {
          date: "20170619",
          cvcod: this.state.cvcod,
          searchkeyword: "",
        };
        console.log(data);
        await postApi("scm/purchaseplan/weekplan", data).then((res) => {
          console.log(res);
          const {
            data: {
              data: { weekplan },
            },
          } = res;
          this.setState({
            weekplan,
            innerLoading: false,
            errorSearch: false,
          });
        });
      }
    );
  }

  render() {
    const { d, weekplan, columns, errorSearch, innerLoading } = this.state;
    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component plan-week">
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
              data={weekplan}
              columns={columns}
            />
          </div>
        </div>
      </>
    );
  }
}
