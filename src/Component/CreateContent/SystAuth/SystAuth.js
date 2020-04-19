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
    innerLoading: true,
  };

  // LiveSearch 상속 필수 메소드, result를 부모(현재 컴포넌트)로 보냄
  inputs = {
    liveResult: (result) => {
      this.setState({
        userId: result,
      });
    },
  };

  // 사용자를 조회하여 프로그램 리스트를 가져옴
  setSearchId = async (e) => {
    const { userId } = this.state;
    this.setState({
      innerloading: true,
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

  // 체크박스를 클릭하면 변경된 데이터들을 쌓음
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

  // useyn값을 number번호로 만들어 배열에 담아
  // bootstrap이 체크박스를 작동할 수 있도록 만드는 메소드
  detectCheck = (array) => {
    const useyn = array.filter((list) => list.useyn === "Y");
    const checkedList = useyn.map((list) => list.index);
    this.setState({
      checkedList,
    });
  };

  // 저장시 유저의 현재 리스트를 다시 요청, 수정한 배열과 비교하여 바뀐 배열을 보냄
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
      this.setState({
        innerLoading: true,
      });
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
    const { authList, columns, innerLoading } = this.state;
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
                  onSelectAll: async (isSelect, rows, e) => {
                    let chklist;
                    let checkAll;
                    const { authList } = this.state;
                    let rowsString = JSON.stringify(authList);

                    if (isSelect) {
                      checkAll = authList.map((list) => parseInt(list.index));
                      rowsString = rowsString.replace(/"N"/g, '"Y"');
                    } else {
                      checkAll = [];
                      rowsString = rowsString.replace(/"Y"/g, '"N"');
                    }

                    chklist = JSON.parse(rowsString);

                    this.setState({
                      authList: chklist,
                      checkedList: checkAll,
                    });
                  },
                }}
              />
            </div>
          </form>
        </div>
      </>
    );
  }
}
