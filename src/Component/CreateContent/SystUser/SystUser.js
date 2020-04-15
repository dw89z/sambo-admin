import React from "react";
import InnerLoading from "../../InnerLoading";
import BootstrapTable from "react-bootstrap-table-next";
import addUser from "../../../assets/img/add.svg";
import { postApi, deleteApi } from "../../../api";
import "./SystUser.scss";
import RightPanel from "./RightPanel";
import edit from "../../../assets/img/edit.svg";
import trash from "../../../assets/img/trash.svg";

export default class extends React.Component {
  state = {
    errorSearch: false,
    loading: true,
    userSearch: this.props.user.userinfo.logid,
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
        sort: true,
      },
      {
        dataField: "passwd",
        text: "비밀번호",
        sort: true,
      },
      {
        dataField: "cvnas",
        text: "거래처명",
        sort: true,
      },
      {
        dataField: "cvcod",
        text: "거래처코드",
        sort: true,
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
          2: "사용자",
        },
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
          1: "구매",
        },
      },
      {
        dataField: "hphone",
        text: "핸드폰",
        sort: true,
        formatter: this.noneFormatter,
        formatExtraData: {
          null: "-",
        },
      },
      {
        dataField: "telno",
        text: "전화번호",
        sort: true,
        formatter: this.noneFormatter,
        formatExtraData: {
          null: "-",
        },
      },
      {
        dataField: "email",
        text: "이메일",
        sort: true,
        formatter: this.noneFormatter,
        formatExtraData: {
          null: "-",
        },
      },
      {
        dataField: "edit",
        text: "수정",
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            const { openEdit } = this.state;
            this.setState({
              selectedRow: row,
              openEdit: !openEdit,
              addMode: false,
              rightPanel: "사용자 수정",
            });
          },
        },
        headerAlign: (column, colIndex) => "center",
        classes: "edit",
      },
      {
        dataField: "delete",
        text: "삭제",
        events: {
          onClick: async (e, column, columnIndex, row, rowIndex) => {
            try {
              await deleteApi("admin/um/user", row.logid);
            } catch (error) {
              alert(error);
            } finally {
              const data = {
                searchKeyword: this.state.userSearch,
              };
              this.setState({
                loading: true,
              });
              await postApi("admin/um/searchusers", data).then((res) => {
                const {
                  data: { data },
                } = res;
                if (data.length !== 0) {
                  this.setState({
                    users: [...data],
                    errorSearch: false,
                    loading: false,
                  });
                } else {
                  this.setState({
                    users: [],
                    errorSearch: true,
                    loading: false,
                  });
                }
              });
            }
          },
        },
        headerAlign: (column, colIndex) => "center",
        classes: "delete",
      },
    ],
    rightPanel: "사용자 등록",
    req: false,
  };

  // 빈 문자열일 경우 cell에 "-" 스트링 추가
  noneFormatter(cell, row, rowIndex, formatExtraData) {
    if (cell === null) {
      return <span>{formatExtraData[cell]}</span>;
    }
    return <span>{cell}</span>;
  }

  // 수정시에 리스트 갱신 변수 설정
  reqUpdate = () => {
    const { req } = this.state;
    this.setState({
      req: !req,
    });
  };

  // 사용자 조회 섭밋
  userSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const params = { searchKeyword: this.state.userSearch };
    this.setState({
      loading: true,
    });

    await postApi("admin/um/searchusers", params).then((res) => {
      const {
        data: { data },
      } = res;

      if (data.length !== 0) {
        this.setState({
          users: [...data],
          errorSearch: false,
          loading: false,
        });
      } else {
        this.setState({
          users: [],
          errorSearch: true,
          loading: false,
        });
      }
    });
  };

  // editMode = () => {
  //   const { columns, editMode, openEdit } = this.state;
  //   const addEdit = {
  //     dataField: "edit",
  //     text: "수정",
  //     events: {
  //       onClick: (e, column, columnIndex, row, rowIndex) => {
  //         this.setState({
  //           selectedRow: row,
  //           openEdit: !openEdit,
  //           addMode: false,
  //           rightPanel: "사용자 수정",
  //         });
  //       },
  //     },
  //     headerAlign: (column, colIndex) => "center",
  //     classes: "edit",
  //     hidden: true,
  //   };
  //   const nonEdit = {
  //     ...addEdit,
  //     hidden: false,
  //   };

  //   if (!editMode) {
  //     this.setState({
  //       columns: [...columns, nonEdit],
  //       editMode: true,
  //     });
  //   } else {
  //     columns.pop();
  //     this.setState({
  //       column: [...columns, addEdit],
  //       editMode: false,
  //     });
  //   }
  // };

  // deleteMode = () => {
  //   const { columns, deleteMode } = this.state;
  //   const addDelete = {
  //     dataField: "delete",
  //     text: "삭제",
  //     events: {
  //       onClick: async (e, column, columnIndex, row, rowIndex) => {
  //         try {
  //           await deleteApi("admin/um/user", row.logid).then((res) => {});
  //         } catch (error) {
  //           alert(error);
  //         } finally {
  //           const data = {
  //             searchKeyword: this.state.userSearch,
  //           };
  //           this.setState({
  //             loading: true,
  //           });
  //           await postApi("admin/um/searchusers", data).then((res) => {
  //             const {
  //               data: { data },
  //             } = res;
  //             if (data.length !== 0) {
  //               this.setState({
  //                 users: [...data],
  //                 errorSearch: false,
  //                 loading: false,
  //               });
  //             } else {
  //               this.setState({
  //                 users: [],
  //                 errorSearch: true,
  //                 loading: false,
  //               });
  //             }
  //           });
  //         }
  //       },
  //     },
  //     headerAlign: (column, colIndex) => "center",
  //     classes: "delete",
  //     hidden: true,
  //   };
  //   const nonDelete = {
  //     ...addDelete,
  //     hidden: false,
  //   };

  //   if (!deleteMode) {
  //     this.setState({
  //       columns: [...columns, nonDelete],
  //       deleteMode: true,
  //     });
  //   } else {
  //     columns.pop();
  //     this.setState({
  //       column: [...columns, addDelete],
  //       deleteMode: false,
  //     });
  //   }
  // };

  // 인풋 state 업데이트
  inputUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // 등록 모드 작동 함수
  openAddMode = () => {
    const { addMode } = this.state;
    this.setState({
      addMode: !addMode,
      openMode: false,
      rightPanel: "사용자 등록",
    });
  };

  // 등록, 수정 패널을 닫는 함수
  closeAllMode = () => {
    this.setState({
      addMode: false,
      openEdit: false,
      editMode: false,
      selectedRow: {},
    });
  };

  // 수정 모드 작동 함수
  openEditMode = () => {
    const { openEdit } = this.state;
    this.setState({
      openEdit: !openEdit,
      addMode: false,
      rightPanel: "사용자 수정",
    });
  };

  // 수정을 끝냈을 경우 리스트를 다시 불러오는 메소드
  componentDidUpdate(prevProp, prevState) {
    if (this.state.req !== prevState.req) {
      this.userSearch();
    }
  }

  // 컴포넌트 마운트 시 현재 로그인한 ID로 리스트를 요청
  async componentDidMount() {
    const params = {
      searchKeyword: this.props.user.userinfo.logid,
    };
    this.setState({
      loading: true,
    });

    await postApi("admin/um/searchusers", params).then((res) => {
      const {
        data: { data },
      } = res;

      if (data.length !== 0) {
        this.setState({
          users: [...data],
          errorSearch: false,
          loading: false,
        });
      } else {
        this.setState({
          users: [],
          errorSearch: true,
          loading: false,
        });
      }
    });
  }

  // 등록 수정과 같은 작업은 RightPanel에 위임
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
      userSearch,
    } = this.state;

    return (
      <>
        {loading ? <InnerLoading /> : null}
        <div className="content-component syst-user">
          <h2>{this.props.title} (현재 삭제버튼을 누르면 바로 삭제됩니다)</h2>

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
              <button className="search-btn"></button>
            </form>
            <div className="utils">
              <p className="util-button" onClick={this.openAddMode}>
                <img src={addUser} alt="add" />
                <span>등록</span>
              </p>
              {/* <p className="util-button" onClick={this.editMode}>
                    <img src={edit} alt="edit" />
                    <span>수정</span>
                  </p>
                  <p className="util-button" onClick={this.deleteMode}>
                    <img src={trash} alt="trash" />
                    <span>삭제</span>
                  </p> */}
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
              keyField="logid"
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
            reqUpdate={this.reqUpdate}
          />
        </div>
      </>
    );
  }
}
