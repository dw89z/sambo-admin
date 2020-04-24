import React from "react";
import InnerLoading from "../../InnerLoading";
import LiveSearch from "../common/LiveSeach";
import _ from "lodash";
import { postApi } from "../../../api";
import DatePicker from "react-datepicker";
import "../SendLogistc/SendLogistc.scss";
import "react-datepicker/dist/react-datepicker.css";
import { post } from "jquery";

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
    itgbn: "1",
    jajegbn: "2",
    printgbn: "N",
    searchKeyword: "",
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
      } else if (checkAmount.length === 10) {
        checked[0].checked = false;
        remain.splice(id, 0, checked[0]);
        this.setState({
          paymentcardlist: remain,
        });
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
    paymentCard: async (e) => {
      if (e) {
        e.preventDefault();
      }
      this.setState({
        innerLoading: true,
      });
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
              list.use_lot_no = "-";
            }
            if (list.packtype === null) {
              list.packtype = "-";
            }
            if (list.prt_JPNO === null) {
              list.prt_JPNO = "";
            }
            if (list.packqty === null) {
              list.packqty = "-";
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

    pubPayment: async () => {
      const { paymentcardlist } = this.state;
      const checked = paymentcardlist.filter((list) => list.checked);
      const jpnos = checked.map((list) => list.jpno);
      const data = {
        fromDate: "20200401",
        toDate: "20201231",
        cvcod: "000010",
        printgbn: "Y",
        itgbn: "1",
        jajegbn: "2",
        searchKeyword: "",
      };

      if (jpnos.length !== 0) {
        this.setState({
          printgbn: "Y",
        });
        await postApi("scm/paymentorder/publishpaymentcard", jpnos).then(
          async (res) => {
            if (!res.data.data.errorCode) {
              await postApi("scm/paymentorder/paymentcardlist", data).then(
                (res) => {
                  const {
                    data: { data },
                  } = res;
                  console.log(data);
                  const result = this.groupBy(data.paymentcardlist, "prt_JPNO");
                  console.log(result);
                }
              );
            }
          }
        );
      }
    },
  };

  groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );

      return result;
    }, {});
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

  generateList = () => {
    const { paymentcardlist, printgbn } = this.state;
    const inputs = this.inputs;
    let resultList;
    if (printgbn === "N") {
      resultList = paymentcardlist.map((list, index) => {
        return (
          <tr
            key={index}
            className={list.checked ? "list active" : "list"}
            id={`row${index}`}
          >
            <td className="balseq">{list.index}</td>
            {list.prt_JPNO ? (
              index < 1 && (
                <td className="selection td" rowSpan={paymentcardlist.length}>
                  <input
                    type="checkbox"
                    id={index}
                    className="table-check"
                    onChange={inputs.checkRow}
                    checked={list.checked}
                  />
                </td>
              )
            ) : (
              <td className="selection td">
                <input
                  type="checkbox"
                  id={index}
                  className="table-check"
                  onChange={inputs.checkRow}
                  checked={list.checked}
                />
              </td>
            )}

            <td className="num">{list.prt_JPNO}</td>
            <td className="num">{list.nadate}</td>
            <td className="num">{list.jpno}</td>
            <td className="num">{list.itnbr}</td>
            <td>{list.itdsc}</td>
            <td>{list.packtype}</td>
            <td className="num">{list.packqty}</td>
            <td className="num">{list.naqty}</td>
            <td
              data-index={index}
              className={
                list.checked && list.prt_JPNO ? "print active" : "print"
              }
              id={index}
              onClick={list.prt_JPNO ? inputs.printLabel : null}
            >
              <span>print</span>
            </td>
          </tr>
        );
      });
    } else if (printgbn === "Y") {
      // resultList = paymentcardlist.map((list, index) => {
      //   return (
      //     <tr
      //       key={index}
      //       className={list.checked ? "list active" : "list"}
      //       id={`row${index}`}
      //     >
      //       <td className="balseq">{list.index}</td>
      //       {list.prt_JPNO ? (
      //         index < 1 && (
      //           <td className="selection td" rowSpan={paymentcardlist.length}>
      //             <input
      //               type="checkbox"
      //               id={index}
      //               className="table-check"
      //               onChange={inputs.checkRow}
      //               checked={list.checked}
      //             />
      //           </td>
      //         )
      //       ) : (
      //           <td className="selection td">
      //             <input
      //               type="checkbox"
      //               id={index}
      //               className="table-check"
      //               onChange={inputs.checkRow}
      //               checked={list.checked}
      //             />
      //           </td>
      //         )}
      //       <td className="num">{list.prt_JPNO}</td>
      //       <td className="num">{list.nadate}</td>
      //       <td className="num">{list.jpno}</td>
      //       <td className="num">{list.itnbr}</td>
      //       <td>{list.itdsc}</td>
      //       <td>{list.packtype}</td>
      //       <td className="num">{list.packqty}</td>
      //       <td className="num">{list.naqty}</td>
      //       <td
      //         data-index={index}
      //         className={
      //           list.checked && list.prt_JPNO ? "print active" : "print"
      //         }
      //         id={index}
      //         onClick={list.prt_JPNO ? inputs.printLabel : null}
      //       >
      //         <span>print</span>
      //       </td>
      //     </tr>
      //   );
      // });
    }
    return resultList;
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
      jajegbn,
      printgbn,
      itgbn,
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
            <form onSubmit={submits.paymentCard}>
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
                    onChange={inputs.update}
                  />
                </div>
                <div className="input-div radio-div">
                  <p>자재 구분</p>

                  <div className="radio">
                    <input
                      type="radio"
                      name="jajegbn"
                      id="purcahse"
                      value="1"
                      onChange={inputs.update}
                      checked={jajegbn === "1"}
                      required
                    />
                    <label htmlFor="purcahse">구매</label>
                  </div>
                  <div className="radio">
                    <input
                      type="radio"
                      name="jajegbn"
                      id="outsourcing"
                      value="2"
                      onChange={inputs.update}
                      checked={jajegbn === "2"}
                      required
                    />
                    <label htmlFor="outsourcing">외주</label>
                  </div>
                </div>
                <div className="input-div radio-div">
                  <p>품목 구분</p>

                  <div className="radio">
                    <input
                      type="radio"
                      name="itgbn"
                      id="raw"
                      value="1"
                      onChange={inputs.update}
                      checked={itgbn === "1"}
                      required
                    />
                    <label htmlFor="raw">원자재</label>
                  </div>
                  <div className="radio">
                    <input
                      type="radio"
                      name="itgbn"
                      id="goods"
                      value="2"
                      onChange={inputs.update}
                      checked={itgbn === "2"}
                      required
                    />
                    <label htmlFor="goods">상품</label>
                  </div>
                </div>
                <span className="label ml mt">시작품</span>
                <input type="checkbox" className="test" />
              </div>
              {printgbn === "Y" && (
                <button
                  className="save repub"
                  type="button"
                  onClick={submits.pubPayment}
                >
                  재발행
                </button>
              )}
              <button className="save search">조회</button>
              {printgbn === "N" ? (
                <button
                  className="save"
                  type="button"
                  onClick={submits.pubPayment}
                >
                  발행
                </button>
              ) : (
                <button
                  className="save"
                  type="button"
                  onClick={() => alert("미발행")}
                >
                  미발행
                </button>
              )}
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

                    <th>명세서번호</th>
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
                    <th onClick={inputs.sortBy} className="th-sort">
                      라벨
                    </th>
                  </tr>
                </thead>
                <tbody>{this.generateList()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
