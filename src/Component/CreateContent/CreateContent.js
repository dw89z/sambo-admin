import React from "react";
import "../Main/Main.scss";
import MountContentIndex from "./ContentIndex";
import { postApi } from "../../api";
import logo from "../../assets/img/logo.png";
import Loading from "component/Loading";

class CreateContent extends React.Component {
  state = {
    loading: true,
    currentMenu: [],
    currentMode: this.props.currentMode,
    mountedComp: [
      {
        index: 0,
        window_name: "대시보드",
        window_id: "SystAuth"
      }
    ],
    currentComp: {
      index: 0,
      window_name: "대시보드",
      window_id: "SystAuth"
    }
  };

  uiFunc = {
    toggleClassParent: e => {
      let parent = e.currentTarget.parentElement;
      parent.classList.toggle("active");
      let subMenu = e.currentTarget.nextElementSibling;
      console.log(subMenu);
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    },

    handleMode: e => {
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
        this.setState({
          currentComp: newComp
        });
      } else {
        this.setState({
          mountedComp: [...mountedComp, newComp],
          currentComp: newComp
        });
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
    },

    createTabs: () => {
      const { currentComp, mountedComp } = this.state;
      const { menuAxis } = this.props;
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
                <span className="delete-btn disable non-delete"></span>
              )}
            </li>
          ))}
        </ul>
      );
    }
  };

  async componentDidUpdate(prevProps) {
    if (this.props.currentMode !== prevProps.currentMode) {
      this.setState({
        loading: true
      });
      try {
        await postApi("main/menu", { mainid: this.props.currentMode.main_id })
          .then(res => {
            const {
              data: { data }
            } = res;
            this.setState({
              currentMenu: data,
              mountedComp: [
                {
                  index: 2,
                  window_name: "대시보드",
                  window_id: "SystUser"
                }
              ],
              currentComp: {
                index: 2,
                window_name: "대시보드",
                window_id: "SystUser"
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      } catch (err) {
      } finally {
        this.setState({
          loading: false
        });
      }
    }
  }

  async componentDidMount() {
    try {
      await postApi("main/menu", {
        mainid: this.props.currentMode.main_id
      }).then(res => {
        const {
          data: { data }
        } = res;
        this.setState({
          currentMenu: data
        });
      });
    } catch (err) {
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  createComp() {
    const { mountedComp, currentComp } = this.state;
    const mountedCompRender = mountedComp.map((comp, index) => {
      let component = comp.window_id;
      let CurrentComp = MountContentIndex[component];

      return (
        <div
          className={
            comp.window_id === currentComp.window_id
              ? "content-inner active"
              : "content-inner"
          }
          key={index}
        >
          <CurrentComp
            key={index}
            title={currentComp.window_name}
            menuAxis={this.props.menuAxis}
            user={this.props.user}
          />
        </div>
      );
    });

    return mountedCompRender;
  }

  render() {
    const { menuAxis } = this.props;
    const { currentMenu, loading } = this.state;
    const uiFunc = this.uiFunc;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className={menuAxis ? "header-menu" : "left-menu"}>
              <img src={logo} alt="logo" />
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
                            uiFunc.selectContent(
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
            {uiFunc.createTabs()}
            <div className={menuAxis ? "contents" : "contents left"}>
              {this.createComp()}
            </div>
          </>
        )}
      </>
    );
  }
}

export default CreateContent;
