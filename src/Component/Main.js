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
      list: this.props.menu,
      menuAxis: true
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

  test(item, idx) {
    console.log(item);
    console.log(idx);
  }

  render() {
    const { list } = this.state.list;
    const { menuAxis } = this.state;

    return (
      <>
        <Header toggleMenuAxis={this.toggleMenuAxis} />
        <div className={menuAxis ? "header-menu" : "left-menu"}>
          <ul className="menu">
            {list.map((menu, idx) => (
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
                      onClick={() => this.test(sub, idx)}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <Contents axis={menuAxis} />
        <Footer axis={menuAxis} />
      </>
    );
  }
}

export default Menu;
