import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import edit from "../../../assets/img/edit.svg";
import addUser from "../../../assets/img/add.svg";
import trash from "../../../assets/img/trash.svg";
import { postApi, deleteApi } from "../../../api";
import "./SystUser.scss";
import RightPanel from "./RightPanel";

export default class extends React.Component {
  state = {
    errorSearch: false,
    loading: true,
    userSearch: "test",
    users: [],
    selectedRow: {},
    editMode: false,
    deleteMode: false,
    toDelete: "",
    addMode: false,
    openEdit: false,
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
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return <span>{formatExtraData[cell]}</span>;
        },
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
        dataField: "edit",
        text: "수정",
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.setState({
              selectedRow: row
            });
          }
        },
        headerAlign: (column, colIndex) => "center",
        classes: "edit",
        hidden: true
      },
      {
        dataField: "delete",
        text: "삭제",
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.setState({
              selectedRow: row
            });
          }
        },
        headerAlign: (column, colIndex) => "center",
        classes: "delete",
        hidden: true
      }
    ],
    rightPanel: "사용자 등록"
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
    try {
      this.setState({
        loading: true
      });
      await postApi("admin/um/searchusers", params).then(res => {
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
      });
    } catch {
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  inputUpdate = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  editMode = () => {
    const { columns, editMode, openEdit } = this.state;
    const addEdit = {
      dataField: "edit",
      text: "수정",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          this.setState({
            selectedRow: row,
            openEdit: !openEdit,
            addMode: false,
            rightPanel: "사용자 수정"
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
      dataField: "delete",
      text: "삭제",
      events: {
        onClick: async (e, column, columnIndex, row, rowIndex) => {
          try {
            console.log(row.logid);
            await deleteApi("admin/um/user", row.logid).then(res => {
              console.log(res.data);
            });
          } catch (error) {
            alert(error);
          } finally {
            const data = {
              searchKeyword: this.state.userSearch
            };
            this.setState({
              loading: true
            });
            await postApi("admin/um/searchusers", data).then(res => {
              const {
                data: { data }
              } = res;
              if (data.length !== 0) {
                this.setState({
                  users: [...data],
                  errorSearch: false,
                  loading: false
                });
              } else {
                this.setState({
                  users: [],
                  errorSearch: true,
                  loading: false
                });
              }
            });
          }
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

  openAddMode = () => {
    const { addMode } = this.state;
    this.setState({
      addMode: !addMode,
      openMode: false,
      rightPanel: "사용자 등록"
    });
  };

  closeAllMode = () => {
    this.setState({
      addMode: false,
      openEdit: false,
      editMode: false,
      selectedRow: {}
    });
  };

  openEditMode = () => {
    const { openEdit } = this.state;
    this.setState({
      openEdit: !openEdit,
      addMode: false,
      rightPanel: "사용자 수정"
    });
  };

  async componentDidMount() {
    const params = {
      searchKeyword: "test"
    };
    try {
      this.setState({
        loading: true
      });
      await postApi("admin/um/searchusers", params).then(res => {
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
      });
    } catch {
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const {
      users,
      columns,
      errorSearch,
      loading,
      selectedRow,
      addMode,
      openEdit,
      rightPanel,
      userSearch
    } = this.state;

    return (
      <>
        <div className="content-component syst-user">
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
                    className="user-search main-search"
                    type="text"
                    value={userSearch}
                    onChange={this.inputUpdate}
                  />
                  <button></button>
                </form>
                <div className="utils">
                  <p onClick={this.openAddMode}>
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
                  wrapperClasses={
                    this.props.menuAxis ? "user-table" : "user-table left"
                  }
                  keyField="id"
                  data={users}
                  columns={columns}
                />
              </div>
              <RightPanel
                addMode={addMode}
                openEdit={openEdit}
                title={rightPanel}
                closeAllMode={this.closeAllMode}
                selectedRow={selectedRow}
                menuAxis={this.props.menuAxis}
                user={selectedRow}
                done={this.props.done}
                error={this.props.error}
              />
            </>
          )}
        </div>
      </>
    );
  }
}
