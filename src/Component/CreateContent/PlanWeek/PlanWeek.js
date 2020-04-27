import React from "react";
import Loading from "../../Loading";
import { postApi } from "../../../api";
import { formatDate, addCommas } from "../common/Common";
import BootstrapTable from "react-bootstrap-table-next";
import DatePicker from "react-datepicker";
import InnerLoading from "../../InnerLoading";
import "./PlanWeek.scss";

export default class extends React.Component {
  state = {
    loading: false,
    weekplan: [],
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
    searchkeyword: "",
    date: new Date(),
  };

  setDate = (date) => {
    this.setState({
      date,
    });
  };

  submit = async () => {
    this.setState({
      innerLoading: true,
    });
    const { date, searchkeyword } = this.state;
    const resDate = formatDate(date);
    const data = {
      date: resDate,
      cvcod: this.state.cvcod,
      searchkeyword,
    };
    await postApi("scm/purchaseplan/weekplan", data).then((res) => {
      const {
        data: {
          data: { weekplan },
        },
      } = res;
      console.log(weekplan);
      this.setState({
        weekplan,
        innerLoading: false,
        errorSearch: false,
      });
    });
  };

  componentDidUpdate = (prev, state) => {
    if (state.date !== this.state.date) {
      this.submit();
    }
  };

  componentDidMount = () => {
    this.setState({
      cvcod: this.props.user.userinfo.cvcod,
      innerLoading: true,
    });
    this.submit();
  };

  render() {
    const { weekplan, columns, errorSearch, innerLoading, date } = this.state;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component plan-week">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onSubmit={this.userSearch}>
              <span className="label">계획일자</span>
              <DatePicker
                selected={date}
                onChange={this.setDate}
                dateFormat="yyyy/MM/dd"
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
              keyField="rowseq"
              data={weekplan}
              columns={columns}
            />
          </div>
        </div>
      </>
    );
  }
}
