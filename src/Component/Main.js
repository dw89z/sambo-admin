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
      menu: this.props.menu.list,
      menuAxis: true,
      mountedComps: [
        {
          id: 0,
          comp: "Dashboard",
          name: "대쉬보드"
        }
      ],
      currentComp: {
        id: 0,
        comp: "Dashboard",
        name: "대쉬보드"
      }
    };
  }

  toggleMenuAxis() {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  }

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

  createTabs() {
    const { mountedComps, currentComp } = this.state;
    const { menuAxis } = this.state;

    return (
      <ul className={menuAxis ? "tabs" : "tabs left"}>
        {mountedComps.map((comps, idx) => (
          <li
            key={idx}
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

  createContent() {
    const { mountedComps } = this.state;
    const { currentComp } = this.state;

    const mountedCompsRender = mountedComps.map((comp, idx) => {
      let CurrentComp = Components[comp.comp];
      return (
        <div
          className={
            comp.id === currentComp.id
              ? "content-inner active"
              : "content-inner"
          }
          key={idx}
        >
          <CurrentComp />
        </div>
      );
    });
    return mountedCompsRender;
  }

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

  handleSelect(comps) {
    this.setState({
      currentComp: comps
    });
  }

  selectContent(comp, name, id) {
    const { mountedComps } = this.state;
    const isMounted = mountedComps.some(comps => comps.id === id);

    const newComp = {
      id,
      comp,
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

    this.createTabs(comp, id);
  }

  render() {
    const menu = this.state.menu;
    const { menuAxis } = this.state;

    return (
      <>
        <Header toggleMenuAxis={this.toggleMenuAxis} />
        <div className={menuAxis ? "header-menu" : "left-menu"}>
          <ul className="menu">
            {menu.map((menu, idx) => (
              <li className="menu-list" key={idx}>
                {menuAxis ? (
                  <p>{menu.menuList}</p>
                ) : (
                  <p onClick={this.toggleClassParent}>{menu.menuList}</p>
                )}

                <ul className="sub-menu">
                  {menu.subList.map((sub, idx) => (
                    <li
                      className="sub-menu-list"
                      key={idx}
                      onClick={() =>
                        this.selectContent(sub.comp, sub.name, sub.id)
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
