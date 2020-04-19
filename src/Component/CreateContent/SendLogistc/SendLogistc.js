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
    selectedList: [],
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

    getRow: (e) => {
      const id = parseInt(e.target.id);
      let selectedList = [...this.state.selectedList];
      if (selectedList.includes(id)) {
        let remainList = selectedList.filter((list) => list !== id);
        remainList.sort();
        this.setState({
          selectedList: remainList,
        });
      } else {
        selectedList.push(id);
        selectedList.sort((a, b) => a - b);
        this.setState({
          selectedList,
        });
      }
    },

    checkSelect: () => {},

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
      const { departureprocessinglist, selectedList } = this.state;
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      const remains = departureprocessinglist.filter(
        (list, idx) => idx !== index
      );
      const deSelect = selectedList.filter((list) => list !== index);
      this.setState({
        departureprocessinglist: remains,
        selectedList: deSelect,
      });
    },

    copyRow: (e) => {
      const id = e.target.id;
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      let { departureprocessinglist, selectedList } = this.state;
      const getRow = departureprocessinglist.filter(
        (list) => list.balseq === id
      );
      const copiedRow = getRow.map((row) => ({ ...row, copied: true }));
      departureprocessinglist.splice(index + 1, 0, copiedRow[0]);
      selectedList.push(index + getRow.length);
      this.setState({
        departureprocessinglist,
        selectedList,
      });
    },
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

            if (list.use_lot_no === null) {
              list.use_lot_no = "";
            }
            if (list.out_lot_no === null) {
              list.out_lot_no = "";
            }
            if (list.eo_no === null) {
              list.eo_no = "";
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
          balseq: "2",
          naqty: "500000",
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
    postApi(
      "http://192.168.75.104:8080/scm/paymentorder/registdepartureProcess",
      data
    ).then((res) => console.log(res));
  };

  componentDidMount() {
    let date = new Date();
    date.setDate(date.getDate() - 20);
    this.setState({
      fromDate: date,
      toDate: new Date(),
      startdate: new Date(),
      cvcod: this.props.user.cvcod,
    });
    this.submits.process();
  }

  render() {
    const {
      fromDate,
      toDate,
      departureprocessinglist,
      innerLoading,
      isMast,
      searchKeyword,
      selectedList,
    } = this.state;
    const { userinfo } = this.props.user;
    const submits = this.submits;
    const inputs = this.inputs;
    console.log(departureprocessinglist);
    console.log(selectedList);

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component send-logistc">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form onSubmit={this.subTest}>
              <div className="input-divide">
                <div className="input-div">
                  <span className="label mr">납기예정일</span>
                </div>
                <DatePicker
                  selected={fromDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy/MM/dd"
                />
                <span className="date-divider">~</span>
                <DatePicker
                  selected={toDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy/MM/dd"
                />
                <div className="input-div">
                  <span className="label ml mr-2">협력사</span>
                  <LiveSearch
                    user={userinfo}
                    isMast={isMast}
                    liveResult={inputs.liveResult}
                  />
                  <span className="result-span">협력사 ID</span>
                  <span className="result-span">구분번호</span>
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
                      selected={toDate}
                      onChange={this.handleChange}
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
                        className={
                          selectedList.includes(index) ? "list active" : "list"
                        }
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
                            onChange={inputs.getRow}
                            checked={selectedList.includes(index)}
                          />
                        </td>
                        <td
                          className={
                            list.copied
                              ? "copy"
                              : !list.copied && selectedList.includes(index)
                              ? "copy active"
                              : "copy deactive"
                          }
                          id={list.balseq}
                          onClick={
                            selectedList.includes(index) && !list.copied
                              ? inputs.copyRow
                              : null
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
                            disabled={!selectedList.includes(index)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={list.out_lot_no}
                            id={`out_lot_no${index}`}
                            className="table-input"
                            onChange={inputs.updateTable}
                            disabled={!selectedList.includes(index)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={list.young}
                            id={`young${index}`}
                            className="table-input num"
                            onChange={inputs.updateNumber}
                            disabled={!selectedList.includes(index)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            id={`issue_yn${index}`}
                            checked={list.issue_yn === "Y"}
                            className="table-check"
                            onChange={inputs.updateCheck}
                            disabled={!selectedList.includes(index)}
                          />
                        </td>
                        <td>
                          <DatePicker
                            selected={toDate}
                            onChange={this.handleChange}
                            dateFormat="yyyy/MM/dd"
                            disabled={
                              !selectedList.includes(index) ||
                              list.issue_yn === "N"
                            }
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
                            disabled={
                              !selectedList.includes(index) ||
                              list.issue_yn === "N"
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
                            disabled={!selectedList.includes(index)}
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
