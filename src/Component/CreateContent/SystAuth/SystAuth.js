import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import { postApi, deleteApi, getApi } from "../../../api";
import "./SystAuth.scss";

export default class extends React.Component {
  state = {
    loading: false,
    typing: false,
    typingTimeout: 0,
    userId: "",
    cvnas: "",
    errorSearch: false,
    authList: [],
    columns: [
      {
        dataField: "useyn",
        text: "거래처명",
        sort: true,
        editor: {
          type: Type.CHECKBOX,
          value: "Y:N"
        },
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return <span>{formatExtraData[cell]}</span>;
        },
        formatExtraData: {
          Y: "사용",
          N: "미사용"
        }
      },
      {
        dataField: "window_name",
        text: "프로그램명",
        sort: true
      },
      {
        dataField: "window_id",
        text: "프로그램ID",
        sort: true
      },
      {
        dataField: "main_id",
        text: "거래처명",
        sort: true,
        hidden: true
      },
      {
        dataField: "sub1_id",
        text: "거래처명",
        sort: true,
        hidden: true
      },
      {
        dataField: "sub2_id",
        text: "거래처명",
        sort: true,
        hidden: true
      }
    ],
    userList: {
      visible: false,
      list: []
    }
  };

  inputUpdate = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  inputUpdateId = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    const value = e.target.value;

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      typingTimeout: setTimeout(async () => {
        if (value !== "") {
          const userId = {
            searchKeyword: value.trim()
          };
          await postApi("admin/um/searchusers", JSON.stringify(userId)).then(
            res => {
              const {
                data: { data }
              } = res;
              this.setState({
                userList: {
                  visible: true,
                  list: data
                }
              });
            }
          );
        } else if (value === "") {
          this.setState({
            userList: {
              visible: false,
              list: []
            }
          });
        }
      }, 300)
    });
  };

  setSearchId = async e => {
    const userId = e.currentTarget.getAttribute("data-logid");

    await postApi(`admin/uam/programofuser/${userId}`, {})
      .then(res => {
        const {
          data: { data }
        } = res;
        this.setState({
          authList: data,
          userList: {
            visible: false
          }
        });
      })
      .catch(err => console.log(err));
    await getApi(`admin/um/user/${userId}`).then(res => {
      const {
        data: {
          data: { userinfo }
        }
      } = res;

      this.setState({
        userId: userinfo.logid,
        cvnas: userinfo.cvnas
      });
    });
  };

  async componentDidMount() {
    await postApi(`admin/uam/programofuser/test`, {})
      .then(res => {
        this.setState({
          authList: res.data.data
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { loading, errorSearch, authList, columns, userList } = this.state;

    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="form">
                <span className="label">사용자 조회</span>
                <input
                  name="userId"
                  placeholder="로그인ID로 검색"
                  className="auth-search main-search"
                  type="text"
                  onChange={this.inputUpdateId}
                  value={this.state.userId}
                  autoComplete="off"
                />
                {userList.visible && userList.list ? (
                  <ul className="user-list">
                    {userList.list.map((list, index) => {
                      return (
                        <li
                          key={index}
                          onClick={this.setSearchId}
                          data-logid={list.logid}
                        >
                          <span>{list.logid}</span>
                          <span>{list.cvnas}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                <div className="user-info">
                  <span>사용자명</span>
                  <span className="info-cvnas">{this.state.cvnas}</span>
                </div>
              </div>
              <div className="table">
                <div className={errorSearch ? "error active" : "error"}>
                  검색된 데이터가 없습니다
                </div>
                <BootstrapTable
                  wrapperClasses={
                    this.props.menuAxis ? "auth-table" : "auth-table left"
                  }
                  keyField="window_name"
                  data={authList}
                  columns={columns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      console.log(row);
                    }
                  })}
                />
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
