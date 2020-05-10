import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Chart from "react-apexcharts";
import ko from "apexcharts/dist/locales/ko.json";
import "./Dashboard.scss";
import { postApi } from "../../../api";
import Loading from "../../Loading";
import Table from "../../Fragments/TableDash";
import BootstrapTable from "react-bootstrap-table-next";

export default class extends React.Component {
  state = {
    loading: true,
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
        colors: ["#273ae6", "#06b4ac"],
        stroke: {
          width: [0, 3],
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
          background: {
            borderRadius: 2,
            borderWidth: 1,
            padding: 6,
          },
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
                colors: "#a1a1a9",
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
                colors: "#a1a1a9",
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
        colors: ["#273ae6", "#f43d6b"],
        stroke: {
          width: [0, 0],
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
          background: {
            borderRadius: 2,
            borderWidth: 1,
            padding: 6,
          },
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
                colors: "#a1a1a9",
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
                colors: "#a1a1a9",
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
    mainSupplyChart: {
      series: [],
      options: {
        chart: {
          width: 380,
          type: "pie",
          animations: {
            easing: "easeinout",
            speed: 2000,
          },
        },
        colors: [
          "#273ae6",
          "#7b88ff",
          "#6c5ce7",
          "#32dbc6",
          "#76b39d",
          "#15cda8",
        ],
        plotOptions: {
          pie: {
            customScale: 0.7,
            dataLabels: {
              offset: -10,
              minAngleToShowLabel: 10,
            },
          },
        },
        labels: [],
      },
    },
    failRateChart: {
      series: [],
      options: {
        chart: {
          height: 300,
          type: "radialBar",
          animations: {
            easing: "easeinout",
            speed: 3500,
          },
        },
        colors: ["#f43d6b"],
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#333",
              startAngle: -90,
              endAngle: 90,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: -1,
                fontSize: "35px",
                show: true,
                fontWeight: "bold",
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            gradientToColors: ["#f76a8c"],
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "butt",
        },
        labels: ["Progress"],
      },
    },
    notice: [],
    dataRoom: [],
    columns: [
      {
        dataField: "crtdat",
        text: "일자",
      },
      {
        dataField: "seqno",
        text: "등록번호",
      },
      {
        dataField: "title",
        text: "제목",
      },
    ],
  };

  sortObject(object) {
    let sorted = {};
    let array = [];

    for (let i in object) {
      if (object.hasOwnProperty(i)) array.push(i);
    }
    array.sort();

    for (let i in array) {
      sorted[array[i]] = object[array[i]];
    }

    return sorted;
  }

  splitUp(array, num) {
    let rest = array.length % num;
    let restUsed = rest;
    let partLength = Math.floor(array.length / num);
    let result = [];

    for (let i = 0; i < array.length; i += partLength) {
      let end = partLength + i,
        add = false;

      if (rest !== 0 && restUsed) {
        end++;
        restUsed--;
        add = true;
      }

      result.push(array.slice(i, end));

      if (add) {
        i++;
      }
    }

    return result;
  }

  dateFormatter(array) {
    let newDates = array.map((arr) => {
      let year = arr.slice(2, 4);
      let month = arr.slice(4, 6);
      let dateFormat = `${year}년${month}월`;
      return dateFormat;
    });
    return newDates;
  }

  dateFormat(array) {
    let newDates = array.map((arr) => {
      const year = arr.crtdat.substr(0, 4);
      const month = arr.crtdat.substr(4, 2);
      const day = arr.crtdat.substr(6, 2);
      const date = `${year}-${month}-${day}`;
      arr.crtdat = date;
      return arr;
    });
    return newDates;
  }

  modifyChartData(data, num) {
    let sorted = this.sortObject(data);
    let values = Object.values(sorted);
    let splitValues = this.splitUp(values, num);
    return splitValues;
  }

  async componentDidMount() {
    try {
      await postApi("main/maincomp").then((res) => {
        const {
          monthlyFailureRate,
          mainSupplyItems,
          dataRoomList,
          failureRate,
          salesQuantityTurnover,
          notisList,
        } = res.data.data;

        const forRoomList = this.dateFormat(dataRoomList);
        const forNoticeList = this.dateFormat(notisList);

        const salesQuantity = this.modifyChartData(salesQuantityTurnover, 3);
        const monthlyFailure = this.modifyChartData(monthlyFailureRate, 3);
        const mainSupply = this.modifyChartData(mainSupplyItems, 2);
        const failRate = Object.values(failureRate);
        const mainInt = mainSupply[0].map((string) => {
          const int = parseInt(string);
          return int;
        });

        const dates = salesQuantity[2];
        const newDates = this.dateFormatter(dates);

        this.setState({
          salesChart: {
            series: [
              { ...this.state.salesChart.series[0], data: salesQuantity[0] },
              { ...this.state.salesChart.series[1], data: salesQuantity[1] },
            ],
            options: {
              ...this.state.salesChart.options,
              labels: newDates,
            },
          },
          monthFailChart: {
            series: [
              {
                ...this.state.monthFailChart.series[0],
                data: monthlyFailure[1],
              },
              {
                ...this.state.monthFailChart.series[1],
                data: monthlyFailure[0],
              },
            ],
            options: {
              ...this.state.monthFailChart.options,
              labels: newDates,
            },
          },
          mainSupplyChart: {
            series: mainInt,
            options: {
              ...this.state.mainSupplyChart.options,
              labels: mainSupply[1],
            },
          },
          failRateChart: {
            series: failRate,
            options: {
              ...this.state.failRateChart.options,
            },
          },
          notice: forNoticeList,
          dataRoom: forRoomList,
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const {
      loading,
      salesChart,
      mainSupplyChart,
      monthFailChart,
      failRateChart,
      dataRoom,
      notice,
    } = this.state;
    return (
      <>
        <div className="content-component dashboard">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="chart-wrapper">
                <div className="chart-inner">
                  <h2>매출 수량 / 금액 추이</h2>
                  <Chart
                    options={salesChart.options}
                    series={salesChart.series}
                    width="100%"
                    height="95%"
                    className="chart"
                  />
                </div>
                <div className="chart-inner bottom">
                  <h2>불량(PPM) 추이</h2>
                  <Chart
                    options={monthFailChart.options}
                    series={monthFailChart.series}
                    width="100%"
                    height="95%"
                    className="chart half"
                  />
                </div>
              </div>
              <div className="chart-wrapper half right">
                <div className="chart-inner half">
                  <h2>주요 납품품목</h2>
                  <Chart
                    options={mainSupplyChart.options}
                    series={mainSupplyChart.series}
                    type="pie"
                    width="100%"
                    height="105%"
                    className="chart half"
                  />
                </div>
                <div className="chart-inner half">
                  <h2>불량률</h2>
                  <Chart
                    options={failRateChart.options}
                    series={failRateChart.series}
                    type="radialBar"
                    width="100%"
                    height="150%"
                    className="chart half"
                  />
                </div>
              </div>
              <Tabs className="chart-wrapper half right bottom dash-table">
                <TabList>
                  <Tab>공지사항</Tab>
                  <Tab>자료실</Tab>
                </TabList>
                <TabPanel className="table-wrapper">
                  <div className="dash-table">
                    <BootstrapTable
                      keyField="seqno"
                      data={notice}
                      columns={this.state.columns}
                    />
                  </div>
                </TabPanel>
                <TabPanel className="table-wrapper">
                  <div className="dash-table">
                    <BootstrapTable
                      keyField="seqno"
                      data={dataRoom}
                      columns={this.state.columns}
                    />
                  </div>
                </TabPanel>
              </Tabs>
            </>
          )}
        </div>
      </>
    );
  }
}
