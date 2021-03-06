import React from "react";
import Loading from "../../Loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { postApi, getApi } from "../../../api";
import "./SystPgm.scss";

// 삭제시 하위 뎁스가 없으면 삭제가 안되게

export default class extends React.Component {
  state = {
    loading: false,
    innerLoading: false,
    regexp: /^[0-9\b]+$/,
    data: [],
    programdetail: {
      main_id: "",
      sub1_id: "0",
      sub2_id: "0",
      io_gubun: "M",
      sub2_name: "",
      window_name: "",
      delyn: "Y",
    },
    placeholder: {
      main_id: "-",
      sub1_id: "-",
      sub2_id: "-",
    },
    tabIndex: 0,
    innerTabIndex: 0,
    invalid: {
      main_id: false,
      sub1_id: false,
      sub2_id: false,
    },
    disable: true,
    mainSelect: 10,
    sub1Select: [],
    sub2Select: [],
    radioVisible: false,
    noSub1Id: false,
  };

  // 트리구조 메소드 객체
  tree = {
    // 데이터를 받아와서 각각의 리스트로 저장
    getTreeData: async () => {
      await getApi("admin/pm/programlist").then((res) => {
        const {
          data: { data },
        } = res;
        const sub1Select = data[0].sublist;
        const sub1SubList = data[0].sublist.map((sub) => sub.sublist);
        const sub2Select = sub1SubList[0].map((sub2) => parseInt(sub2.sub2_id));
        this.setState({
          data: data,
          sub1Select,
          sub2Select,
        });
      });
    },

    // 데이터를 ul>li 구조로 표시
    treeStr: (data) => {
      return (
        <>
          {data.map((main, index) => {
            return (
              <ul className="main-depth" key={index}>
                <li
                  key={index}
                  data-lvlno={main.program.lvlno}
                  data-mainid={main.program.main_id}
                  data-sub1id={main.program.sub1_id}
                  data-sub2id={main.program.sub2_id}
                >
                  <p
                    className="top-tree"
                    onClick={(e) => {
                      this.tree.lookupProgram(e);
                      this.tree.toggleClass(e);
                    }}
                  >
                    {main.program.window_name}
                  </p>
                  <ul className="sub-depth">
                    {main.sublist.map((sublist, index) => {
                      return (
                        <li
                          key={index}
                          data-lvlno={sublist.program.lvlno}
                          data-mainid={sublist.program.main_id}
                          data-sub1id={sublist.program.sub1_id}
                          data-sub2id={sublist.program.sub2_id}
                        >
                          <p
                            onClick={(e) => {
                              this.tree.lookupProgram(e);
                              this.tree.toggleSubClass(e);
                            }}
                          >
                            {sublist.program.window_name}
                          </p>
                          <ul className="last-depth">
                            {sublist.sublist.map((last, index) => {
                              return (
                                <li
                                  key={index}
                                  data-lvlno={last.lvlno}
                                  data-mainid={last.main_id}
                                  data-sub1id={last.sub1_id}
                                  data-sub2id={last.sub2_id}
                                >
                                  <p
                                    onClick={(e) => {
                                      this.tree.lookupProgram(e);
                                    }}
                                  >
                                    {last.window_name}
                                  </p>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            );
          })}
        </>
      );
    },

    // main-depth 클릭시의 토글 이벤트, 높이를 계산하여 부모 높이에 포함
    toggleClass: (e) => {
      let subMenu = e.currentTarget.nextElementSibling;
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    },

    // sub-dapth 클릭시의 토글 이벤트, 최하위 list의 높이를 계산하여 최상위 부모 높이에 포함
    toggleSubClass: (e) => {
      let subMenu = e.currentTarget.nextElementSibling;
      let parent = subMenu.parentElement.parentElement;
      let parentHeight = parseInt(parent.style.maxHeight);
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
        let subMenuHeight = parseInt(subMenu.style.maxHeight);
        parent.style.maxHeight = parentHeight + subMenuHeight + "px";
      }
    },

    // 트리구조의 각 depth를 눌렀을 때 해당하는 programdetail을 조작 패널에 바인딩
    lookupProgram: async (e) => {
      this.setState({
        tabIndex: 1,
      });
      const parent = e.currentTarget.parentNode;
      const data = {
        programdetail: {
          main_id: parent.dataset.mainid,
          sub1_id: parent.dataset.sub1id,
          sub2_id: parent.dataset.sub2id,
        },
      };
      const lvlno = parent.dataset.lvlno;
      await postApi("admin/pm/getprogram", data).then((res) => {
        const {
          data: {
            data: { program },
          },
        } = res;
        const placeholder = this.state.placeholder;
        if (program.window_name === null) {
          program.window_name = "";
        }

        if (lvlno === "0") {
          this.setState({
            placeholder: {
              main_id: `${program.sub2_name} (${program.main_id})`,
              sub1_id: "-",
              sub2_id: "-",
            },
            programdetail: program,
            radioVisible: false,
          });
        } else if (lvlno === "1") {
          this.setState({
            placeholder: {
              ...placeholder,
              sub1_id: `${program.sub2_name} (${program.sub1_id})`,
              sub2_id: "-",
            },
            programdetail: program,
            radioVisible: false,
          });
        } else if (lvlno === "2") {
          this.setState({
            placeholder: {
              ...placeholder,
              sub2_id: `${program.sub2_name} (${program.sub2_id})`,
            },
            programdetail: program,
            radioVisible: true,
          });
        }
      });
    },
  };

  // 인풋 메소드 모음 객체
  inputs = {
    // 기본 인풋 state 메소드
    inputUpdate: (e) => {
      const { programdetail } = this.state;
      this.setState({
        programdetail: {
          ...programdetail,
          [e.target.name]: e.target.value,
        },
      });
    },

    // select창에 사용되는 이벤트, main_id와 sub1_id를 조작할때
    // 그에 따른 리스트 세팅, 중복처리 등의 기능을 수행
    inputSelect: (e) => {
      const { programdetail, data, innerTabIndex } = this.state;
      const id = e.target.value;

      if (e.target.name === "main_id") {
        const list = data.filter((data) => {
          let result;
          if (data.program.main_id === id) {
            result = data.sublist;
          }
          return result;
        });
        let sub1Select = [];

        if (list[0].sublist.length !== 0) {
          sub1Select = list[0].sublist;
          const sub2Select = sub1Select[0].sublist.map((sub) => {
            return parseInt(sub.sub2_id);
          });
          console.log(sub1Select);
          this.setState({
            sub2Select,
            noSub1Id: false,
          });
        } else {
          this.setState({
            noSub1Id: true,
          });
        }

        if (innerTabIndex === 1) {
          this.setState({
            programdetail: {
              ...programdetail,
              [e.target.name]: e.target.value,
              sub1_id: "",
              sub2_id: "0",
            },
            invalid: {
              main_id: false,
              sub1_id: false,
              sub2_id: false,
            },
            sub1Select,
          });
        } else {
          this.setState({
            programdetail: {
              ...programdetail,
              [e.target.name]: e.target.value,
              sub1_id: "10",
              sub2_id: "",
            },
            invalid: {
              main_id: false,
              sub1_id: false,
              sub2_id: false,
            },
            sub1Select,
          });
        }
      } else if (e.target.name === "sub1_id") {
        const { sub1Select } = this.state;
        const sublist = sub1Select.filter((sub) => {
          let result;
          if (sub.program.sub1_id === e.target.value) {
            result = sub.sublist;
          }
          return result;
        });
        const sub2list = sublist[0].sublist;
        const sub2Select = sub2list.map((sub) => parseInt(sub.sub2_id));
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: e.target.value,
            sub2_id: "",
          },
          invalid: {
            main_id: false,
            sub1_id: false,
            sub2_id: false,
          },
          sub2Select,
        });
      }
    },

    // validation이 필요한 인풋에 적용되는 유효성 및 중복 검사 함수
    inputMain: (e) => {
      const { data, sub1Select, sub2Select } = this.state;
      const id = parseInt(e.target.value);
      const list = data.map((list) => parseInt(list.program.main_id));

      if (e.target.name === "main_id") {
        this.inputs.inputVali(e, id, list);
      } else if (e.target.name === "sub1_id") {
        const sub1list = sub1Select.map((sub) => parseInt(sub.program.sub1_id));
        this.inputs.inputVali(e, id, sub1list);
      } else if (e.target.name === "sub2_id") {
        this.inputs.inputVali(e, id, sub2Select);
      }
    },

    // 체크박스에 사용되는 메소드, 체크 여부에 따라 Y,N값을 세팅
    inputCheck: (e) => {
      const programdetail = this.state.programdetail;
      if (e.target.checked === true) {
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: "N",
          },
        });
      } else {
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: "Y",
          },
        });
      }
    },

    // inputMain()에 사용되는 유효성 체크 메소드
    inputVali: (e, id, list) => {
      const { programdetail, invalid } = this.state;
      if (id === "" || this.state.regexp.test(id)) {
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: id,
          },
        });
        if (list.includes(id)) {
          this.setState({
            invalid: {
              ...invalid,
              [e.target.name]: true,
            },
            disable: true,
          });
        } else {
          this.setState({
            invalid: {
              ...invalid,
              [e.target.name]: false,
            },
            disable: false,
          });
        }
      } else {
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: "",
          },
        });
      }
    },
  };

  // 섭밋 메소드 모음 객체
  submits = {
    // 등록 요청을 보낼때 사용하는 메소드
    registSubmit: async (e) => {
      e.preventDefault();
      const { programdetail } = this.state;
      if (programdetail.window_name === "") {
        this.setState({
          programdetail: {
            ...programdetail,
            window_name: null,
          },
        });
      }
      try {
        this.setState({
          innerLoading: true,
        });
        await postApi("admin/pm/registprogram", {
          programdetail: programdetail,
        }).then((res) => {
          if (!res.data.errorCode) {
            this.props.done(res.data.data.message);
          } else {
            this.props.error(res.data.errorMessage);
          }
        });
      } catch (error) {
        alert(error);
      } finally {
        await this.tree.getTreeData();
        this.setState({
          innerLoading: false,
        });
      }
    },

    // 수정 요청을 보낼 때 사용하는 메소드
    updateSubmit: async (e) => {
      e.preventDefault();

      const { programdetail } = this.state;
      if (programdetail.window_name === "") {
        this.setState({
          programdetail: {
            ...programdetail,
            window_name: null,
          },
        });
      }
      try {
        this.setState({
          innerLoading: true,
        });
        await postApi("admin/pm/updateprogram", {
          programdetail: programdetail,
        }).then((res) => {
          if (!res.data.errorCode) {
            this.props.done(res.data.data.message);
          } else {
            this.props.error(res.data.errorMessage);
          }
        });
      } catch (error) {
        alert(error);
      } finally {
        await this.tree.getTreeData();
        this.setState({
          innerLoading: false,
        });
      }
    },

    // 삭제 요청을 보낼 때 사용하는 메소드
    deleteSubmit: async (e) => {
      e.preventDefault();
      const { programdetail } = this.state;
      const data = {
        programdetail: {
          main_id: programdetail.main_id,
          sub1_id: programdetail.sub1_id,
          sub2_id: programdetail.sub2_id,
        },
      };

      try {
        this.setState({
          innerLoading: true,
        });
        await postApi("admin/pm/deleteprogram", data).then((res) => {
          if (!res.data.errorCode) {
            this.props.done(res.data.data.message);
          } else {
            this.props.error(res.data.errorMessage);
          }
        });
      } catch (error) {
        alert(error);
      } finally {
        await this.tree.getTreeData();
        this.setState({
          innerLoading: false,
        });
      }
    },
  };

  // 컴포넌트가 마운트되면 트리데이터를 불러와 트리구조를 렌더
  async componentDidMount() {
    this.tree.getTreeData();
  }

  render() {
    const {
      loading,
      innerLoading,
      data,
      programdetail,
      invalid,
      sub1Select,
      placeholder,
      radioVisible,
      noSub1Id,
    } = this.state;
    const tree = this.tree;
    const inputs = this.inputs;
    const submits = this.submits;

    return (
      <>
        <div className="content-component syst-pgm">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="section-wrapper">
                <h5 className="tree-title">프로그램 목록</h5>
                <div className="tree-section">
                  {innerLoading ? <Loading /> : tree.treeStr(data)}
                </div>
                <div className="pgm-panel">
                  <Tabs
                    className="pgm-tab"
                    selectedIndex={this.state.tabIndex}
                    onSelect={(tabIndex) => this.setState({ tabIndex })}
                  >
                    <TabList className="tab-list">
                      <Tab
                        className="tab"
                        onClick={() => {
                          this.setState({
                            programdetail: {
                              main_id: "",
                              sub1_id: "0",
                              sub2_id: "0",
                              io_gubun: "M",
                              sub2_name: "",
                              window_name: "",
                              delyn: "N",
                            },
                            innerTabIndex: 0,
                          });
                        }}
                      >
                        신규
                      </Tab>
                      <Tab
                        className="tab edit"
                        onClick={() => {
                          this.setState({
                            programdetail: {
                              main_id: "",
                              sub1_id: "0",
                              sub2_id: "0",
                              io_gubun: "M",
                              sub2_name: "",
                              window_name: "",
                              delyn: "N",
                            },
                            innerTabIndex: 0,
                          });
                        }}
                        disabled={true}
                      >
                        수정
                      </Tab>
                    </TabList>

                    <TabPanel className="tab-panel">
                      <Tabs
                        selectedIndex={this.state.innerTabIndex}
                        onSelect={(tabIndex) =>
                          this.setState({ innerTabIndex: tabIndex })
                        }
                      >
                        <TabList className="inner-tab-list">
                          <Tab
                            className="inner-tab"
                            onClick={() => {
                              this.setState({
                                programdetail: {
                                  main_id: "",
                                  sub1_id: "0",
                                  sub2_id: "0",
                                  io_gubun: "M",
                                  sub2_name: "",
                                  window_name: "",
                                  delyn: "N",
                                },
                                noSub1Id: false,
                              });
                            }}
                          >
                            업무메뉴
                          </Tab>
                          <Tab
                            className="inner-tab"
                            onClick={() => {
                              this.setState({
                                programdetail: {
                                  main_id: "10",
                                  sub1_id: "",
                                  sub2_id: "0",
                                  io_gubun: "S",
                                  sub2_name: "",
                                  window_name: "",
                                  delyn: "N",
                                },
                                noSub1Id: false,
                              });
                            }}
                          >
                            중분류
                          </Tab>
                          <Tab
                            className="inner-tab"
                            onClick={() => {
                              const { data } = this.state;
                              const sub1Select = data[0].sublist;
                              this.setState({
                                programdetail: {
                                  main_id: "10",
                                  sub1_id: "10",
                                  sub2_id: "",
                                  io_gubun: "",
                                  sub2_name: "",
                                  window_name: "",
                                  delyn: "N",
                                },
                                sub1Select,
                                noSub1Id: false,
                              });
                            }}
                          >
                            프로그램
                          </Tab>
                        </TabList>
                        <TabPanel className="tab-panel main-panel">
                          <form onSubmit={submits.registSubmit}>
                            <div className="input-div">
                              <p>대분류 코드</p>
                              <input
                                type="num"
                                placeholder="대분류 코드를 입력해 주세요 (숫자)"
                                name="main_id"
                                spellCheck="false"
                                autoComplete="off"
                                onChange={inputs.inputMain}
                                value={programdetail.main_id}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                              <span
                                className={
                                  invalid.main_id ? "error" : "error none"
                                }
                              >
                                이미 존재하는 코드입니다
                              </span>
                            </div>

                            <div className="input-div">
                              <p>프로그램명</p>
                              <input
                                type="text"
                                placeholder="프로그램명을 입력해 주세요"
                                name="sub2_name"
                                spellCheck="false"
                                autoComplete="off"
                                value={programdetail.sub2_name}
                                onChange={inputs.inputUpdate}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                            </div>

                            <div className="input-div">
                              <p>프로그램 사용여부</p>
                              <input
                                type="checkbox"
                                name="delyn"
                                checked={
                                  programdetail.delyn === "N" ? true : false
                                }
                                onChange={inputs.inputCheck}
                              />
                            </div>
                            <button
                              className="save"
                              disabled={this.state.disable}
                            >
                              저장
                            </button>
                          </form>
                        </TabPanel>
                        <TabPanel className="tab-panel sub1-panel">
                          <form onSubmit={submits.registSubmit}>
                            <div className="input-div">
                              <p>대분류 코드</p>
                              <select
                                name="main_id"
                                id="main_id"
                                onChange={inputs.inputSelect}
                              >
                                {data.map((main, index) => (
                                  <option
                                    value={main.program.main_id}
                                    key={index}
                                  >
                                    {main.program.window_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="input-div">
                              <p>중분류 코드</p>
                              <input
                                type="num"
                                placeholder="중분류 코드를 입력해 주세요 (숫자)"
                                name="sub1_id"
                                spellCheck="false"
                                autoComplete="off"
                                value={programdetail.sub1_id}
                                onChange={inputs.inputMain}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                              <span
                                className={
                                  invalid.sub1_id ? "error" : "error none"
                                }
                              >
                                이미 존재하는 코드입니다
                              </span>
                            </div>

                            <div className="input-div">
                              <p>프로그램명</p>
                              <input
                                type="text"
                                placeholder="프로그램명을 입력해 주세요"
                                name="sub2_name"
                                spellCheck="false"
                                autoComplete="off"
                                value={programdetail.sub2_name}
                                onChange={inputs.inputUpdate}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                            </div>

                            <div className="input-div">
                              <p>프로그램 사용여부</p>
                              <input
                                type="checkbox"
                                name="delyn"
                                checked={
                                  programdetail.delyn === "N" ? true : false
                                }
                                onChange={inputs.inputCheck}
                              />
                            </div>
                            <button
                              className="save"
                              disabled={this.state.disable}
                            >
                              저장
                            </button>
                          </form>
                        </TabPanel>
                        <TabPanel className="tab-panel sub2-panel">
                          <form onSubmit={submits.registSubmit}>
                            <div className="input-div">
                              <p>대분류 코드</p>
                              <select
                                name="main_id"
                                id="main_id"
                                onChange={inputs.inputSelect}
                              >
                                {data.map((main, index) => (
                                  <option
                                    value={main.program.main_id}
                                    key={index}
                                  >
                                    {main.program.window_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="input-div">
                              <p>중분류 코드</p>
                              <select
                                name="sub1_id"
                                id="sub1_id"
                                onChange={inputs.inputSelect}
                              >
                                {sub1Select.map((sub, index) => {
                                  return (
                                    <option
                                      value={sub.program.sub1_id}
                                      key={index}
                                    >
                                      {sub.program.window_name}
                                    </option>
                                  );
                                })}
                              </select>
                              <span
                                className={noSub1Id ? "error" : "error none"}
                              >
                                중분류가 존재하지 않습니다.
                              </span>
                            </div>

                            <div className="input-div">
                              <p>소분류 코드</p>
                              <input
                                type="num"
                                placeholder="소분류 코드를 입력해 주세요 (숫자)"
                                name="sub2_id"
                                spellCheck="false"
                                autoComplete="off"
                                value={programdetail.sub2_id}
                                onChange={inputs.inputMain}
                                disabled={noSub1Id}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                              <span
                                className={
                                  invalid.sub2_id ? "error" : "error none"
                                }
                              >
                                이미 존재하는 코드입니다
                              </span>
                            </div>

                            <div className="input-div">
                              <p>프로그램명</p>
                              <input
                                type="text"
                                placeholder="프로그램명을 입력해 주세요"
                                name="sub2_name"
                                spellCheck="false"
                                autoComplete="off"
                                onChange={inputs.inputUpdate}
                                disabled={noSub1Id}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                            </div>

                            <div className="input-div">
                              <p className="window-id">WINDOW-ID</p>
                              <input
                                type="text"
                                placeholder="프로그램 아이디를 입력해 주세요"
                                name="window_name"
                                spellCheck="false"
                                onChange={inputs.inputUpdate}
                                disabled={noSub1Id}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                                required
                              />
                            </div>
                            <div className="input-div">
                              <p>입출력 구분</p>
                              <div className="radio-section">
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="io_gubun"
                                    id="input"
                                    value="I"
                                    checked={programdetail.io_gubun === "I"}
                                    onChange={inputs.inputUpdate}
                                    disabled={noSub1Id}
                                    required
                                  />
                                  <label htmlFor="input">입력</label>
                                </div>
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="io_gubun"
                                    id="lookup"
                                    value="Q"
                                    checked={programdetail.io_gubun === "Q"}
                                    onChange={inputs.inputUpdate}
                                    disabled={noSub1Id}
                                    required
                                  />
                                  <label htmlFor="lookup">조회</label>
                                </div>
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="io_gubun"
                                    id="output"
                                    value="P"
                                    checked={programdetail.io_gubun === "P"}
                                    onChange={inputs.inputUpdate}
                                    disabled={noSub1Id}
                                    required
                                  />
                                  <label htmlFor="output">출력</label>
                                </div>
                              </div>
                            </div>
                            <div className="input-div">
                              <p>프로그램 사용여부</p>
                              <input
                                type="checkbox"
                                name="delyn"
                                checked={
                                  programdetail.delyn === "N" ? true : false
                                }
                                onChange={inputs.inputCheck}
                                disabled={noSub1Id}
                              />
                            </div>
                            <button
                              className="save"
                              disabled={this.state.disable}
                            >
                              저장
                            </button>
                          </form>
                        </TabPanel>
                      </Tabs>
                    </TabPanel>

                    {/* 수정패널 */}
                    <TabPanel className="tab-panel">
                      <form onSubmit={submits.updateSubmit}>
                        <div className="input-div">
                          <p>대분류 코드</p>
                          <input
                            type="num"
                            placeholder="-"
                            value={placeholder.main_id}
                            name="main_id"
                            spellCheck="false"
                            autoComplete="off"
                            onChange={this.inputUpdate}
                            onKeyPress={(e) => {
                              e.which === 13 && e.preventDefault();
                            }}
                            required
                            readOnly
                          />
                        </div>

                        <div className="input-div">
                          <p>중분류 코드</p>
                          <input
                            type="text"
                            placeholder="-"
                            name="sub1_id"
                            value={placeholder.sub1_id}
                            spellCheck="false"
                            required
                            readOnly
                          />
                        </div>

                        <div className="input-div">
                          <p>소분류 코드</p>
                          <input
                            type="num"
                            placeholder="-"
                            name="sub2_id"
                            value={placeholder.sub2_id}
                            spellCheck="false"
                            required
                            readOnly
                          />
                        </div>

                        <div className="input-div">
                          <p>프로그램명</p>
                          <input
                            type="text"
                            placeholder="프로그램명을 수정할 수 있습니다"
                            name="sub2_name"
                            value={programdetail.sub2_name}
                            onChange={inputs.inputUpdate}
                            spellCheck="false"
                            onKeyPress={(e) => {
                              e.which === 13 && e.preventDefault();
                            }}
                            required
                          />
                        </div>

                        {radioVisible ? (
                          <>
                            <div className="input-div ">
                              <p className="window-id">WINDOW-ID</p>
                              <input
                                type="text"
                                placeholder="프로그램 아이디를 수정할 수 있습니다"
                                name="window_name"
                                value={programdetail.window_name}
                                spellCheck="false"
                                onChange={inputs.inputUpdate}
                                onKeyPress={(e) => {
                                  e.which === 13 && e.preventDefault();
                                }}
                              />
                            </div>
                            <div className="input-div">
                              <p>입출력 구분</p>
                              <div className="radio-section">
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="io_gubun"
                                    id="input"
                                    value="I"
                                    checked={programdetail.io_gubun === "I"}
                                    onChange={inputs.inputUpdate}
                                    required
                                  />
                                  <label htmlFor="input">입력</label>
                                </div>
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="io_gubun"
                                    id="lookup"
                                    value="Q"
                                    checked={programdetail.io_gubun === "Q"}
                                    onChange={inputs.inputUpdate}
                                    required
                                  />
                                  <label htmlFor="lookup">조회</label>
                                </div>
                                <div className="radio">
                                  <input
                                    type="radio"
                                    name="io_gubun"
                                    id="output"
                                    value="P"
                                    checked={programdetail.io_gubun === "P"}
                                    onChange={inputs.inputUpdate}
                                    required
                                  />
                                  <label htmlFor="output">출력</label>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}

                        <div className="input-div">
                          <p>프로그램 사용여부</p>
                          <input
                            type="checkbox"
                            name="delyn"
                            checked={programdetail.delyn === "N" ? true : false}
                            onChange={inputs.inputCheck}
                          />
                        </div>
                        <button className="save">저장</button>
                        <button
                          className="save delete"
                          onClick={submits.deleteSubmit}
                        >
                          삭제
                        </button>
                      </form>
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
