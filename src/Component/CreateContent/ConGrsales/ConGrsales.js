import React from "react";
import InnerLoading from "../../InnerLoading";
import LiveSearch from "../common/LiveSeach";
import Chart from "react-apexcharts";
import ko from "apexcharts/dist/locales/ko.json";
import { postApi, getApi } from "../../../api";
import "./ConGrsales.scss";

export default class extends React.Component {
  state = {
    regexp: /^[0-9\b]+$/,
    searchkeyword: "",
    date: "",
    monthplan: [],
    errorSearch: true,
    InnerLoading: true,
    isMast: true,
    cvnas: "",
    logid: "",
    salesChart: {
      series: [
        {
          name: "금액",
          type: "column",
          data: [],
        },
        {
          name: "수량",
          type: "line",
          data: [],
        },
      ],
      options: {
        chart: {
          width: "120%",
          height: 600,
          type: "line",
          defaultLocale: "ko",
          locales: [ko],
          animations: {
            speed: 1500,
          },
          toolbar: {
            offsetY: -25,
          },
        },
        stroke: {
          width: [1, 2],
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: [],
        xaxis: {
          labels: {
            style: {
              fontSize: "10px",
              fontWeight: 700,
            },
          },
        },
        yaxis: [
          {
            labels: {
              minWidth: 70,
              maxWidth: 71,
              formatter: function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
              style: {
                colors: "#d1d1d9",
                fontSize: "10px",
                fontWeight: 700,
              },
            },
          },
          {
            opposite: true,
            labels: {
              minWidth: 70,
              maxWidth: 71,
              formatter: function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
              style: {
                colors: "#d1d1d9",
                fontSize: "10px",
                fontWeight: 700,
              },
            },
          },
        ],
      },
    },
    monthFailChart: {
      series: [
        {
          name: "수량",
          type: "column",
          data: [],
        },
        {
          name: "PPM",
          type: "column",
          data: [],
        },
      ],
      options: {
        chart: {
          width: "120%",
          height: 600,
          defaultLocale: "ko",
          locales: [ko],
          animations: {
            speed: 1500,
          },
          toolbar: {
            offsetY: -25,
          },
        },
        stroke: {
          width: [1, 2],
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: [],
        xaxis: {
          labels: {
            style: {
              fontSize: "10px",
              fontWeight: 700,
            },
          },
        },
        yaxis: [
          {
            labels: {
              minWidth: 70,
              maxWidth: 71,
              offsetX: -5,
              style: {
                colors: "#d1d1d9",
                fontSize: "10px",
                fontWeight: 700,
              },
              formatter: function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
            },
          },
          {
            opposite: true,
            labels: {
              minWidth: 70,
              maxWidth: 71,
              style: {
                colors: "#d1d1d9",
                fontSize: "10px",
                fontWeight: 700,
              },
              formatter: function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
            },
          },
        ],
      },
    },
  };

  inputs = {
    // 인풋 업데이트 메소드
    update: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    },

    liveResult: (result) => {
      this.setState({
        logid: result,
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
    prevYear: async () => {
      await this.inputs.converter("prev");
      const { date } = this.state;
      let nDate = date.replace("-", "");
      const data = {
        date: nDate,
        cvcod: this.state.cvcod,
        searchkeyword: this.state.searchkeyword,
      };
      // this.submit(data);
    },

    // 다음달 버튼 이벤트
    nextYear: async () => {
      await this.inputs.converter("next");
      const { date } = this.state;
      let nDate = date.replace("-", "");
      const data = {
        date: nDate,
        cvcod: this.state.cvcod,
        searchkeyword: this.state.searchkeyword,
      };
      // this.submit(data);
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
          nYear -= 1;
        }
      }
      const fMonth = nMonth.toString().length === 1 ? "0" + nMonth : nMonth;
      const resultDate = `${nYear}-${fMonth}`;
      this.setState({
        date: resultDate,
      });
    },
  };

  componentDidMount = () => {
    const newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    const date = `${year}-${month}`;
    this.setState({
      date,
      cvcod: this.props.user.userinfo.cvcod,
    });
  };

  render() {
    const {
      isMast,
      cvnas,
      errorSearch,
      innerLoading,
      date,
      searchkeyword,
      cvcod,
      monthFailChart,
      salesChart,
    } = this.state;
    const { userinfo } = this.props.user;
    const inputs = this.inputs;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component congrsales">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = {
                  date,
                  cvcod,
                  searchkeyword,
                };
                this.submit(data);
              }}
            >
              <span className="label">기준년월</span>
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
                  onFocus={() => {
                    this.setState({
                      date: "",
                    });
                  }}
                  autoComplete="off"
                />
                <span
                  className="year-btn next-btn"
                  onClick={inputs.nextYear}
                ></span>
              </div>
              <div className="input-div">
                <span className="label ml mr-2">협력사</span>
                <LiveSearch
                  user={userinfo}
                  isMast={isMast}
                  liveResult={inputs.liveResult}
                />
                <span className="result-span">{cvnas}</span>
                <span className="result-span">
                  {userinfo.auth === "0" ? "외주업체" : "구매업체"}
                </span>
              </div>
            </form>
          </div>

          <div className="result-wrapper">
            <div className="left">
              <div className="chart-wrapper">
                <h3>매출 수량 / 금액 추이</h3>
                <Chart
                  options={salesChart.options}
                  series={salesChart.series}
                  width="100%"
                  height="160"
                  className="chart"
                />
              </div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>년월</th>
                      <th>매출수량</th>
                      <th>매출금액</th>
                      <th>반품사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>a</td>
                      <td>aa</td>
                      <td>a</td>
                      <td>a</td>
                      <td>a</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="right">
              <div className="chart-wrapper">
                <h3>불량율(PPM)</h3>
                <Chart
                  options={monthFailChart.options}
                  series={monthFailChart.series}
                  width="100%"
                  height="160"
                  className="chart"
                />
              </div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>년월</th>
                      <th>불량수량</th>
                      <th>불량율</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>a</td>
                      <td>aa</td>
                      <td>a</td>
                      <td>a</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
