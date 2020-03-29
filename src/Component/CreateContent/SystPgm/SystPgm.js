import React from "react";
import Loading from "../../Loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { postApi, getApi } from "../../../api";
import "./SystPgm.scss";

export default class extends React.Component {
  state = {
    loading: false,
    innerLoading: false,
    regexp: /^[0-9\b]+$/,
    data: [],
    programdetail: {
      main_id: "10",
      sub1_id: "0",
      sub2_id: "0",
      io_gubun: "M",
      sub2_name: "SCM",
      window_name: "",
      delyn: "N"
    },
    placeholder: {
      main_id: "-",
      sub1_id: "-",
      sub2_id: "-"
    },
    tabIndex: 0,
    innerTabIndex: 0,
    maxMainId: "",
    maxSub1Id: "",
    maxSub2Id: "",
    invalid: {
      mainid: false,
      sub1id: false,
      sub2id: false
    },
    disable: true,
    mainSelect: 10,
    sub1Select: [],
    sub2Select: [],
    radioVisible: false
  };

  tree = {
    getTreeData: async () => {
      await getApi("admin/pm/programlist").then(res => {
        const {
          data: { data }
        } = res;
        const sub1Select = data[0].sublist.map(sub => sub.program);
        const sub1SubList = data[0].sublist.map(sub => sub.sublist);
        const sub2Select = sub1SubList[0].map(sub2 => sub2);
        this.setState({
          data: data,
          sub1Select,
          sub2Select
        });
      });
    },

    treeStr: data => {
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
                    onClick={e => {
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
                            onClick={e => {
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
                                    onClick={e => {
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

    toggleClass: e => {
      let subMenu = e.currentTarget.nextElementSibling;
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    },

    toggleSubClass: e => {
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

    lookupProgram: async e => {
      this.setState({
        tabIndex: 1
      });
      const parent = e.currentTarget.parentNode;
      const data = {
        programdetail: {
          main_id: parent.dataset.mainid,
          sub1_id: parent.dataset.sub1id,
          sub2_id: parent.dataset.sub2id
        }
      };
      const lvlno = parent.dataset.lvlno;
      await postApi("admin/pm/getprogram", data).then(res => {
        const {
          data: {
            data: { program }
          }
        } = res;
        const placeholder = this.state.placeholder;
        if (program.window_name === null) {
          program.window_name = "";
        }

        if (lvlno === "0") {
          this.setState({
            placeholder: {
              main_id: `${program.sub2_name} (${program.main_id})`
            },
            programdetail: program,
            radioVisible: false
          });
        } else if (lvlno === "1") {
          this.setState({
            placeholder: {
              ...placeholder,
              sub1_id: `${program.sub2_name} (${program.sub1_id})`
            },
            programdetail: program,
            radioVisible: false
          });
        } else if (lvlno === "2") {
          this.setState({
            placeholder: {
              ...placeholder,
              sub2_id: `${program.sub2_name} (${program.sub2_id})`
            },
            programdetail: program,
            radioVisible: true
          });
        }
      });
    }
  };

  inputs = {
    inputUpdate: e => {
      const programdetail = this.state.programdetail;
      this.setState({
        programdetail: {
          ...programdetail,
          [e.target.name]: e.target.value
        }
      });
    },

    inputCheck: e => {
      const programdetail = this.state.programdetail;
      if (e.target.checked === true) {
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: "N"
          }
        });
      } else {
        this.setState({
          programdetail: {
            ...programdetail,
            [e.target.name]: "Y"
          }
        });
      }
    },

    inputChange: e => {
      const programdetail = this.state.programdetail;
      this.setState({
        programdetail: {
          ...programdetail,
          [e.target.name]: e.target.value
        }
      });
    },

    inputChangeSub1Handle: e => {
      const programdetail = this.state.programdetail;
      const data = this.state.data;
      const mainid = e.target.value;
      const selected = data.filter(main => {
        return main.program.main_id === mainid;
      });
      const sub1Select = selected[0].sublist.map(sub => sub.program);
      const sub2Arr = selected[0].sublist.map(sub => sub.sublist);
      const sub2Select = sub2Arr[0];

      this.setState({
        programdetail: {
          ...programdetail,
          [e.target.name]: e.target.value
        },
        sub1Select,
        sub2Select,
        mainSelect: mainid
      });
    },

    inputChangeSub2Handle: e => {
      const programdetail = this.state.programdetail;
      const data = this.state.data;
      const mainid = this.state.mainSelect;
      const selected = data.filter(main => {
        return parseInt(main.program.main_id) === parseInt(mainid);
      });
      const sub1Select = selected[0].sublist.filter(sub => {
        return parseInt(sub.program.sub1_id) === parseInt(e.target.value);
      });
      const sub2Select = sub1Select[0].sublist.map(sub2 => sub2);
      this.setState({
        programdetail: {
          ...programdetail,
          [e.target.name]: e.target.value
        },
        sub2Select
      });
    },

    inputMain: e => {
      const mainid = e.target.value;
      const data = this.state.data;
      const invalid = this.state.invalid;
      const limit = data[data.length - 1].program.main_id;
      const programdetail = this.state.programdetail;
      this.setState({
        maxMainId: limit
      });

      if (mainid === "" || this.state.regexp.test(mainid)) {
        this.setState({
          programdetail: {
            ...programdetail,
            main_id: mainid
          }
        });
        if (mainid > limit) {
          this.setState({
            invalid: {
              ...invalid,
              mainid: false
            },
            disable: false
          });
        } else {
          this.setState({
            invalid: {
              ...invalid,
              mainid: true
            },
            disable: true
          });
        }
      }
    },

    inputSub1: e => {
      const sub1id = e.target.value;
      const invalid = this.state.invalid;
      const programdetail = this.state.programdetail;
      const data = this.state.data;
      const selected = data.filter(main => {
        return (
          parseInt(main.program.main_id) === parseInt(programdetail.main_id)
        );
      });
      const sublist = selected.map(selected => selected.sublist);
      const subArr = sublist[0];

      if (subArr.length) {
        const limit = subArr[subArr.length - 1].program.sub1_id;
        this.setState({
          maxSub1Id: limit
        });

        if (sub1id === "" || this.state.regexp.test(sub1id)) {
          this.setState({
            programdetail: {
              ...programdetail,
              sub1_id: sub1id
            }
          });
          if (sub1id > limit) {
            this.setState({
              invalid: {
                ...invalid,
                sub1id: false
              },
              disable: false
            });
          } else {
            this.setState({
              invalid: {
                ...invalid,
                sub1id: true
              },
              disable: true
            });
          }
        }
      } else {
        this.setState({
          programdetail: {
            ...programdetail,
            sub1_id: sub1id
          },
          invalid: {
            ...invalid,
            sub1id: false
          },
          disable: false
        });
      }
    },

    inputSub2: e => {
      const programdetail = this.state.programdetail;
      const sub2Select = this.state.sub2Select;
      const sub2id = e.target.value;
      const invalid = this.state.invalid;
      if (sub2Select.length) {
        const limit = sub2Select[sub2Select.length - 1].sub2_id;
        this.setState({
          maxSub2Id: limit
        });

        if (sub2id === "" || this.state.regexp.test(sub2id)) {
          this.setState({
            programdetail: {
              ...programdetail,
              sub2_id: sub2id
            }
          });
          if (sub2id > limit) {
            this.setState({
              invalid: {
                ...invalid,
                sub2id: false
              },
              disable: false
            });
          } else {
            this.setState({
              invalid: {
                ...invalid,
                sub2id: true
              },
              disable: true
            });
          }
        }
      } else {
        this.setState({
          programdetail: {
            ...programdetail,
            sub2_id: sub2id
          },
          invalid: {
            ...invalid,
            sub2id: false
          },
          disable: false
        });
      }
    },

    inputInOut: e => {
      const programdetail = this.state.programdetail;
      this.setState({
        programdetail: {
          ...programdetail,
          [e.target.name]: e.target.value
        }
      });
    }
  };

  submits = {
    registSubmit: async e => {
      e.preventDefault();
      const programdetail = this.state.programdetail;
      if (programdetail.window_name === "") {
        this.setState({
          programdetail: {
            ...programdetail,
            window_name: null
          }
        });
      }
      try {
        this.setState({
          innerLoading: true
        });
        await postApi("admin/pm/registprogram", {
          programdetail: programdetail
        }).then(res => {
          console.log(res);
        });
      } catch (error) {
        alert(error);
      } finally {
        await this.tree.getTreeData();
        this.setState({
          innerLoading: false
        });
      }
    },

    updateSubmit: async e => {
      e.preventDefault();
      const programdetail = this.state.programdetail;
      if (programdetail.window_name === "") {
        this.setState({
          programdetail: {
            ...programdetail,
            window_name: null
          }
        });
      }
      try {
        this.setState({
          innerLoading: true
        });
        await postApi("admin/pm/updateprogram", {
          programdetail: programdetail
        }).then(res => {
          console.log(res);
        });
      } catch (error) {
        alert(error);
      } finally {
        await this.tree.getTreeData();
        this.setState({
          innerLoading: false
        });
      }
    },

    deleteSubmit: async e => {
      e.preventDefault();
      const programdetail = this.state.programdetail;
      const data = {
        programdetail: {
          main_id: programdetail.main_id,
          sub1_id: programdetail.sub1_id,
          sub2_id: programdetail.sub2_id
        }
      };

      try {
        this.setState({
          innerLoading: true
        });
        await postApi("admin/pm/deleteprogram", data).then(res => {
          console.log(res);
        });
      } catch (error) {
        alert(error);
      } finally {
        await this.tree.getTreeData();
        this.setState({
          innerLoading: false
        });
      }
    }
  };

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
      maxMainId,
      maxSub1Id,
      sub1Select,
      maxSub2Id,
      placeholder,
      radioVisible
    } = this.state;
    const tree = this.tree;
    const inputs = this.inputs;
    const submits = this.submits;
    console.log(programdetail);

    return (
      <>
        <div className="content-component syst-pgm">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="section-wrapper">
                <h5 className="title">프로그램 목록</h5>
                <div className="tree-section">
                  {innerLoading ? <Loading /> : tree.treeStr(data)}
                </div>
                <div className="panel">
                  <Tabs
                    className="pgm-tab"
                    selectedIndex={this.state.tabIndex}
                    onSelect={tabIndex => this.setState({ tabIndex })}
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
                              delyn: "N"
                            }
                          });
                        }}
                      >
                        신규
                      </Tab>
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
                              delyn: "N"
                            }
                          });
                        }}
                      >
                        수정
                      </Tab>
                    </TabList>

                    <TabPanel className="tab-panel">
                      <Tabs
                        selectedIndex={this.state.innerTabIndex}
                        onSelect={tabIndex =>
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
                                  delyn: "N"
                                }
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
                                  delyn: "N"
                                }
                              });
                            }}
                          >
                            중분류
                          </Tab>
                          <Tab
                            className="inner-tab"
                            onClick={() => {
                              this.setState({
                                programdetail: {
                                  main_id: "10",
                                  sub1_id: "10",
                                  sub2_id: "",
                                  io_gubun: "",
                                  sub2_name: "",
                                  window_name: "",
                                  delyn: "N"
                                }
                              });
                            }}
                          >
                            프로그램
                          </Tab>
                        </TabList>
                        <TabPanel>
                          <form onSubmit={submits.registSubmit}>
                            <div className="input-div">
                              <p>대분류 코드</p>
                              <input
                                type="num"
                                placeholder="대분류 코드를 입력해 주세요 (숫자)"
                                name="mainid"
                                spellCheck="false"
                                autoComplete="off"
                                onChange={inputs.inputMain}
                                value={programdetail.main_id}
                                required
                              />
                              <span
                                className={
                                  invalid.mainid ? "error" : "error none"
                                }
                              >
                                대분류 코드는 {maxMainId}보다 커야합니다.
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
                                required
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
                        <TabPanel className="tab-panel">
                          <form onSubmit={submits.registSubmit}>
                            <div className="input-div">
                              <p>대분류 코드</p>
                              <select
                                name="main_id"
                                id="main_id"
                                onChange={inputs.inputChange}
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
                                type="text"
                                placeholder="중분류 코드를 입력해 주세요 (숫자)"
                                name="sub1_id"
                                spellCheck="false"
                                autoComplete="off"
                                value={programdetail.sub1_id}
                                onChange={inputs.inputSub1}
                                required
                              />
                              <span
                                className={
                                  invalid.sub1id ? "error" : "error none"
                                }
                              >
                                중분류 코드는 {maxSub1Id}보다 커야합니다.
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
                                required
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
                        <TabPanel className="tab-panel">
                          <form onSubmit={submits.registSubmit}>
                            <div className="input-div">
                              <p>대분류 코드</p>
                              <select
                                name="main_id"
                                id="main_id"
                                onChange={inputs.inputChangeSub1Handle}
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
                                onChange={inputs.inputChangeSub2Handle}
                              >
                                {sub1Select.map((sub, index) => (
                                  <option value={sub.sub1_id} key={index}>
                                    {sub.window_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="input-div">
                              <p>소분류 코드</p>
                              <input
                                type="num"
                                placeholder="소분류 코드를 입력해 주세요 (숫자)"
                                name="sub2_id"
                                spellCheck="false"
                                autoComplete="off"
                                onChange={inputs.inputSub2}
                                required
                              />
                              <span
                                className={
                                  invalid.sub2id ? "error" : "error none"
                                }
                              >
                                소분류 코드는 {maxSub2Id}보다 커야합니다.
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
                                required
                              />
                            </div>

                            <div className="input-div">
                              <p>WINDOW-ID</p>
                              <input
                                type="text"
                                placeholder="프로그램 아이디를 입력해 주세요"
                                name="window_name"
                                spellCheck="false"
                                onChange={inputs.inputUpdate}
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
                                    onChange={inputs.inputInOut}
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
                                    onChange={inputs.inputInOut}
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
                                    onChange={inputs.inputInOut}
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
                                required
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
                            type="text"
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
                            required
                          />
                        </div>

                        <div
                          className={
                            radioVisible ? "input-div" : "input-div hidden"
                          }
                        >
                          <p>WINDOW-ID</p>
                          <input
                            type="text"
                            placeholder="프로그램 아이디를 수정할 수 있습니다"
                            name="window_name"
                            value={programdetail.window_name}
                            spellCheck="false"
                            onChange={inputs.inputUpdate}
                          />
                        </div>

                        {radioVisible ? (
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
                                  onChange={inputs.inputInOut}
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
                                  onChange={inputs.inputInOut}
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
                                  onChange={inputs.inputInOut}
                                  required
                                />
                                <label htmlFor="output">출력</label>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="input-div">
                          <p>프로그램 사용여부</p>
                          <input
                            type="checkbox"
                            name="delyn"
                            checked={programdetail.delyn === "N" ? true : false}
                            onChange={inputs.inputCheck}
                            required
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
