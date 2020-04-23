import React from "react";
import InnerLoading from "../../InnerLoading";
import LiveSearch from "../common/LiveSeach";
import _ from "lodash";
import { postApi } from "../../../api";
import DatePicker from "react-datepicker";
import "../SendLogistc/SendLogistc.scss";
import "react-datepicker/dist/react-datepicker.css";

export default class extends React.Component {
  state = {
    fromDate: "",
    toDate: "",
    startDate: "",
    paymentcardlist: [],
    errorSearch: true,
    innerLoading: false,
    isMast: true,
    cvnas: this.props.user.userinfo.cvnas,
    logid: this.props.user.userinfo.logid,
    cvcod: this.props.user.userinfo.cvcod,
  };

  inputs = {
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

    checkRow: (e) => {
      const id = parseInt(e.target.id);
      let { departureprocessinglist } = this.state;
      let checked = departureprocessinglist.filter(
        (list, index) => index === id
      );
      let remain = departureprocessinglist.filter(
        (list, index) => index !== id
      );
      if (checked[0].checked === false) {
        checked[0].checked = true;
      } else {
        checked[0].checked = false;
      }
      remain.splice(id, 0, checked[0]);
      this.setState({
        departureprocessinglist: remain,
      });
    },

    sortBy: (e) => {
      const key = e.target.id;
      this.setState({
        departureprocessinglist: _.sortBy(
          this.state.departureprocessinglist,
          key
        ),
      });
    },

    fromDate: (date) => {
      this.setState({
        fromDate: date,
      });
    },

    toDate: (date) => {
      this.setState({
        toDate: date,
      });
    },

    startDate: (date) => {
      this.setState({
        startDate: date,
      });
    },
  };

  submits = {
    process: async () => {
      const data = {
        fromDate: "20200401",
        toDate: "20200430",
        cvcod: "000010",
        searchKeyword: "",
      };
      await postApi("scm/departureprocessing/departureProcessList", data).then(
        (res) => {
          console.log(res.data.data);
          const {
            data: { data },
          } = res;
          this.setState({
            departureprocessinglist: data.departureprocessinglist,
            innerLoading: false,
          });
        }
      );
    },
  };

  async componentDidMount() {
    // let date = new Date();
    // date.setDate(date.getDate() - 20);
    // this.setState({
    //   fromDate: date,
    //   toDate: new Date(),
    //   startdate: new Date(),
    //   cvcod: this.props.user.cvcod,
    // });
    const data = this.props.logistc;
    if (data) {
      await postApi("scm/paymentorder/paymentcardlist", data).then((res) =>
        console.log(res)
      );
    }
  }

  render() {
    const {
      fromDate,
      toDate,
      paymentcardlist,
      innerLoading,
      isMast,
      searchKeyword,
      startDate,
      cvnas,
    } = this.state;
    const { userinfo } = this.props.user;
    const submits = this.submits;
    const inputs = this.inputs;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component send-logistc">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onSubmit={submits.regist}>
              <div className="input-divide">
                <div className="input-div">
                  <span className="label mr">납기예정일</span>
                </div>
                <DatePicker
                  selected={fromDate}
                  onChange={inputs.fromDate}
                  dateFormat="yyyy/MM/dd"
                />
                <span className="date-divider">~</span>
                <DatePicker
                  selected={toDate}
                  onChange={inputs.toDate}
                  dateFormat="yyyy/MM/dd"
                />
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
              </div>
              <div className="input-divide mt">
                <div className="input-div">
                  <span className="label">품번/검색어</span>
                  <input
                    type="text"
                    name="searchKeyword"
                    value={searchKeyword}
                  />
                </div>
                {userinfo.auth === "1" && (
                  <>
                    <span className="label ml">출발일자</span>
                    <DatePicker
                      selected={startDate}
                      onChange={inputs.startDate}
                      dateFormat="yyyy/MM/dd"
                    />
                  </>
                )}

                <span className="label ml">시작품</span>
                <input type="checkbox" className="test" />
              </div>
              <button className="save search">조회</button>
              <button className="save">저장</button>
            </form>
          </div>
        </div>
        <div className="table"></div>
      </>
    );
  }
}
