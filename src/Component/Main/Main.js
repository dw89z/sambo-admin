import React from "react";
import "./Main.css";
import Footer from "component/Footer";
import Header from "component/Header";
import logo from "../../assets/img/logo.png";
import qs from "querystring";
import { postApi } from "../../api";
import ScmCreateContent from "component/ScmCreateContent";
import AdminCreateContent from "component/AdminCreateContent";
import Sample from "./Sample";
import { isArray } from "util";

export default class extends React.Component {
  state = {
    history: this.props.history,
    user: {},
    currentMode: {
      main_id: ""
    },
    mode: [],
    currentMenu: [],
    menuAxis: true,
    scmMountedComp: [
      {
        index: 0,
        window_name: "대시보드",
        window_id: "Dashboard"
      }
    ],
    scmCurrentComp: {
      index: 0,
      window_name: "대시보드",
      window_id: "Dashboard"
    },
    adminMountedComp: [
      {
        index: 0,
        window_name: "대시보드",
        window_id: "Dashboard"
      }
    ],
    adminCurrentComp: {
      index: 0,
      window_name: "대시보드",
      window_id: "Dashboard"
    },
    loading: true,
    test: [
      {
        id: 10,
        mes: "text10"
      },
      {
        id: 20,
        mes: "text20"
      }
    ]
  };

  // UI변경을 위한 축(axis) 업데이트
  toggleMenuAxis() {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  }

  //ui조작 function 모음
  uiFunc = {
    // 좌측 메뉴일 경우 클릭한 메뉴 리스트의 클래스 업데이트
    toggleClassParent: e => {
      let parent = e.currentTarget.parentElement;
      parent.classList.toggle("active");
      let subMenu = e.currentTarget.nextElementSibling;
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    },

    //업무 모드 변경
    handleMode: async e => {
      await this.setState({
        currentMode: {
          main_id: e.target.value
        },
        scmCurrentComp: {
          index: 0,
          window_name: "대시보드",
          window_id: "Dashboard"
        }
      });

      try {
        const { currentMode } = this.state;
        await postApi(
          "main/submenu",
          qs.stringify({ mainid: currentMode.main_id })
        ).then(res => {
          this.setState({
            currentMenu: res.data.data
          });
        });
      } catch (error) {
        console.log(error);
      }
    },

    // 탭을 눌렀을 때 현재 화면을 그 탭의 컨텐츠로 변경
    selectContent: (window_id, window_name, index, callback) => {
      const { currentMode } = this.state;
      const newComp = {
        window_name,
        window_id,
        index
      };
      let mountedComp;
      let isMounted;

      const detectContent = (index, callback) => {
        if (currentMode.main_id === "10") {
          mountedComp = this.state.scmMountedComp;
        } else {
          mountedComp = this.state.adminMountedComp;
        }
        isMounted = mountedComp.some(comps => comps.index === index);
        console.log("detect", mountedComp);
        callback();
      };

      const setStateContent = () => {
        if (currentMode.main_id === "10" && isMounted) {
          this.setState({
            scmCurrentComp: newComp
          });
        } else if (currentMode.main_id === "10" && !isMounted) {
          this.setState({
            scmMountedComp: [...mountedComp, newComp],
            scmCurrentComp: newComp
          });
        } else if (currentMode.main_id !== "10" && isMounted) {
          this.setState({
            adminCurrentComp: newComp
          });
        } else if (currentMode.main_id !== "10" && !isMounted) {
          this.setState({
            adminMountedComp: [...mountedComp, newComp],
            adminCurrentComp: newComp
          });
        }
        this.uiFunc.createTabs(newComp.window_id, newComp.index);
      };

      detectContent(index, setStateContent);
    },

    // 각 메뉴를 눌렀을 때 탭을 생성 및 추가
    createTabs: () => {
      const { currentMode } = this.state;
      const { menuAxis } = this.state;
      let mountedComp;
      let currentComp;

      if (currentMode.main_id === "10") {
        mountedComp = this.state.scmMountedComp;
        currentComp = this.state.scmCurrentComp;
      } else {
        mountedComp = this.state.adminMountedComp;
        currentComp = this.state.adminCurrentComp;
      }

      return (
        <ul className={menuAxis ? "tabs" : "tabs left"}>
          {mountedComp.map((comps, index) => (
            <li
              key={index}
              className={
                comps.index === currentComp.index ? "tab active" : "tab"
              }
              onClick={() => this.uiFunc.handleSelect(comps)}
            >
              {comps.window_name}
              {comps.index === currentComp.index && comps.index !== 0 ? (
                <span
                  className="delete-btn"
                  onClick={e => this.uiFunc.deleteComponent(e, comps.index)}
                ></span>
              ) : (
                <span className="delete-btn disable"></span>
              )}
            </li>
          ))}
        </ul>
      );
    },

    // 탭에서 X버튼을 눌렀을때 해당하는 탭과 컴포넌트를 삭제
    deleteComponent: (e, index) => {
      // 이벤트 전파 방지
      e.stopPropagation();

      // 삭제했을 경우 현재 탭을 이전에 바라보고 있던 탭 화면으로 변경
      const { scmMountedComp } = this.state;
      const deleteToId = scmMountedComp.filter(comp => comp.index !== index);
      let previousComp = deleteToId[deleteToId.length - 1];
      this.setState({
        scmMountedComp: deleteToId,
        scmCurrentComp: previousComp
      });
      this.uiFunc.handleSelect(previousComp);
    },

    // 선택창 변경 응용 메소드
    handleSelect: comps => {
      this.setState({
        scmCurrentComp: comps
      });
    }
  };

