import React from "react";
import "../Scss/Menu.css";
import Footer from "./Footer";
import Header from "./Header";
import Components from "./Content/ContentIndex";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenuAxis = this.toggleMenuAxis.bind(this);
    this.state = {
      menu: this.props.menu,
      menuAxis: true,
      mountedComps: [
        {
          id: 0,
          name: "대쉬보드",
          component: "Dashboard"
        }
      ],
      currentComp: {
        id: 0,
        name: "대쉬보드",
        component: "Dashboard"
      }
    };
  }

  // UI변경을 위한 축(axis) 업데이트
  toggleMenuAxis() {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  }

  // 좌측 메뉴일 경우 클릭한 메뉴 리스트의 클래스 업데이트
  toggleClassParent(e) {
    let parent = e.currentTarget.parentElement;
    parent.classList.toggle("active");
    let subMenu = e.currentTarget.nextElementSibling;
    if (subMenu.style.maxHeight) {
      subMenu.style.maxHeight = null;
    } else {
      subMenu.style.maxHeight = subMenu.scrollHeight + "px";
    }
  }

  // 각 메뉴를 눌렀을 때 탭을 생성 및 추가
  createTabs() {
    const { mountedComps, currentComp } = this.state;
    const { menuAxis } = this.state;

    return (
      <ul className={menuAxis ? "tabs" : "tabs left"}>
        {mountedComps.map((comps, index) => (
          <li
            key={index}
            className={comps.id === currentComp.id ? "tab active" : "tab"}
            onClick={() => this.handleSelect(comps)}
          >
            {comps.name}
            {comps.id === currentComp.id ? (
              <span
                className="delete-btn"
                onClick={e => this.deleteComponent(e, comps.id)}
              ></span>
            ) : (
              <span className="delete-btn disable"></span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // 각 메뉴를 눌렀을 경우 화면에 컨텐츠를 출력
  createContent() {
    const { mountedComps } = this.state;
    const { currentComp } = this.state;

    const mountedCompsRender = mountedComps.map((comp, index) => {
      let CurrentComp = Components[comp.component];
      return (
        <div
          className={
            comp.id === currentComp.id
              ? "content-inner active"
              : "content-inner"
          }
          key={index}
        >
          <CurrentComp />
        </div>
      );
    });
    return mountedCompsRender;
  }

  // 탭에서 X버튼을 눌렀을때 해당하는 탭과 컴포넌트를 삭제
  deleteComponent(e, id) {
    e.stopPropagation();
    const { mountedComps } = this.state;
    const deleteToId = mountedComps.filter(comp => comp.id !== id);
    let previousComp = deleteToId[deleteToId.length - 1];
    this.setState({
      mountedComps: deleteToId,
      currentComp: previousComp
    });
    this.handleSelect(previousComp);
  }

  // 탭을 눌렀을 때 현재 화면을 그 탭의 컨텐츠로 변경
  selectContent(component, name, id) {
    const { mountedComps } = this.state;
    const isMounted = mountedComps.some(comps => comps.id === id);

    const newComp = {
      id,
      component,
      name
    };

    if (isMounted) {
      this.setState({
        currentComp: newComp
      });
    } else {
      this.setState({
        mountedComps: [...mountedComps, newComp],
        currentComp: newComp
      });
    }

    this.createTabs(component, id);
  }

  // 선택창 변경 하위 메소드
  handleSelect(comps) {
    this.setState({
      currentComp: comps
    });
  }

  render() {
    const menu = this.state.menu;
    const { menuAxis } = this.state;

    return (
      <>
        <Header
          toggleMenuAxis={this.toggleMenuAxis}
          logout={this.props.logout}
        />
        <div className={menuAxis ? "header-menu" : "left-menu"}>
          <ul className="menu">
            {menu.map((menu, index) => (
              <li className="menu-list" key={index}>
                {menuAxis ? (
                  <p>{menu.menuList}</p>
                ) : (
                  <p onClick={this.toggleClassParent}>{menu.menuList}</p>
                )}

                <ul className="sub-menu">
                  {menu.subList.map((sub, index) => (
                    <li
                      className="sub-menu-list"
                      key={index}
                      onClick={() =>
                        this.selectContent(sub.component, sub.name, sub.id)
                      }
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        {this.createTabs()}
        <div className={menuAxis ? "contents" : "contents left"}>
          {this.createContent()}
        </div>
        <Footer axis={menuAxis} />
      </>
    );
  }
}

export default Menu;
