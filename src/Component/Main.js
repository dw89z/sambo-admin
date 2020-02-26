import React from "react";
import "../Scss/Menu.css";
import Footer from "./Footer";
import Header from "./Header";
import Contents from "./Contents";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.toggleClassParent = this.toggleClassParent.bind(this);
    this.toggleMenuAxis = this.toggleMenuAxis.bind(this);
    this.state = {
      menu: this.props.menu.list,
      menuAxis: true,
      currentContent: "YearPlan"
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

  toggleMenuAxis() {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  }

  handleContent(content) {
    this.setState({
      currentContent: content
    });
  }

  render() {
    const menu = this.state.menu;
    const currentContent = this.state.currentContent;
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
        <Contents axis={menuAxis} content={currentContent} />
        <Footer axis={menuAxis} />
      </>
    );
  }
}

export default Menu;
