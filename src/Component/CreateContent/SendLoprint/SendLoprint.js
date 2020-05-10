import React from "react";
import InnerLoading from "../../InnerLoading";
import LiveSearch from "../common/LiveSeach";
import NewWindow from "react-new-window";
import _ from "lodash";
import { postApi, getApi } from "../../../api";
import { addCommas } from "../common/Common";
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
    itgbn: "1",
    jajegbn: "2",
    printgbn: "N",
    searchKeyword: "",
    printcardlist: [],
    newWindow: false,
    pdfPath: "",
    prtJpno: "",
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

    checkPrtRow: (e) => {
      const id = parseInt(e.target.id);
      let { printcardlist } = this.state;
      if (printcardlist[id][0].checked === false) {
        printcardlist[id].forEach((list) => (list.checked = true));
      } else {
        printcardlist[id].forEach((list) => (list.checked = false));
      }
      this.setState({
        printcardlist: [...printcardlist],
      });
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
            const naqty = addCommas(list.naqty);
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

      this.setState({
        printgbn: "Y",
        innerLoading: true,
      });
      try {
        await postApi("scm/paymentorder/publishpaymentcard", jpnos).then(
          async (res) => {
            this.setState({
              prtJpno: res.data.data.prt_jpno,
            });
            if (!res.data.data.errorCode) {
              await postApi("scm/paymentorder/paymentcardlist", data).then(
                (res) => {
                  const {
                    data: { data },
                  } = res;
                  const result = this.groupBy(data.paymentcardlist, "prt_JPNO");
                  let resArr = [];
                  for (let i in result) {
                    let resRow = Object.values(result[i]);
                    let resChk = resRow.map((list) => {
                      list.checked = false;
                      const year = list.nadate.substr(0, 4);
                      const month = list.nadate.substr(4, 2);
                      const day = list.nadate.substr(6, 2);
                      const date = `${year}-${month}-${day}`;
                      list.nadate = date;
                      const naqty = addCommas(list.naqty);
                      list.naqty = naqty;
                      return list;
                    });
                    resArr.push(resChk);
                  }
                  this.setState({
                    printcardlist: resArr,
                    innerLoading: false,
                  });
                }
              );
            }
          }
        );
      } catch (error) {
        alert(error);
      } finally {
        const { prtJpno } = this.state;
        const data = {
          cvcod: "000010",
          prt_jpno: prtJpno,
        };
        await postApi("scm/paymentorder/maketradingstatement", data).then(
          (res) => {
            const { data } = res;
            if (data.errorCode === "1") {
              this.setState({
                innerLoading: false,
              });
            } else {
              this.setState(
                {
                  pdfPath: data.data.reportpath,
                  innerLoading: false,
                },
                () => {
                  this.setState({
                    newWindow: true,
                  });
                }
              );
            }
          }
        );
      }
    },

    pubPdf: async () => {
      const data = {
        cvcod: "000010",
        prt_jpno: "202004220008",
      };
      await postApi("scm/paymentorder/maketradingstatement", data).then((res) =>
        console.log(res)
      );
    },
  };

  componentDidUpdate = async (prevProp, prevState) => {
    if (prevState.logid !== this.state.logid) {
      await getApi(`admin/um/user/${this.state.logid}`).then((res) => {
        const {
          data: {
            data: { userinfo },
          },
        } = res;
        this.setState({
          userId: userinfo.logid,
          cvnas: userinfo.cvnas,
          gubn: userinfo.gubn,
        });
      });
    }
  };

  test = async () => {
    const data = {
      fromDate: "20200401",
      toDate: "20201231",
      cvcod: "000010",
      printgbn: "N",
      itgbn: "1",
      jajegbn: "2",
      searchKeyword: "",
    };
    this.setState({
      innerLoading: false,
    });
    await postApi("scm/paymentorder/paymentcardlist", data).then((res) => {
      const {
        data: { data },
      } = res;
      const result = this.groupBy(data.paymentcardlist, "prt_JPNO");
      let resArr = [];
      for (let i in result) {
        let resRow = Object.values(result[i]);
        let resChk = resRow.map((list) => {
          list.checked = false;
          const year = list.nadate.substr(0, 4);
          const month = list.nadate.substr(4, 2);
          const day = list.nadate.substr(6, 2);
          const date = `${year}-${month}-${day}`;
          list.nadate = date;
          const naqty = addCommas(list.naqty);
          list.naqty = naqty;
          return list;
        });
        resArr.push(resChk);
      }
      this.setState({
        printcardlist: resArr,
      });
    });
  };

  groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );

      return result;
    }, {});
  };

  generateList = () => {
    const { paymentcardlist, printgbn, printcardlist } = this.state;
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
                <td className="selection td">
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
      resultList = printcardlist.map((list, mainIndex) => {
        return list.map((sub, index) => {
          return (
            <tr
              key={index}
              className={sub.checked ? "list active" : "list"}
              id={`row${index}`}
            >
              {sub.prt_JPNO ? (
                index < 1 && (
                  <>
                    <td className="balseq" rowSpan={list.length}>
                      {mainIndex + 1}
                    </td>
                    <td className="selection td" rowSpan={list.length}>
                      <input
                        type="checkbox"
                        id={mainIndex}
                        className="table-check"
                        onChange={inputs.checkPrtRow}
                        checked={sub.checked}
                      />
                    </td>
                  </>
                )
              ) : (
                <>
                  <td className="balseq">{mainIndex + 1}</td>
                  <td className="selection td">
                    <input
                      type="checkbox"
                      id={index}
                      className="table-check"
                      onChange={inputs.checkPrtRow}
                      checked={sub.checked}
                    />
                  </td>
                </>
              )}
              <td className="num">{sub.prt_JPNO}</td>
              <td className="num">{sub.nadate}</td>
              <td className="num">{sub.jpno}</td>
              <td className="num">{sub.itnbr}</td>
              <td>{sub.itdsc}</td>
              <td>{sub.packtype}</td>
              <td className="num">{sub.packqty}</td>
              <td className="num">{sub.naqty}</td>
              <td
                data-index={index}
                className={
                  sub.checked && sub.prt_JPNO ? "print active" : "print"
                }
                id={index}
                onClick={sub.prt_JPNO ? inputs.printLabel : null}
              >
                <span>print</span>
              </td>
            </tr>
          );
        });
      });
    }
    return resultList;
  };

  comp = {
    resultSpan: () => {
      const { userinfo } = this.props.user;
      const { subcontractor, gubn, cvnas } = this.state;
      let spans;
      if (userinfo.auth === "1") {
        spans = (
          <>
            <span className="result-span">{cvnas}</span>
            <span className="result-span">
              {gubn === "0" ? "구매업체" : "외주업체"}
            </span>
          </>
        );
      } else {
        spans = (
          <>
            <span className="result-span">{subcontractor.cvnas}</span>
            <span className="result-span">
              {gubn === "0" ? "구매업체" : "외주업체"}
            </span>
          </>
        );
      }
      return spans;
    },
  };

  controlPrintYN = () => {
    const { printgbn } = this.state;
    if (printgbn === "Y") {
      this.setState(
        {
          printgbn: "N",
          innerLoading: true,
        },
        () => {
          this.submits.paymentCard();
        }
      );
    } else if (printgbn === "N") {
      this.setState(
        {
          printgbn: "Y",
        },
        () => {
          this.submits.pubPayment();
        }
      );
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
      innerLoading,
      isMast,
      searchKeyword,
      jajegbn,
      printgbn,
      itgbn,
      newWindow,
      pdfPath,
      paymentcardlist,
    } = this.state;
    const { userinfo } = this.props.user;
    const submits = this.submits;
    const inputs = this.inputs;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        {newWindow ? (
          <NewWindow url={`http://125.141.30.222:8757/${pdfPath}`}></NewWindow>
        ) : null}
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
                  {this.comp.resultSpan()}
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
              <button className="save search">조회</button>
              {printgbn === "N" ? (
                <button
                  className="save"
                  type="button"
                  onClick={() => {
                    const checked = paymentcardlist.filter(
                      (list) => list.checked
                    );
                    if (checked.length === 0) {
                      this.props.error("1개 이상의 리스트를 선택해주세요");
                    } else {
                      submits.pubPayment();
                    }
                  }}
                >
                  발행
                </button>
              ) : (
                <button className="save" type="button" onClick={submits.pubPdf}>
                  재발행
                </button>
              )}

              <div className="switch">
                <span className={printgbn === "N" ? "mr active" : "mr"}>
                  미발행
                </span>
                <div className="switch-cont" onClick={this.controlPrintYN}>
                  <p className={printgbn === "N" ? "btn no" : "btn yes"}></p>
                  <p className="btn-back"></p>
                </div>
                <span className={printgbn === "Y" ? "ml active" : "ml"}>
                  발행
                </span>
              </div>
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

                    {printgbn === "Y" ? <th>명세서번호</th> : null}
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
