import React from "react";
import InnerLoading from "../../InnerLoading";
import LiveSearch from "../common/LiveSeach";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { postApi } from "../../../api";
import DatePicker from "react-datepicker";
import "./SendLogistc.scss";
import "react-datepicker/dist/react-datepicker.css";

export default class extends React.Component {
  state = {
    fromDate: "",
    toDate: "",
    startDate: "",
    departureprocessinglist: [],
    columns: [
      {
        dataField: "balseq",
        text: "번호",
        sort: true,
        align: "center",
      },
      {
        dataField: "intbr",
        text: "품번",
        sort: true,
      },
      {
        dataField: "itdsc",
        text: "품명",
        sort: true,
        editable: false,
      },
      {
        dataField: "ispec",
        text: "규격",
        sort: true,
        editable: false,
      },
      {
        dataField: "balqty",
        text: "발주수량",
        sort: true,
        editable: false,
      },
      {
        dataField: "nadat",
        text: "납기예정일",
        sort: true,
        editable: false,
      },
      {
        dataField: "janru",
        text: "발주잔량",
        sort: true,
        editable: false,
      },
      {
        dataField: "use_LOT_NO",
        text: "사용자재 LOT",
        sort: true,
        editable: false,
      },
      {
        dataField: "out_LOT_NO",
        text: "제조 LOT",
        sort: true,
        editable: false,
      },
      {
        dataField: "young",
        text: "납품수량",
        sort: true,
      },
      {
        dataField: "issue_yn",
        text: "4M",
        sort: true,
      },
      {
        dataField: "issue_date",
        text: "변경일자",
        sort: true,
      },
      {
        dataField: "eo_NO",
        text: "EO.NO",
        sort: true,
      },
      {
        dataField: "baljpno",
        text: "부품식별표",
        sort: true,
        editable: false,
      },
      {
        dataField: "packtype",
        text: "용기TYPE",
        sort: true,
      },
      {
        dataField: "packqty",
        text: "적입량",
        sort: true,
      },
    ],
    errorSearch: true,
    innerLoading: true,
    isMast: true,
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
      columns,
      innerLoading,
      isMast,
      searchKeyword,
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
            <form>
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
              <div className="input-divide">
                <div className="input-div">
                  <span className="label">품번/검색어</span>
                  <input
                    type="text"
                    name="searchKeyword"
                    value={searchKeyword}
                  />
                </div>
                <span className="label ml">출발일자</span>
                <DatePicker
                  selected={toDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy/MM/dd"
                />
                <span className="label ml">시작품</span>
                <input type="checkbox" />
              </div>
              <button className="save">저장</button>
            </form>
          </div>
          <div className="table">
            <BootstrapTable
              wrapperClasses={
                this.props.menuAxis ? "send-table" : "send-table left"
              }
              keyField="balseq"
              data={departureprocessinglist}
              columns={columns}
              cellEdit={cellEditFactory({
                mode: "click",
                blurToSave: true,
              })}
            />
          </div>
        </div>
      </>
    );
  }
}
