import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import search from "../../../assets/img/search.svg";
import { postApi } from "../../../api";
import "./SystUser.scss";
import { formatBytes } from "react-dropzone-uploader";

export default class extends React.Component {
  state = {
    loading: false,
    userSearch: "",
    users: [],
    selectedRow: {},
    selectRow: {
      mode: "checkbox",
      clickToSelect: true
    },
    columns: [
      {
        dataField: "logid",
        text: "로그인ID",
        sort: true
      },
      {
        dataField: "passwd",
        text: "비밀번호"
      },
      {
        dataField: "cvnas",
        text: "거래처명",
        sort: true
      },
      {
        dataField: "cvcod",
        text: "거래처코드",
        sort: true
      },
      {
        dataField: "auth",
        text: "권한구분",
        sort: true,
        formatter: this.formatter,
        formatExtraData: {
          0: "일반",
          1: "관리자",
          2: "사용자"
        }
      },
      {
        dataField: "gubn",
        text: "거래처구분",
        sort: true,
        formatter: this.formatter,
        formatExtraData: {
          0: "외주",
          1: "구매"
        }
      },
      {
        dataField: "hphone",
        text: "핸드폰"
      },
      {
        dataField: "telno",
        text: "전화번호"
      },
      {
        dataField: "email",
        text: "이메일"
      }
    ]
  };

  formatter(cell, row, rowIndex, formatExtraData) {
    return <span>{formatExtraData[cell]}</span>;
  }

  getRowData = {
    onClick: (row, rowIndex) => {
      this.setState({
        selectedRow: rowIndex
      });
      console.log(this.state.selectedRow);
    }
  };

  userSearch = async e => {
    e.preventDefault();
    const params = { searchKeyword: this.state.userSearch };
    await postApi("admin/um/searchusers", JSON.stringify(params)).then(res => {
      const {
        data: { data }
      } = res;
      this.setState({
        users: [...data]
      });
    });
  };

  async componentDidMount() {
    const params = {
      searchKeyword: "lurekal"
    };
    await postApi("admin/um/searchusers", JSON.stringify(params)).then(res => {
      const {
        data: { data }
      } = res;
      this.setState({
        users: [...data]
      });
    });
  }

  render() {
    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          {/* {loading ? <Loading /> : <div>asdfas</div>} */}
          <div className="form">
            <form onSubmit={this.userSearch}>
              <span>사용자 조회</span>
              <input
                placeholder="로그인ID 및 거래처명으로 검색"
                className="user-search"
                type="text"
                onChange={e => this.setState({ userSearch: e.target.value })}
              />
              <button></button>
            </form>
          </div>
          <div className="table">
            <BootstrapTable
              wrapperClasses="user-table"
              keyField="id"
              data={this.state.users}
              columns={this.state.columns}
              rowEvents={this.getRowData}
            />
          </div>
          <div className="right-panel"></div>
        </div>
      </>
    );
  }
}
