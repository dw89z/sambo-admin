import React from "react";
import Loading from "../../Loading";
import InnerLoading from "../../InnerLoading";
import BootstrapTable from "react-bootstrap-table-next";
import { postApi, getApi, putApi } from "../../../api";
import "./SystAuth.scss";
import LiveSearch from "../common/LiveSeach";

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
        hidden: true,
      },
      {
        dataField: "window_name",
        text: "프로그램명",
        sort: true,
      },
      {
        dataField: "window_id",
        text: "프로그램ID",
        sort: true,
      },
      {
        dataField: "main_id",
        text: "거래처명",
        sort: true,
        hidden: true,
      },
      {
        dataField: "sub1_id",
        text: "거래처명",
        sort: true,
        hidden: true,
      },
      {
        dataField: "sub2_id",
        text: "거래처명",
        sort: true,
        hidden: true,
      },
    ],
    userList: {
      visible: false,
      list: [],
    },
    toDeleteList: [],
    checkedList: [],
    selected: [],
    done: "정상적으로 처리를 완료하였습니다.",
    innerLoading: false,
  };

  inputs = {
    liveResult: (result) => {
      this.setState({
        userId: result,
      });
    },
  };

  setSearchId = async (e) => {
    const { userId } = this.state;
    this.setState({
      loading: true,
    });

    await postApi(`admin/uam/programofuser/${userId}`, {})
      .then((res) => {
        const {
          data: { data },
        } = res;
        if (!res.data.errorMessage) {
          this.detectCheck(data);
          this.setState({
            authList: data,
            userList: {
              visible: false,
            },
            loading: false,
            innerLoading: false,
          });
        }
      })
      .catch((err) => console.log(err));
    await getApi(`admin/um/user/${userId}`).then((res) => {
      const {
        data: {
          data: { userinfo },
        },
      } = res;
      this.setState({
        userId: userinfo.logid,
        cvnas: userinfo.cvnas,
      });
    });
  };

  toDeleteList = (row, isSelect) => {
    const { checkedList } = this.state;
    if (!isSelect) {
      row.useyn = "N";
      const deleteRow = checkedList.filter((check) => {
        return check !== row.index;
      });
      this.setState({
        checkedList: deleteRow,
      });
    } else {
      row.useyn = "Y";
      const checkedList = this.state.checkedList;
      checkedList.push(row.index);
      checkedList.sort((a, b) => a - b);
      this.setState({
        checkedList,
      });
    }
  };

  toggleAll = (isSelect) => {
    const { authList } = this.state;
    const checkboxAll = document.getElementsByClassName(
      "selection-cell-header"
    );
    const input = checkboxAll[0].children;
    console.log(input[0]);
    input[0].style.display = "none !important";
    setTimeout(() => {}, 1000);

    if (isSelect) {
      const useYAll = authList.map((list) => {
        list["useyn"] = "Y";
        return list;
      });
      const checkAll = authList.map((list) => parseInt(list.index));
      this.setState(
        {
          authList: useYAll,
          checkedList: checkAll,
        },
        () => console.log(this.state.authList)
      );
    } else {
      const useNAll = authList.map((list) => {
        list["useyn"] = "N";
        return list;
      });

      this.setState(
        {
          authList: useNAll,
          checkedList: [],
        },
        () => console.log(this.state.authList)
      );
    }
  };

  detectCheck = (array) => {
    const useyn = array.filter((list) => list.useyn === "Y");
    const checkedList = useyn.map((list) => list.index);
    this.setState({
      checkedList,
    });
  };

  updateSumbit = async (e) => {
    e.preventDefault();
    const { authList, userId } = this.state;
    this.setState({
      innerLoading: true,
    });

    try {
      await postApi(`admin/uam/programofuser/${userId}`, {})
        .then((res) => {
          const {
            data: { data },
          } = res;
          let result = [];
          for (let i in authList) {
            if (authList[i].useyn !== data[i].useyn) {
              result.push(authList[i]);
            }
          }

          this.setState({
            result,
            innerLoading: false,
          });

          if (!res.data.errorCode) {
            this.props.done(this.state.done);
          } else {
            this.props.error(res.data.errorMessage);
          }
        })
        .catch((err) => {});
    } catch (error) {
    } finally {
      await putApi(`admin/uam/programofuser/${userId}`, {
        programs: this.state.result,
      });
    }
  };

  componentDidUpdate(prevProp, prevState) {
    if (prevState.userId !== this.state.userId) {
      this.setSearchId();
    }
  }

  async componentDidMount() {
    const userinfo = this.props.user.userinfo;
    await postApi(`admin/uam/programofuser/${userinfo.logid}`, {})
      .then((res) => {
        const {
          data: { data },
        } = res;
        this.detectCheck(data);
        this.setState({
          authList: data,
          loading: false,
          userId: userinfo.logid,
          cvnas: userinfo.cvnas,
        });
      })
      .catch((err) => alert(err));
  }

  render() {
    const { loading, authList, columns, innerLoading } = this.state;
    const { userinfo } = this.props.user;
    const inputs = this.inputs;

    return (
      <>
        {innerLoading ? <InnerLoading /> : null}
        <div className="content-component syst-auth">
          <h2>{this.props.title}</h2>
          <form onSubmit={this.updateSumbit}>
            <div className="form">
              <span className="label">사용자 조회</span>
              <LiveSearch user={userinfo} liveResult={inputs.liveResult} />
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
                      this.toDeleteList(row, isSelect);
                    },
                    onSelectAll: (isSelect, rows, e) => {
                      this.toggleAll(isSelect);
                    },
                  }}
                />
              )}
            </div>
          </form>
        </div>
      </>
    );
  }
}
