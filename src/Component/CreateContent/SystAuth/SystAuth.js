import React from "react";
import Loading from "../../Loading";
import BootstrapTable from "react-bootstrap-table-next";
import { postApi, getApi } from "../../../api";
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
    selected: []
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
    const { authList, toDeleteList } = this.state;
    const diffVal = authList.map(list => {
      return list.useyn;
    });
    const diffList = authList.some((useyn, index) => {
      return diffVal.indexOf(index) !== index;
    });
    console.log(diffList);
  };

  detectCheck = array => {
    const useyn = array.map((list, index) => {
      if (list.useyn === "Y") {
        return index;
      }
    });
    const checkedList = useyn.filter(list => list !== undefined);
    this.setState({
      checkedList
    });
  };

  async componentDidMount() {
    await postApi(`admin/uam/programofuser/system`, {})
      .then(res => {
        const {
          data: { data }
        } = res;
        this.detectCheck(data);
        this.setState({
          authList: data,
          loading: false,
          userId: "system",
          cvnas: "(주)삼보모토스"
        });
      })
      .catch(err => {});
  }

  render() {
    const {
      loading,
      errorSearch,
      authList,
      columns,
      userList,
      checkedList,
      selectRow
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
                      selected: checkedList,
                      onSelect: (row, isSelect, rowIndex, e) => {
                        if (row.useyn === "Y") {
                          row.useyn = "N";
                          this.toDeleteList(row);
                        } else if (row.useyn === "N") {
                          row.useyn = "Y";
                          this.toDeleteList(row);
                        }
                      }
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
