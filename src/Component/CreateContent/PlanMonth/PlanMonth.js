import React from "react";
import InnerLoading from "../../InnerLoading";
import { postApi } from "../../../api";
import BootstrapTable from "react-bootstrap-table-next";
import "../PlanYear/PlanYear.scss";

export default class extends React.Component {
  state = {
    regexp: /^[0-9\b]+$/,
    searchkeyword: "",
    date: "",
    monthplan: [],
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
        dataField: "qty_m0",
        text: "이번 달",
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
      {
        dataField: "qty_m1",
        text: "-",
        sort: true,
      },
      {
        dataField: "qty_m2",
        text: "-",
        sort: true,
      },
    ],
    errorSearch: true,
    InnerLoading: true,
  };

  inputs = {
    // 인풋 업데이트 메소드
    update: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    },

    numUpdate: (e) => {
      const num = e.target.value;
      if (num === "" || this.state.regexp.test(num)) {
        this.setState({
          date: num,
        });
      }
    },

    // 이전달 버튼 이벤트
    prevYear: () => {
      this.inputs.converter("prev");
      const { date } = this.state;
      let nDate = date.replace("-", "");
      const data = {
        date: nDate,
        cvcod: this.state.cvcod,
        searchkeyword: this.state.searchkeyword,
      };
      this.submit(data);
    },

    // 다음달 버튼 이벤트
    nextYear: () => {
      this.inputs.converter("next");
      const { date } = this.state;
      let nDate = date.replace("-", "");
      const data = {
        date: nDate,
        cvcod: this.state.cvcod,
        searchkeyword: this.state.searchkeyword,
      };
      this.submit(data);
    },

    // 날짜 처리 메소드
    converter: (btn) => {
      let { date } = this.state;
      let cMonth;
      if (date.includes("-")) {
        date = date.replace("-", "");
      }
      const year = date.substring(0, 4);
      let month = date.substring(4, 6);
      const nDate = new Date(year, month);
      if (btn === "prev") {
        cMonth = nDate.setMonth(nDate.getMonth() - 1);
      } else if (btn === "next") {
        cMonth = nDate.setMonth(nDate.getMonth());
      }
      const sDate = new Date(cMonth);
      let nYear = sDate.getFullYear();
      let nMonth = sDate.getMonth() + 1;
      if (btn === "prev") {
        nMonth -= 1;
        if (nMonth === 0) {
          nMonth = 12;
        }
      }
      nMonth = nMonth.toString().length === 1 ? "0" + nMonth : nMonth;
      const resultDate = `${nYear}-${nMonth}`;
      this.setState({
        date: resultDate,
      });
    },
  };

  // 섭밋 함수
  submit = async (data) => {
    this.setState({
      innerLoading: true,
    });
    try {
      await postApi("scm/purchaseplan/monthplan", data).then((res) => {
        console.log(res);
        const {
          data: {
            data: { monthplan },
          },
        } = res;
        this.setState({
          monthplan,
          innerLoading: false,
          errorSearch: false,
        });
      });
    } catch (error) {
      alert(error);
      this.setState({
        innerLoading: false,
      });
    } finally {
      this.setState({
        innerLoading: false,
      });
    }
  };

  // 키워드 검색 처리 함수
  search = (e) => {
    e.preventDefault();
    const { date, cvcod, searchkeyword } = this.state;
    const data = {
      date,
      cvcod,
      searchkeyword,
    };
    this.submit(data);
  };

  // 최초 진입시 당월로 검색 섭밋
  componentDidMount() {
    const newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    const date = `${year}-${month}`;

    this.setState(
      {
        date,
        cvcod: this.props.user.userinfo.cvcod,
      },
      () => {
        const { date } = this.state;
        const monthdate = date.replace("-", "");

        const data = {
          date: monthdate,
          cvcod: this.state.cvcod,
          searchkeyword: "",
        };
        this.submit(data);
      }
    );
  }

  render() {
    const {
      monthplan,
      columns,
      errorSearch,
      innerLoading,
      date,
      searchkeyword,
    } = this.state;
    const inputs = this.inputs;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component plan-month">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.submit();
              }}
            >
              <span className="label">계획년월</span>
              <div className="year-box">
                <span
                  className="year-btn prev-btn"
                  onClick={inputs.prevYear}
                ></span>
                <input
                  type="num"
                  name="date"
                  value={date}
                  className="year month"
                  onChange={inputs.numUpdate}
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
                value={searchkeyword}
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
              keyField="id"
              data={monthplan}
              columns={columns}
            />
          </div>
        </div>
      </>
    );
  }
}
