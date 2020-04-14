import React from "react";
import InnerLoading from "../../InnerLoading";
import { postApi } from "../../../api";
import BootstrapTable from "react-bootstrap-table-next";
import "./PlanYear.scss";

export default class extends React.Component {
  state = {
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

  inputs = {
    update: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    },

    prevYear: () => {
      this.setState(
        {
          year: this.state.year - 1,
        },
        () => {
          const data = {
            year: this.state.year,
            cvcod: this.props.user.userinfo.cvcod,
            searchkeyword: this.state.searchkeyword,
          };
          this.submit(data);
        }
      );
    },

    nextYear: () => {
      this.setState(
        {
          year: this.state.year + 1,
        },
        () => {
          const data = {
            year: this.state.year,
            cvcod: this.props.user.userinfo.cvcod,
            searchkeyword: this.state.searchkeyword,
          };
          this.submit(data);
        }
      );
    },
  };

  submit = async (data) => {
    this.setState({
      innerLoading: true,
    });
    await postApi("scm/purchaseplan/yearplan", data).then((res) => {
      const {
        data: {
          data: { yearplan },
        },
      } = res;
      if (yearplan.length !== 0) {
        this.setState({
          yearplan,
          innerLoading: false,
          errorSearch: false,
        });
      } else {
        this.setState({
          yearplan: [],
          errorSearch: true,
        });
      }
    });
  };

  search = (e) => {
    e.preventDefault();
    const { year, cvcod, searchkeyword } = this.state;
    const data = {
      year,
      cvcod,
      searchkeyword,
    };
    this.submit(data);
  };

  componentDidMount() {
    const date = new Date();
    const year = date.getFullYear();

    this.setState(
      {
        year,
        cvcod: this.props.user.userinfo.cvcod,
      },
      () => {
        const data = {
          year: this.state.year,
          cvcod: this.state.cvcod,
          searchkeyword: "",
        };
        this.submit(data);
      }
    );
  }

  render() {
    const { yearplan, columns, errorSearch, innerLoading, year } = this.state;
    const inputs = this.inputs;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component plan-year">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onSubmit={this.search}>
              <span className="label">계획년도</span>
              <div className="year-box">
                <span
                  className="year-btn prev-btn"
                  onClick={inputs.prevYear}
                ></span>
                <input
                  type="num"
                  name="year"
                  value={year}
                  className="year"
                  onChange={inputs.update}
                />
                <span
                  className="year-btn next-btn"
                  onClick={inputs.nextYear}
                ></span>
              </div>
              <span className="label ml">검색어</span>
              <input
                name="searchkeyword"
                placeholder="검색어를 입력하세요"
                className="user-search main-search"
                type="text"
                onChange={inputs.update}
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
              data={yearplan}
              columns={columns}
            />
          </div>
        </div>
      </>
    );
  }
}
