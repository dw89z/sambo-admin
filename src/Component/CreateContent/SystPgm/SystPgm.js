import React from "react";
import Loading from "../../Loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { postApi, putApi, getApi } from "../../../api";
import "./SystPgm.scss";
import { SubmitButton } from "react-dropzone-uploader";

export default class extends React.Component {
  state = {
    loading: false,
    regexp: /^[0-9\b]+$/,
    data: [],
    programdetail: {
      main_id: 10,
      sub1_id: 0,
      sub2_id: 0,
      io_gubun: "M",
      sub2_name: "SCM",
      window_name: "",
      delyn: "N"
    },
    tabIndex: 0,
    innerTabIndex: 1,
    maxMainId: "",
    maxSub1Id: "",
    maxSub2Id: "",
    invalid: {
      mainid: false,
      sub1id: false,
      sub2id: false
    },
    disable: true
  };

  tree = {
    getTreeData: async () => {
      await getApi("admin/pm/programlist").then(res => {
        const {
          data: { data }
        } = res;
        this.setState({
          data: data
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
                  <p onClick={this.tree.toggleClass}>
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
                          <p onClick={this.tree.toggleSubClass}>
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
                                  <p>{last.window_name}</p>
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
    }
  };

  inputs = {
    init: e => {
      this.setState({
        programdetail: {
          main_id: 10,
          sub1_id: "",
          sub2_id: "",
          io_gubun: "M",
          sub2_name: "SCM",
          window_name: "",
          delyn: "N"
        }
      });
    },

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

    // inputSub1: e => {
    //   const sub1id = e.target.value;
    //   const invalid = this.state.invalid;
    //   const programdetail = this.state.programdetail;
    //   const data = this.state.data;

    //   const selected = data.filter(main => {
    //     console.log(programdetail.main_id);
    //     return parseInt(main.program.main_id) === programdetail.main_id;
    //   });
    //   console.log(data);

    //   const sublist = selected.map(selected => selected.sublist);
    //   const subArr = sublist[0];
    //   const limit = subArr[subArr.length - 1].program.sub1_id;
    // },

    inputSub1: e => {
      const sub1id = e.target.value;
      const invalid = this.state.invalid;
      const programdetail = this.state.programdetail;
      const data = this.state.data;
      const selected = data.filter(main => {
        console.log(main.program.main_id, programdetail.main_id);
        return parseInt(main.program.main_id) === programdetail.main_id;
      });
      console.log(selected);
      const sublist = selected.map(selected => selected.sublist);
      const subArr = sublist[0];
      let limit;
      // if (subArr.length) {
      //   limit = subArr[subArr.length - 1].program.sub1_id;
      //   this.setState({
      //     maxSub1Id: limit
      //   });
      // } else {
      //   this.setState({
      //     maxSub1Id: ""
      //   });
      // }

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
    }
  };

  submits = {
    mainSubmit: async e => {
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
      await postApi("admin/pm/registprogram", {
        programdetail: programdetail
      }).then(res => {
        console.log(res);
      });
    }
  };

  lookupProgram = e => {
    const data = {
      programdetail: {
        main_id: 10,
        sub1_id: 0,
        sub2_id: 0
      }
    };
    postApi("admin/pm/getprogram", data).then();
  };

  async componentDidMount() {
    this.tree.getTreeData();
    this.lookupProgram();
  }

  render() {
    const {
      loading,
      data,
      programdetail,
      invalid,
      maxMainId,
      maxSub1Id,
      maxSub2Id,
      innerTabIndex
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
                <h5 className="title">프로그램 목록</h5>
                <div className="tree-section">{tree.treeStr(data)}</div>
                <div className="panel">
                  <Tabs
                    className="pgm-tab"
                    selectedIndex={this.state.tabIndex}
                    onSelect={tabIndex => this.setState({ tabIndex })}
                  >
                    <TabList className="tab-list">
                      <Tab className="tab">신규</Tab>
                      <Tab className="tab">수정</Tab>
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
                                  sub1_id: 0,
                                  sub2_id: 0,
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
                          <Tab className="inner-tab" onClick={inputs.init}>
                            중분류
                          </Tab>
                          <Tab className="inner-tab" onClick={inputs.init}>
                            프로그램
                          </Tab>
                        </TabList>
                        <TabPanel>
                          <form onSubmit={submits.mainSubmit}>
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
                          <form>
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
                                name="cvnas"
                                spellCheck="false"
                                autoComplete="off"
                                onChange={this.inputUpdate}
                                required
                              />
                            </div>

                            <div className="input-div">
                              <p>프로그램 사용여부</p>
                              <input
                                type="checkbox"
                                placeholder="프로그램명을 입력해 주세요"
                                name="cvnas"
                                spellCheck="false"
                                autoComplete="off"
                                onChange={this.inputUpdate}
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
                              placeholder="중분류 코드를 입력해 주세요"
                              name="cvcod"
                              spellCheck="false"
                              autoComplete="off"
                              onChange={this.inputUpdateCod}
                              required
                            />
                          </div>

                          <div className="input-div">
                            <p>소분류 코드</p>
                            <input
                              type="text"
                              placeholder="소분류 코드를 입력해 주세요"
                              name="cvnas"
                              spellCheck="false"
                              autoComplete="off"
                              onChange={this.inputUpdate}
                              required
                            />
                          </div>

                          <div className="input-div">
                            <p>프로그램명</p>
                            <input
                              type="text"
                              placeholder="프로그램명을 입력해 주세요"
                              name="cvnas"
                              spellCheck="false"
                              autoComplete="off"
                              onChange={this.inputUpdate}
                              required
                            />
                          </div>

                          <div className="input-div">
                            <p>WINDOW-ID</p>
                            <input
                              type="tel"
                              placeholder="핸드폰 번호를 입력해 주세요"
                              name="hphone"
                              spellCheck="false"
                              onChange={this.inputUpdate}
                            />
                          </div>
                          <div className="input-div">
                            <p>입출력 구분</p>
                            <div className="radio-section">
                              <div className="radio">
                                <input
                                  type="radio"
                                  name="auth"
                                  id="normal"
                                  value="0"
                                  onChange={this.inputUpdate}
                                  required
                                />
                                <label htmlFor="normal">입력</label>
                              </div>
                              <div className="radio">
                                <input
                                  type="radio"
                                  name="auth"
                                  id="admin"
                                  value="1"
                                  onChange={this.inputUpdate}
                                  required
                                />
                                <label htmlFor="admin">조회</label>
                              </div>
                              <div className="radio">
                                <input
                                  type="radio"
                                  name="auth"
                                  id="corop"
                                  value="2"
                                  onChange={this.inputUpdate}
                                  required
                                />
                                <label htmlFor="corop">출력</label>
                              </div>
                            </div>
                          </div>
                          <div className="input-div">
                            <p>프로그램 사용여부</p>
                            <input
                              type="checkbox"
                              placeholder="프로그램명을 입력해 주세요"
                              name="cvnas"
                              spellCheck="false"
                              autoComplete="off"
                              onChange={this.inputUpdate}
                              required
                            />
                          </div>
                        </TabPanel>
                      </Tabs>
                    </TabPanel>
                    <TabPanel className="tab-panel">
                      <div className="input-div">
                        <p>대분류 코드</p>
                        <input
                          type="num"
                          placeholder="대분류 코드를 입력해 주세요 (숫자)"
                          name="passwd"
                          spellCheck="false"
                          autoComplete="off"
                          onChange={this.inputUpdate}
                          required
                        />
                      </div>

                      <div className="input-div">
                        <p>중분류 코드</p>
                        <input
                          type="text"
                          placeholder="중분류 코드를 입력해 주세요"
                          name="cvcod"
                          spellCheck="false"
                          autoComplete="off"
                          onChange={this.inputUpdateCod}
                          required
                        />
                      </div>

                      <div className="input-div">
                        <p>소분류 코드</p>
                        <input
                          type="text"
                          placeholder="소분류 코드를 입력해 주세요"
                          name="cvnas"
                          spellCheck="false"
                          autoComplete="off"
                          onChange={this.inputUpdate}
                          required
                        />
                      </div>

                      <div className="input-div">
                        <p>프로그램명</p>
                        <input
                          type="text"
                          placeholder="프로그램명을 입력해 주세요"
                          name="cvnas"
                          spellCheck="false"
                          autoComplete="off"
                          onChange={this.inputUpdate}
                          required
                        />
                      </div>

                      <div className="input-div">
                        <p>WINDOW-ID</p>
                        <input
                          type="tel"
                          placeholder="핸드폰 번호를 입력해 주세요"
                          name="hphone"
                          spellCheck="false"
                          onChange={this.inputUpdate}
                        />
                      </div>
                      <div className="input-div">
                        <p>입출력 구분</p>
                        <div className="radio-section">
                          <div className="radio">
                            <input
                              type="radio"
                              name="auth"
                              id="normal"
                              value="0"
                              onChange={this.inputUpdate}
                              required
                            />
                            <label htmlFor="normal">입력</label>
                          </div>
                          <div className="radio">
                            <input
                              type="radio"
                              name="auth"
                              id="admin"
                              value="1"
                              onChange={this.inputUpdate}
                              required
                            />
                            <label htmlFor="admin">조회</label>
                          </div>
                          <div className="radio">
                            <input
                              type="radio"
                              name="auth"
                              id="corop"
                              value="2"
                              onChange={this.inputUpdate}
                              required
                            />
                            <label htmlFor="corop">출력</label>
                          </div>
                        </div>
                      </div>
                      <div className="input-div">
                        <p>프로그램 사용여부</p>
                        <input
                          type="checkbox"
                          placeholder="프로그램명을 입력해 주세요"
                          name="cvnas"
                          spellCheck="false"
                          autoComplete="off"
                          onChange={this.inputUpdate}
                          required
                        />
                      </div>
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
