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
      currentComp: "YearPlan"
    };
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
    const { menuAxis } = this.state;
    const menu = this.state.menu;
    const allTabs = menu.map((tab, idx) => {
      return (
        <li key={idx} className="tab">
          {tab.menuList}
          <span
            className="delete-btn"
            onClick={() => console.log("deleted")}
          ></span>
        </li>
      );
    });

    return <ul className={menuAxis ? "tabs" : "tabs left"}>{allTabs}</ul>;
  }

  toggleMenuAxis() {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  }

  handleContent(comp) {
    this.setState({
      currentComp: comp
    });
  }

  render() {
    const menu = this.state.menu;
    const comp = this.state.currentComp;
    const CurrentComp = Components[comp];
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
                      onClick={() => this.handleContent(sub.comp)}
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
          <CurrentComp />
        </div>
        <Footer axis={menuAxis} />
      </>
    );
  }
}

export default Menu;