  async componentDidMount() {
    try {
      const {
        data: { data: user }
      } = await postApi("main/userinfo");
      const {
        data: { data: mode }
      } = await postApi("main/menu");

      this.setState({
        user,
        mode,
        currentMode: mode[0]
      });
    } catch {
    } finally {
      const { currentMode } = this.state;
      await postApi(
        "main/submenu",
        qs.stringify({ mainid: currentMode.main_id })
      ).then(res => {
        const {
          data: { data }
        } = res;
        this.setState({
          currentMenu: data
        });
      });
    }
  }

  render() {
    const {
      currentMenu,
      menuAxis,
      mode,
      history,
      user,
      scmCurrentComp,
      currentMode,
      scmMountedComp,
      adminMountedComp,
      adminCurrentComp,
      test
    } = this.state;
    const uiFunc = this.uiFunc;

    return (
      <>
        <Header
          toggleMenuAxis={uiFunc.toggleMenuAxis}
          history={history}
          user={user}
        />
        <div className={menuAxis ? "header-menu" : "left-menu"}>
          <div className="select-section">
            <img src={logo} alt="logo" />
            <select
              onChange={this.uiFunc.handleMode}
              className="mode-selection"
            >
              {mode.map(mode => (
                <option value={mode.main_id} key={mode.main_id}>
                  {mode.window_name} 모드
                </option>
              ))}
            </select>
          </div>
          <ul className="menu">
            {currentMenu.map((menu, index) => (
              <li className="menu-list" key={index}>
                {menuAxis ? (
                  <p>{menu.window_name}</p>
                ) : (
                  <p onClick={uiFunc.toggleClassParent}>{menu.window_name}</p>
                )}

                <ul className="sub-menu">
                  {menu.subList.map((sub, index) => (
                    <li
                      className="sub-menu-list"
                      key={index}
                      onClick={() => {
                        this.uiFunc.selectContent(
                          sub.window_id,
                          sub.window_name,
                          sub.index
                        );
                      }}
                    >
                      {sub.window_name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        {/* {uiFunc.createTabs()}
        <div className={menuAxis ? "contents" : "contents left"}>
          {currentMode.main_id === "10" ? (
            <ScmCreateContent
              scmMountedComp={scmMountedComp}
              scmCurrentComp={scmCurrentComp}
            />
          ) : (
            <AdminCreateContent
              adminMountedComp={adminMountedComp}
              adminCurrentComp={adminCurrentComp}
            />
          )}
        </div> */}
        {test.map((test, index) => {
          return <Sample test={test} key={index} />;
        })}
        <Footer axis={menuAxis} />
      </>
    );
  }
}
