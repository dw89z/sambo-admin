import React from "react";
import "./Main.css";
import Footer from "component/Footer";
import Header from "component/Header";
import logo from "../../assets/img/logo.png";
import qs from "querystring";
import { postApi } from "../../api";
import ScmCreateContent from "component/ScmCreateContent";
import AdminCreateContent from "component/AdminCreateContent";

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
    adminMountedComp: [
      {
        index: 0,
        window_name: "대시보드",
        window_id: "Dashboard"
      }
    ],
    currentComp: {
      index: 0,
      window_name: "대시보드",
      window_id: "Dashboard"
    },
    loading: true
  };

  //ui조작 function 모음
  uiFunc = {
    // UI변경을 위한 축(axis) 업데이트
    toggleMenuAxis: () => {
      const { menuAxis } = this.state;
      this.setState({
        menuAxis: !menuAxis
      });
    },
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
    // 각 메뉴를 눌렀을 때 탭을 생성 및 추가
    createTabs: () => {
      const { scmMountedComp, currentComp } = this.state;
      const { menuAxis } = this.state;

      return (
        <ul className={menuAxis ? "tabs" : "tabs left"}>
          {scmMountedComp.map((comps, index) => (
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
    // 각 메뉴를 눌렀을 경우 화면에 컨텐츠를 출력

    // createContent: () => {
    //   const { scmMountedComp } = this.state;
    //   const { currentComp } = this.state;
    //   const { currentMode } = this.state;

    //   // state에서 컴포넌트 이름을 받아 이름에 해당하는 컴포넌트를 호출하는 로직
    //   const scmMountedCompRender = scmMountedComp.map((comp, index) => {
    //     let CurrentComp = SubMenuComponents[comp.window_id];

    //     return (
    //       <div
    //         className={
    //           comp.window_id === currentComp.window_id
    //             ? "content-inner active"
    //             : "content-inner"
    //         }
    //         key={index}
    //       >
    //         <CurrentComp />
    //       </div>
    //     );
    //   });

    //   return scmMountedCompRender;
    // },

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
        currentComp: previousComp
      });
      this.uiFunc.handleSelect(previousComp);
    },
    // 탭을 눌렀을 때 현재 화면을 그 탭의 컨텐츠로 변경
    selectContent: (window_id, window_name, index) => {
      const { scmMountedComp } = this.state;
      const isMounted = scmMountedComp.some(comps => comps.index === index);

      const newComp = {
        index,
        window_name,
        window_id
      };

      if (isMounted) {
        this.setState({
          currentComp: newComp
        });
      } else {
        this.setState({
          scmMountedComp: [...scmMountedComp, newComp],
          currentComp: newComp
        });
      }

      this.uiFunc.createTabs(window_id, index);
    },
    // 선택창 변경 응용 메소드
    handleSelect: comps => {
      this.setState({
        currentComp: comps
      });
    },
    //업무 모드 변경
    handleMode: async e => {
      await this.setState({
        currentMode: {
          main_id: e.target.value
        },
        currentComp: {
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
        this.setState({
          currentMenu: res.data.data
        });
      });
    }
  }

  render() {
    const menu = this.state.currentMenu;
    const {
      menuAxis,
      mode,
      history,
      user,
      currentComp,
      currentMode,
      scmMountedComp
    } = this.state;
    const uiFunc = this.uiFunc;
    console.log(currentMode);

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
            {menu.map((menu, index) => (
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
                      onClick={() =>
                        this.uiFunc.selectContent(
                          sub.window_id,
                          sub.window_name,
                          sub.index
                        )
                      }
                    >
                      {sub.window_name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        {uiFunc.createTabs()}
        <div className={menuAxis ? "contents" : "contents left"}>
          {/* {currentMode.main_id === "10" ? (
            <ScmCreateContent
              scmMountedComp={scmMountedComp}
              currentComp={currentComp}
            />
          ) : (
            <AdminCreateContent
              scmMountedComp={scmMountedComp}
              currentComp={currentComp}
            />
          )} */}
        </div>
        <Footer axis={menuAxis} />
      </>
    );
  }
}
