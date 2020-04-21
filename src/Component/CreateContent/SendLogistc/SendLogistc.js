import React from "react";
import _ from "lodash";
import InnerLoading from "../../InnerLoading";
import LiveSearch from "../common/LiveSeach";
import { postApi } from "../../../api";
import DatePicker from "react-datepicker";
import "./SendLogistc.scss";
import "react-datepicker/dist/react-datepicker.css";

export default class extends React.Component {
  state = {
    regexp: /^[0-9\b]+$/,
    fromDate: "",
    toDate: "",
    startDate: "",
    departureprocessinglist: [],
    errorSearch: true,
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

    updateTable: (e) => {
      const id = e.target.id.replace(/[^\d.-]/g, "");
      const key = e.target.id.replace(/\d+/g, "");

      const departureprocessinglist = [...this.state.departureprocessinglist];
      departureprocessinglist[id] = {
        ...departureprocessinglist[id],
        [key]: e.target.value,
      };
      this.setState({
        departureprocessinglist,
      });
    },

    updateNumber: (e) => {
      const id = e.target.id.replace(/[^\d.-]/g, "");
      const key = e.target.id.replace(/\d+/g, "");
      let num = e.target.value;

      if (/^\d+$/.test(num) || num === "") {
        const departureprocessinglist = [...this.state.departureprocessinglist];
        departureprocessinglist[id] = {
          ...departureprocessinglist[id],
          [key]: e.target.value,
        };
        this.setState({
          departureprocessinglist,
        });
      }
    },

    updateYNumber: (e) => {
      const id = parseInt(e.target.id.replace(/[^\d.-]/g, ""));
      const key = e.target.id.replace(/\d+/g, "");
      let num = e.target.value;
      const { departureprocessinglist } = this.state;
      let getRow = departureprocessinglist.filter(
        (list, index) => index === id
      );
      let maxNumRaw = getRow[0].janru;
      let maxNum = maxNumRaw.replace(",", "");
      let currentNum = e.target.value;

      if (/^\d+$/.test(num) || num === "") {
        if (parseInt(maxNum) < parseInt(currentNum)) {
          this.props.error("납품수량은 발주잔량보다 클 수 없습니다");
          departureprocessinglist[id] = {
            ...departureprocessinglist[id],
            [key]: 0,
          };
          this.setState({
            departureprocessinglist,
          });
        } else {
          departureprocessinglist[id] = {
            ...departureprocessinglist[id],
            [key]: e.target.value,
          };
          this.setState({
            departureprocessinglist,
          });
        }
      }
    },

    updateCheck: (e) => {
      const id = e.target.id.replace(/[^\d.-]/g, "");
      const key = e.target.id.replace(/\d+/g, "");
      const departureprocessinglist = [...this.state.departureprocessinglist];

      if (departureprocessinglist[id].issue_yn === "N") {
        departureprocessinglist[id] = {
          ...departureprocessinglist[id],
          [key]: "Y",
        };
        this.setState({
          departureprocessinglist,
        });
      } else if (departureprocessinglist[id].issue_yn === "Y") {
        departureprocessinglist[id] = {
          ...departureprocessinglist[id],
          [key]: "N",
          eo_no: "",
          issue_date: null,
        };
        this.setState({
          departureprocessinglist,
        });
      }
    },

    updateDate: (e) => {
      const id = e.target.id.replace(/[^\d.-]/g, "");
      const key = e.target.id.replace(/\d+/g, "");
      const departureprocessinglist = [...this.state.departureprocessinglist];

      if (departureprocessinglist[id].issue_yn === "N") {
        departureprocessinglist[id] = {
          ...departureprocessinglist[id],
          [key]: "Y",
        };
        this.setState({
          departureprocessinglist,
        });
      } else if (departureprocessinglist[id].issue_yn === "Y") {
        departureprocessinglist[id] = {
          ...departureprocessinglist[id],
          [key]: "N",
        };
        this.setState({
          departureprocessinglist,
        });
      }
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

    delRow: (e) => {
      const { departureprocessinglist } = this.state;
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      const remains = departureprocessinglist.filter(
        (list, idx) => idx !== index
      );
      this.setState({
        departureprocessinglist: remains,
      });
    },

    copyRow: (e) => {
      const id = e.target.id;
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      let { departureprocessinglist } = this.state;
      const getRow = departureprocessinglist.filter(
        (list) => list.balseq === id
      );
      const copiedRow = getRow.map((row) => ({ ...row, copied: true }));
      departureprocessinglist.splice(index + 1, 0, copiedRow[0]);
      this.setState({
        departureprocessinglist,
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

    issueDate: (date, e) => {
      const { departureprocessinglist } = this.state;
      const datePickerCell = this.findPicker(e.target, "date-picker-cell");
      const datePicker = datePickerCell.children[0].children[0].children[0];
      const id = parseInt(datePicker.id.replace(/[^\d.-]/g, ""));
      const getRow = departureprocessinglist.filter(
        (list, index) => index === id
      );
      let remain = departureprocessinglist.filter(
        (list, index) => index !== id
      );
      getRow[0].issue_date = date;
      console.log(getRow);
      remain.splice(id, 0, getRow[0]);
      console.log(remain);
      this.setState({
        departureprocessinglist: remain,
      });
    },
  };

  findPicker = (elem, selector) => {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.classList.contains(selector)) {
        return elem;
      }
    }
    return null;
  };

  addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  submits = {
    process: async () => {
      const data = {
        fromDate: "20200401",
        toDate: "20200430",
        cvcod: "000010",
        searchKeyword: "",
      };
      await postApi("scm/paymentorder/departureProcessList", data).then(
        (res) => {
          const {
            data: { data },
          } = res;
          data.departureprocessinglist.map((list) => {
            const year = list.nadat.substr(0, 4);
            const month = list.nadat.substr(4, 2);
            const day = list.nadat.substr(6, 2);
            const date = `${year}-${month}-${day}`;
            list.nadat = date;
            const balqty = this.addCommas(list.balqty);
            list.balqty = balqty;
            const janru = this.addCommas(list.janru);
            list.janru = janru;
            list.checked = false;

            if (list.use_lot_no === null) {
              list.use_lot_no = "";
            }
            if (list.out_lot_no === null) {
              list.out_lot_no = "";
            }
            if (list.eo_no === null) {
              list.eo_no = "";
            }
            if (list.packqty === null) {
              list.packqty = "";
            }
            return list;
          });
          this.setState({
            departureprocessinglist: data.departureprocessinglist,
            innerLoading: false,
          });
        }
      );
    },

    regist: async (e) => {
      e.preventDefault();
      const { departureprocessinglist, logid, cvcod } = this.state;
      const selection = departureprocessinglist.filter(
        (list) => list.checked === true
      );
      if (selection.length === 0) {
        this.props.error("1개 이상의 리스트를 선택해야 합니다");
      } else if (selection.length > 0) {
        const failedOut = selection.filter((list) => list.out_lot_no === "");
        const failedYoung = selection.filter(
          (list) => list.young === "" || list.young === 0
        );
        const hasYN = selection.filter((list) => list.issue_yn === "Y");
        const failYN = hasYN.filter(
          (list) => list.issue_date === null || list.eo_no === ""
        );
        if (
          failedOut.length > 0 ||
          failYN.length > 0 ||
          failedYoung.length > 0
        ) {
          this.props.error("필수 값이 입력되지 않았습니다");
        } else {
          const dataList = selection.map((list) => {
            if (list.use_lot_no === "") {
              list.use_lot_no = null;
            }
            if (list.packqty === "") {
              list.packqty = null;
            }
            if (list.issue_date !== null) {
              const formatDat = this.formatDate(list.issue_date);
              list.issue_date = formatDat;
            }
            delete list.copied;
            delete list.itdsc;
            delete list.ispec;
            delete list.checked;
            delete list.issue_yn;
            delete list.packtype;
            delete list.nadat;
            delete list.balqty;
            delete list.janru;
            list.qty = list.packqty;
            delete list.packqty;
            list.naqty = list.young;
            list.use_qty = list.young;
            delete list.young;
            return list;
          });
          const crtDat = this.formatDate(new Date());

          const data = {
            nadate: "20201231",
            crt_dt: crtDat,
            crt_id: logid,
            cvcod: cvcod,
            list: dataList,
          };
          await postApi(
            "scm/paymentorder/registdepartureProcess",
            data
          ).then((res) => console.log(res));
        }
      }
    },
  };

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

  subTest = (e) => {
    e.preventDefault();
    const data = {
      nadate: "20201231",
      crt_dt: "20200417",
      crt_id: "system",
      cvcod: "000010",
      list: [
        {
          baljpno: "20201201000X",
          balseq: "1",
          naqty: "50000",
          use_lot_no: null,
          use_qty: "50000",
          issue_date: "20201231",
          eo_no: "1",
          out_lot_no: "lot-04-test",
          qty: "400",
          itnbr: "09111-43000",
        },
      ],
    };
    postApi("scm/paymentorder/registdepartureProcess", data).then((res) =>
      console.log(res)
    );
  };

  componentDidUpdate = (prevProp, prevState) => {
    if (prevState.logid !== this.state.logid) {
      console.log("did");
    }
  };

  componentDidMount = () => {
    let date = new Date();
    date.setDate(date.getDate() - 20);
    this.setState({
      fromDate: date,
      toDate: new Date(),
      startDate: new Date(),
      cvcod: this.props.user.userinfo.cvcod,
    });
    this.submits.process();
  };

  render() {
    const {
      fromDate,
      toDate,
      departureprocessinglist,
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
          <div className="table">
            <div
              className={
                this.props.menuAxis
                  ? "react-bootstrap-table send-table"
                  : "react-bootstrap-table send-table left"
              }
            >
              <table>
                <thead>
                  <tr>
                    <th onClick={inputs.sortBy} className="th-sort" id="balseq">
                      번호
                    </th>
                    <th>선택</th>
                    <th>행 복제</th>
                    <th onClick={inputs.sortBy} className="th-sort" id="intbr">
                      품번
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="itdsc">
                      품명
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="ispec">
                      규격
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="nadat">
                      납기예정일
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="balqty">
                      발주수량
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="janru">
                      발주잔량
                    </th>
                    <th
                      onClick={inputs.sortBy}
                      className="th-sort"
                      id="use_lot_no"
                    >
                      사용자재 LOT
                    </th>
                    <th
                      onClick={inputs.sortBy}
                      className="th-sort"
                      id="out_lot_no"
                    >
                      제조 LOT
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="young">
                      납품수량
                    </th>
                    <th>4M</th>
                    <th
                      onClick={inputs.sortBy}
                      className="th-sort"
                      id="issue_date"
                    >
                      변경일자
                    </th>
                    <th onClick={inputs.sortBy} className="th-sort" id="eo_no">
                      EO.NO
                    </th>
                    <th
                      onClick={inputs.sortBy}
                      className="th-sort"
                      id="packtype"
                    >
                      용기 TYPE
                    </th>
                    <th
                      onClick={inputs.sortBy}
                      className="th-sort"
                      id="packqty"
                    >
                      적입량
                    </th>
                    <th>행 삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {departureprocessinglist.map((list, index) => {
                    return (
                      <tr
                        key={index}
                        className={list.checked ? "list active" : "list"}
                        id={`row${index}`}
                      >
                        <td
                          className={list.copied ? "balseq copied" : "balseq"}
                        >
                          {list.balseq}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            id={index}
                            className="table-check"
                            onChange={inputs.checkRow}
                            checked={list.checked}
                          />
                        </td>
                        <td
                          className={
                            list.copied
                              ? "copy"
                              : !list.copied && list.checked
                              ? "copy active"
                              : "copy deactive"
                          }
                          id={list.balseq}
                          onClick={
                            !list.copied && list.checked ? inputs.copyRow : null
                          }
                          data-index={index}
                        ></td>
                        <td className="num">{list.itnbr}</td>
                        <td>{list.itdsc}</td>
                        <td>{list.ispec}</td>
                        <td className="num">{list.nadat}</td>
                        <td className="num">{list.balqty}</td>
                        <td className="num">{list.janru}</td>
                        <td>
                          <input
                            type="text"
                            value={list.use_lot_no}
                            id={`use_lot_no${index}`}
                            className="table-input"
                            onChange={inputs.updateTable}
                            disabled={!list.checked}
                            placeholder={
                              list.checked ? "사용자재 LOT" : undefined
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={list.out_lot_no}
                            id={`out_lot_no${index}`}
                            className="table-input"
                            onChange={inputs.updateTable}
                            disabled={!list.checked}
                            placeholder={
                              list.checked ? "제조 LOT(필수)" : undefined
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={list.young}
                            id={`young${index}`}
                            className="table-input num"
                            onChange={inputs.updateYNumber}
                            disabled={!list.checked}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            id={`issue_yn${index}`}
                            checked={list.issue_yn === "Y"}
                            className="table-check"
                            onChange={inputs.updateCheck}
                            disabled={!list.checked}
                          />
                        </td>
                        <td className="date-picker-cell">
                          <DatePicker
                            selected={list.issue_date}
                            onChange={(date, e) => {
                              inputs.issueDate(date, e);
                            }}
                            dateFormat="yyyy/MM/dd"
                            disabled={!list.checked || list.issue_yn === "N"}
                            id={`issue_date${index}`}
                          />
                        </td>
                        <td>
                          <input
                            type="num"
                            value={list.eo_no}
                            id={`eo_no${index}`}
                            className="table-input num"
                            onChange={inputs.updateNumber}
                            disabled={!list.checked || list.issue_yn === "N"}
                            placeholder={
                              list.issue_yn === "Y" ? "EO.NO(필수)" : undefined
                            }
                          />
                        </td>
                        <td>{list.packtype}</td>
                        <td>
                          <input
                            type="num"
                            value={list.packqty}
                            id={`packqty${index}`}
                            className="table-input num"
                            onChange={inputs.updateNumber}
                            disabled={!list.checked}
                            placeholder={list.checked ? "적입량" : undefined}
                          />
                        </td>
                        <td
                          data-copy={list.copied}
                          data-index={index}
                          className={list.copied ? "delete active" : "delete"}
                          id={list.balseq}
                          onClick={list.copied ? inputs.delRow : null}
                        ></td>
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
