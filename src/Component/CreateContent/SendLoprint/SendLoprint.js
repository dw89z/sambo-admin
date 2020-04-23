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
    errorSearch: false,
    innerLoading: true,
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
      let { paymentcardlist } = this.state;
      let checked = paymentcardlist.filter((list, index) => index === id);
      let remain = paymentcardlist.filter((list, index) => index !== id);
      let checkAmount = paymentcardlist.filter((list) => list.checked === true);
      console.log(checkAmount);
      if (checkAmount.length < 10) {
        if (checked[0].checked === false) {
          checked[0].checked = true;
        } else {
          checked[0].checked = false;
        }
        remain.splice(id, 0, checked[0]);
        this.setState({
          paymentcardlist: remain,
        });
      } else {
        if (checked[0].checked === true) {
          checked[0].checked = false;
        }
      }
    },

    sortBy: (e) => {
      const key = e.target.id;
      this.setState({
        paymentcardlist: _.sortBy(this.state.paymentcardlist, key),
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
    paymentCard: async () => {
      const data = {
        fromDate: "20200401",
        toDate: "20201231",
        cvcod: "000010",
        printgbn: "N",
        itgbn: "1",
        jajegbn: "2",
        searchKeyword: "",
      };
      await postApi("scm/paymentorder/paymentcardlist", data).then((res) => {
        const {
          data: { data },
        } = res;
        if (data) {
          data.paymentcardlist.map((list, index) => {
            const year = list.nadate.substr(0, 4);
            const month = list.nadate.substr(4, 2);
            const day = list.nadate.substr(6, 2);
            const date = `${year}-${month}-${day}`;
            list.nadate = date;
            const naqty = this.addCommas(list.naqty);
            list.naqty = naqty;
            list.checked = false;
            list.index = index + 1;

            if (list.use_lot_no === null) {
              list.use_lot_no = "";
            }
            if (list.packtype === null) {
              list.packtype = "";
            }
            if (list.prt_JPNO === null) {
              list.prt_JPNO = "";
            }
            return list;
          });
          this.setState({
            paymentcardlist: data.paymentcardlist,
            innerLoading: false,
            errorSearch: false,
          });
        } else {
          this.setState({
            innerLoading: false,
            errorSearch: false,
          });
        }
        this.setState({
          paymentcardlist: data.paymentcardlist,
          innerLoading: false,
        });
      });
    },
  };

  addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  formatDate = (date) => {
    if (date) {
      const yearNum = date.getFullYear();
      let monthNum = date.getMonth() + 1;
      let dayNum = date.getDate();
      let year = yearNum.toString();
      let month = monthNum.toString();
      let day = dayNum.toString();
      if (month.length === 1) {
        month = "0" + month;
      }
      if (day.length === 1) {
        day = "0" + day;
      }
      const fulldate = `${year}${month}${day}`;
      return fulldate;
    }
  };

  async componentDidMount() {
    let date = new Date();
    date.setDate(date.getDate() - 20);
    this.setState({
      fromDate: date,
      toDate: new Date(),
      cvcod: this.props.user.cvcod,
    });
    this.submits.paymentCard();
  }

  render() {
    const {
      fromDate,
      toDate,
      paymentcardlist,
      innerLoading,
      isMast,
      searchKeyword,
      cvnas,
    } = this.state;
    const { userinfo } = this.props.user;
    const submits = this.submits;
    const inputs = this.inputs;
    console.log(paymentcardlist);

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
                <span className="label ml">시작품</span>
                <input type="checkbox" className="test" />
              </div>
              <button className="save search">조회</button>
              <button className="save">저장</button>
            </form>
          </div>
          <div className="table">
            <div
              className={
                this.props.menuAxis
                  ? "react-bootstrap-table send-table"
                  : "react-bootstrap-table send-table left"
              }
            >
              <table className="loprint">
                <thead>
                  <tr>
                    <th onClick={inputs.sortBy} className="th-sort">
                      번호
                    </th>
                    <th className="selection">선택</th>
                    <th>발행번호</th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      출발일자
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      출발번호
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      품번
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      품명
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      용기 TYPE
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      적입량
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort">
                      수량
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentcardlist.map((list, index) => {
                    return (
                      <tr
                        key={index}
                        className={list.checked ? "list active" : "list"}
                        id={`row${index}`}
                      >
                        <td className="balseq">{list.index}</td>
                        <td className="selection td">
                          <input
                            type="checkbox"
                            id={index}
                            className="table-check"
                            onChange={inputs.checkRow}
                            checked={list.checked}
                          />
                        </td>
                        <td className="num">{list.jpno}</td>
                        <td className="num">{list.nadate}</td>
                        <td className="num">{list.jpno}</td>
                        <td className="num">{list.itnbr}</td>
                        <td>{list.itdsc}</td>
                        <td>{list.packtype}</td>
                        <td className="num">{list.packqty}</td>
                        <td className="num">{list.naqty}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
