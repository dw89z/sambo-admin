import React from "react";
import "./Main.css";
import Footer from "component/Footer";
import Header from "component/Header";
import Loading from "component/Loading";
import logo from "../../assets/img/logo.png";
import qs from "querystring";
import { postApi } from "../../api";
import CreateContent from "../CreateContent/CreateContent";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.uiFunc.toggleMenuAxis = this.uiFunc.toggleMenuAxis.bind(this);
  }
  state = {
    history: this.props.history,
    user: {},
    currentMode: {},
    mode: [],
    currentMenu: [],
    menuAxis: true,
    mountedComp: [
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

  uiFunc = {
    toggleMenuAxis() {
      const { menuAxis } = this.state;
      this.setState({
        menuAxis: !menuAxis
      });
    },

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

    handleMode: e => {
      console.log(e.target.value);
      this.setState({
        currentMode: {
          main_id: e.target.value
        }
      });
    },

    selectContent: (window_id, window_name, index) => {
      const { mountedComp } = this.state;
      let newComp = {
        index,
        window_name,
        window_id
      };
      let isMounted = mountedComp.some(comp => comp.index === index);
      if (isMounted) {
      }
    },

    deleteComponent: (e, index) => {
      e.stopPropagation();

      const { mountedComp } = this.state;
      const deleteToId = mountedComp.filter(comp => comp.index !== index);
      let previousComp = deleteToId[deleteToId.length - 1];
      this.setState({
        mountedComp: deleteToId,
        currentComp: previousComp
      });
      this.uiFunc.handleSelect(previousComp);
    },

    handleSelect: comps => {
      this.setState({
        currentComp: comps
      });
    }
  };

  stateFunc = {
    setMounted: comp => {
      this.setState({
        mountedComp: [comp]
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
          currentMenu: data,
          loading: false
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
      currentMode,
      currentComp,
      mountedComp,
      loading
    } = this.state;
    const uiFunc = this.uiFunc;
    const stateFunc = this.stateFunc;
    console.log(this.state.targetComp);

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <Header
              toggleMenuAxis={uiFunc.toggleMenuAxis}
              history={history}
              user={user}
            />
            <div className={menuAxis ? "header-menu" : "left-menu"}>
              <div className="select-section">
                <img src={logo} alt="logo" />
                <select onChange={uiFunc.handleMode} className="mode-selection">
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
                      <p onClick={uiFunc.toggleClassParent}>
                        {menu.window_name}
                      </p>
                    )}

                    <ul className="sub-menu">
                      {menu.subList.map((sub, index) => (
                        <li
                          className="sub-menu-list"
                          key={index}
                          onClick={() => {
                            console.log(
                              sub.window_id,
                              sub.window_name,
                              sub.index
                            );
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

            <div className={menuAxis ? "contents" : "contents left"}>
              <CreateContent
                currentMode={currentMode}
                currentComp={currentComp}
                mountedComp={mountedComp}
                createTabs={this.uiFunc.createTabs}
                menuAxis={menuAxis}
                setMounted={stateFunc.setMounted}
              />
            </div>

            <Footer axis={menuAxis} />
          </div>
        )}
      </>
    );
  }
}
