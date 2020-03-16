import React from "react";
import Chart from "react-apexcharts";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ko from "apexcharts/dist/locales/ko.json";
import "./Dashboard.css";
import { postApi } from "../../../api";
import Loading from "../../Loading";
import Table from "../../Fragments/Table";

export default class extends React.Component {
  state = {
    loading: true,
    salesChart: {
      series: [
        {
          name: "금액",
          type: "column",
          data: []
        },
        {
          name: "수량",
          type: "line",
          data: []
        }
      ],
      options: {
        chart: {
          width: "120%",
          height: 600,
          type: "line",
          defaultLocale: "ko",
          locales: [ko],
          animations: {
            speed: 1500
          },
          toolbar: {
            offsetY: -25
          }
        },
        stroke: {
          width: [1, 2]
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: [],
        xaxis: {
          labels: {
            style: {
              fontSize: "10px",
              fontWeight: 700
            }
          }
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
                fontWeight: 700
              }
            }
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
                fontWeight: 700
              }
            }
          }
        ]
      }
    },
    monthFailChart: {
      series: [
        {
          name: "수량",
          type: "column",
          data: []
        },
        {
          name: "PPM",
          type: "column",
          data: []
        }
      ],
      options: {
        chart: {
          width: "120%",
          height: 600,
          defaultLocale: "ko",
          locales: [ko],
          animations: {
            speed: 1500
          },
          toolbar: {
            offsetY: -25
          }
        },
        stroke: {
          width: [1, 2]
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: [],
        xaxis: {
          labels: {
            style: {
              fontSize: "10px",
              fontWeight: 700
            }
          }
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
                fontWeight: 700
              },
              formatter: function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            }
          },
          {
            opposite: true,
            labels: {
              minWidth: 70,
              maxWidth: 71,
              style: {
                colors: "#d1d1d9",
                fontSize: "10px",
                fontWeight: 700
              },
              formatter: function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            }
          }
        ]
      }
    },
    mainSupplyChart: {
      series: [],
      options: {
        chart: {
          width: 380,
          type: "pie",
          animations: {
            easing: "easeinout",
            speed: 2000
          }
        },
        plotOptions: {
          pie: {
            customScale: 0.7
          }
        },
        labels: []
      }
    },
    failRateChart: {
      series: [],
      options: {
        chart: {
          height: 280,
          type: "radialBar",
          animations: {
            easing: "easeinout",
            speed: 3500
          }
        },
        colors: ["#20E647"],
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#333",
              startAngle: -90,
              endAngle: 90
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                fontSize: "30px",
                show: true
              }
            }
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            gradientToColors: ["#87D4F9"],
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: "butt"
        },
        labels: ["Progress"]
      }
    },
    notice: [],
    dataRoom: []
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
    let newDates = array.map(arr => {
      let year = arr.slice(2, 4);
      let month = arr.slice(4, 6);
      let dateFormat = `${year}년${month}월`;
      return dateFormat;
    });
    return newDates;
  }

  modifyChartData(data, num) {
    let sorted = this.sortObject(data);
    let values = Object.values(sorted);
    let splitValues = this.splitUp(values, num);
    return splitValues;
  }

  renameKeys() {}

  async componentDidMount() {
    try {
      await postApi("main/maincomp").then(res => {
        const {
          monthlyFailureRate,
          mainSupplyItems,
          dataRoomList,
          failureRate,
          salesQuantityTurnover,
          notisList
        } = res.data.data;

        let salesQuantity = this.modifyChartData(salesQuantityTurnover, 3);
        let monthlyFailure = this.modifyChartData(monthlyFailureRate, 3);
        let mainSupply = this.modifyChartData(mainSupplyItems, 2);
        let failRate = Object.values(failureRate);
        let mainInt = mainSupply[0].map(string => {
          let int = parseInt(string);
          return int;
        });

        let dates = salesQuantity[2];
        let newDates = this.dateFormatter(dates);

        this.setState({
          salesChart: {
            series: [
              { ...this.state.salesChart.series[0], data: salesQuantity[0] },
              { ...this.state.salesChart.series[1], data: salesQuantity[1] }
            ],
            options: {
              ...this.state.salesChart.options,
              labels: newDates
            }
          },
          monthFailChart: {
            series: [
              {
                ...this.state.monthFailChart.series[0],
                data: monthlyFailure[1]
              },
              {
                ...this.state.monthFailChart.series[1],
                data: monthlyFailure[0]
              }
            ],
            options: {
              ...this.state.monthFailChart.options,
              labels: newDates
            }
          },
          mainSupplyChart: {
            series: mainInt,
            options: {
              ...this.state.mainSupplyChart.options,
              labels: mainSupply[1]
            }
          },
          failRateChart: {
            series: failRate,
            options: {
              ...this.state.failRateChart.options
            }
          },
          notice: notisList,
          dataRoom: dataRoomList
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        loading: false
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
      notice
    } = this.state;
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <div className="chart-section">
            <div className="chart-wrapper">
              <div className="chart-inner">
                <h2>매출 수량 / 금액 추이</h2>
                <Chart
                  options={salesChart.options}
                  series={salesChart.series}
                  width="100%"
                  height="265"
                  className="chart"
                />
              </div>
              <div className="chart-inner bottom">
                <h2>불량(PPM) 추이</h2>
                <Chart
                  options={monthFailChart.options}
                  series={monthFailChart.series}
                  width="100%"
                  height="265"
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
                  height="250"
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
                  height="250"
                  className="chart half"
                />
              </div>
            </div>
            <Tabs className="chart-wrapper half right bottom table">
              <TabList>
                <Tab>공지사항</Tab>
                <Tab>자료실</Tab>
              </TabList>
              <TabPanel className="table-wrapper">
                <Table data={notice} />
              </TabPanel>
              <TabPanel className="table-wrapper">
                <Table data={dataRoom} />
              </TabPanel>
            </Tabs>
          </div>
        )}
      </>
    );
  }
}
