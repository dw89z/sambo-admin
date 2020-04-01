import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import { postApi, getApi, putApi } from "../../../api";
import "./SystAuth.scss";

export default class extends React.Component {
  state = {
    loading: true,
    typing: false,
    typingTimeout: 0,
    userId: "",
    cvnas: "",
    errorSearch: false,
    authList: [],
    result: [],
    columns: [
      {
        dataField: "useyn",
        text: "사용여부",
        sort: true,
        hidden: true
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
    },
    toDeleteList: [],
    checkedList: [],
    selected: [],
    done: "정상적으로 처리를 완료하였습니다."
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
          await postApi("admin/um/searchusers", userId).then(res => {
            const {
              data: { data }
            } = res;
            this.setState({
              userList: {
                visible: true,
                list: data
              }
            });
          });
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
    this.setState({
      loading: true
    });

    await postApi(`admin/uam/programofuser/${userId}`, {})
      .then(res => {
        const {
          data: { data }
        } = res;
        if (!res.data.errorMessage) {
          this.detectCheck(data);
          this.setState({
            authList: data,
            userList: {
              visible: false
            },
            loading: false
          });
        }
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

  toDeleteList = row => {
    const { checkedList } = this.state;
    if (row.useyn === "Y") {
      row.useyn = "N";
      const deleteRow = checkedList.filter(check => {
        return check !== row.index;
      });
      this.setState({
        checkedList: deleteRow
      });
    } else if (row.useyn === "N") {
      row.useyn = "Y";
      const checkedList = this.state.checkedList;
      checkedList.push(row.index);
      checkedList.sort((a, b) => a - b);
      this.setState({
        checkedList
      });
    }
  };

  detectCheck = array => {
    const useyn = array.filter(list => list.useyn === "Y");
    const checkedList = useyn.map(list => list.index);
    this.setState({
      checkedList
    });
  };

  updateSumbit = async e => {
    e.preventDefault();
    const { authList, userId } = this.state;
    try {
      await postApi(`admin/uam/programofuser/${userId}`, {})
        .then(res => {
          const {
            data: { data }
          } = res;
          let result = [];
          for (let i in authList) {
            if (authList[i].useyn !== data[i].useyn) {
              result.push(authList[i]);
            }
          }
          this.setState({
            result
          });
          if (!res.data.errorCode) {
            this.props.done(this.state.done);
          } else {
            this.props.error(res.data.errorMessage);
          }
        })
        .catch(err => {});
    } catch (error) {
    } finally {
      await putApi(`admin/uam/programofuser/${userId}`, {
        programs: this.state.result
      });
    }
  };

  async componentDidMount() {
    const userinfo = this.props.user.userinfo;
    await postApi(`admin/uam/programofuser/${userinfo.logid}`, {})
      .then(res => {
        const {
          data: { data }
        } = res;
        this.detectCheck(data);
        this.setState({
          authList: data,
          loading: false,
          userId: userinfo.logid,
          cvnas: userinfo.cvnas
        });
      })
      .catch(err => {});
  }

  render() {
    const { loading, authList, columns, userList } = this.state;

    return (
      <>
        <div className="content-component syst-auth">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              <form onSubmit={this.updateSumbit}>
                <div className="form">
                  <span className="label">사용자 조회</span>
                  <input
                    name="userId"
                    placeholder="로그인ID로 검색"
                    className="auth-search main-search"
                    type="text"
                    onChange={this.inputUpdateId}
                    value={this.state.userId}
                    onKeyPress={e => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    autoComplete="off"
                    spellCheck="false"
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
                  <button className="save">저장</button>
                </div>
                <div className="table">
                  {loading ? (
                    <Loading />
                  ) : (
                    <BootstrapTable
                      bootstrap4
                      wrapperClasses={
                        this.props.menuAxis ? "auth-table" : "auth-table left"
                      }
                      keyField="index"
                      data={authList}
                      columns={columns}
                      selectRow={{
                        mode: "checkbox",
                        clickToSelect: true,
                        selected: this.state.checkedList,
                        onSelect: (row, isSelect, rowIndex, e) => {
                          this.toDeleteList(row);
                        }
                      }}
                    />
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </>
    );
  }
}
