import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import edit from "../../../assets/img/edit.svg";
import addUser from "../../../assets/img/add.svg";
import trash from "../../../assets/img/trash.svg";
import { postApi } from "../../../api";
import "./SystUser.scss";

export default class extends React.Component {
  state = {
    errorSearch: false,
    loading: true,
    userSearch: "",
    users: [],
    selectedRow: {},
    editMode: false,
    deleteMode: false,
    addMode: true,
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
        text: "비밀번호",
        sort: true
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
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return <span>{formatExtraData[cell]}</span>;
        },
        formatExtraData: {
          0: "외주",
          1: "구매"
        }
      },
      {
        dataField: "hphone",
        text: "핸드폰",
        sort: true,
        formatter: this.noneFormatter,
        formatExtraData: {
          null: "-"
        }
      },
      {
        dataField: "telno",
        text: "전화번호",
        sort: true,
        formatter: this.noneFormatter,
        formatExtraData: {
          null: "-"
        }
      },
      {
        dataField: "email",
        text: "이메일",
        sort: true,
        formatter: this.noneFormatter,
        formatExtraData: {
          null: "-"
        }
      },
      {
        dataField: "",
        text: "수정",
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.setState({
              selectRow: row
            });
          }
        },
        headerAlign: (column, colIndex) => "center",
        classes: "edit",
        hidden: true
      },
      {
        dataField: "",
        text: "삭제",
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.setState({
              selectRow: row
            });
          }
        },
        headerAlign: (column, colIndex) => "center",
        classes: "delete",
        hidden: true
      }
    ],
    logid: "",
    passwd: "",
    cvnas: "",
    cvcod: "",
    gubn: "",
    hphone: "",
    email: "",
    telno: "",
    auth: ""
  };

  getRowData = {
    onClick: (row, rowIndex) => {
      this.setState({
        selectedRow: rowIndex
      });
    }
  };

  noneFormatter(cell, row, rowIndex, formatExtraData) {
    if (cell === null) {
      return <span>{formatExtraData[cell]}</span>;
    }

    return <span>{cell}</span>;
  }

  userSearch = async e => {
    e.preventDefault();
    const params = { searchKeyword: this.state.userSearch };
    await postApi("admin/um/searchusers", JSON.stringify(params)).then(res => {
      const {
        data: { data }
      } = res;

      if (data.length !== 0) {
        this.setState({
          users: [...data, { edit: "edit" }],
          errorSearch: false
        });
      } else {
        this.setState({
          users: [],
          errorSearch: true
        });
      }
    });
  };

  async componentDidMount() {
    const params = {
      searchKeyword: "null"
    };
    try {
      this.setState({
        loading: true
      });
      await postApi("admin/um/searchusers", JSON.stringify(params)).then(
        res => {
          const {
            data: { data }
          } = res;

          if (data.length !== 0) {
            this.setState({
              users: [...data],
              errorSearch: false
            });
          } else {
            this.setState({
              users: [],
              errorSearch: true
            });
          }
        }
      );
    } catch {
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  editMode = () => {
    const { columns, editMode } = this.state;
    const addEdit = {
      dataField: "",
      text: "수정",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          this.setState({
            selectRow: row
          });
        }
      },
      headerAlign: (column, colIndex) => "center",
      classes: "edit",
      hidden: true
    };
    const nonEdit = {
      ...addEdit,
      hidden: false
    };

    if (!editMode) {
      this.setState({
        columns: [...columns, nonEdit],
        editMode: true
      });
    } else {
      columns.pop();
      this.setState({
        column: [...columns, addEdit],
        editMode: false
      });
    }
  };

  deleteMode = () => {
    const { columns, deleteMode } = this.state;
    const addDelete = {
      dataField: "",
      text: "삭제",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          this.setState({
            selectRow: row
          });
        }
      },
      headerAlign: (column, colIndex) => "center",
      classes: "delete",
      hidden: true
    };
    const nonDelete = {
      ...addDelete,
      hidden: false
    };

    if (!deleteMode) {
      this.setState({
        columns: [...columns, nonDelete],
        deleteMode: true
      });
    } else {
      columns.pop();
      this.setState({
        column: [...columns, addDelete],
        deleteMode: false
      });
    }
  };

  addMode = () => {
    const { addMode } = this.state;
    this.setState({
      addMode: !addMode
    });
  };

  inputUpdate = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const {
      users,
      columns,
      errorSearch,
      loading,
      selectedRow,
      addMode,
      rightPanel
    } = this.state;

    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="form">
                <form onSubmit={this.userSearch}>
                  <span className="label">사용자 조회</span>
                  <input
                    name="userSearch"
                    placeholder="로그인ID 및 거래처명으로 검색"
                    className="user-search"
                    type="text"
                    onChange={this.inputUpdate}
                  />
                  <button></button>
                </form>
                <div className="utils">
                  <p onClick={this.addMode}>
                    <img src={addUser} alt="add" />
                    <span>등록</span>
                  </p>
                  <p onClick={this.editMode}>
                    <img src={edit} alt="edit" />
                    <span>수정</span>
                  </p>
                  <p onClick={this.deleteMode}>
                    <img src={trash} alt="trash" />
                    <span>삭제</span>
                  </p>
                </div>
              </div>
              <div className="table">
                <div className={errorSearch ? "error active" : "error"}>
                  검색된 데이터가 없습니다
                </div>
                <BootstrapTable
                  wrapperClasses="user-table"
                  keyField="id"
                  data={users}
                  columns={columns}
                  rowEvents={this.getRowData}
                />
              </div>
              <div className={addMode ? "right-panel active" : "right-panel"}>
                <form>
                  <div className="input-div">
                    <p>로그인ID</p>
                    <input
                      type="text"
                      placeholder="ID를 입력해 주세요"
                      name="logid"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                      required
                    />
                  </div>
                  <div className="input-div">
                    <p>비밀번호</p>
                    <input
                      type="text"
                      placeholder="비밀번호를 입력해 주세요"
                      name="passwd"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                      required
                    />
                  </div>
                  <div className="input-div">
                    <p>거래처명</p>
                    <input
                      type="text"
                      placeholder="거래처명을 입력해 주세요"
                      name="cvnas"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                      required
                    />
                  </div>
                  <div className="input-div">
                    <p>거래처코드</p>
                    <input
                      type="text"
                      placeholder="ID를 입력해 주세요"
                      name="cvcod"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                      required
                    />
                  </div>
                  <div className="input-div">
                    <p>권한구분</p>
                  </div>
                  <div className="input-div">
                    <p>거래처구분</p>
                  </div>
                  <div className="input-div">
                    <p>핸드폰</p>
                    <input
                      type="tel"
                      placeholder="ID를 입력해 주세요"
                      name="hphone"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                    />
                  </div>
                  <div className="input-div">
                    <p>회사전화</p>
                    <input
                      type="tel"
                      placeholder="ID를 입력해 주세요"
                      name="telno"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                    />
                  </div>
                  <div className="input-div">
                    <p>이메일</p>
                    <input
                      type="email"
                      placeholder="이메일을 입력해 주세요"
                      name="email"
                      spellCheck="false"
                      onChange={this.inputUpdate}
                    />
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
