import React from "react";
import AdminMenuContent from "../AdminMenuContent/AdminMenuIndex";

class AdminCreateContent extends React.Component {
  state = {
    adminMountedComp: this.props.adminMountedComp,
    adminCurrentComp: this.props.adminCurrentComp
  };

  createTabs() {
    const { scmMountedComp, adminCurrentComp } = this.state;
    const { menuAxis } = this.state;

    return (
      <ul className={menuAxis ? "tabs" : "tabs left"}>
        {scmMountedComp.map((comps, index) => (
          <li
            key={index}
            className={
              comps.index === adminCurrentComp.index ? "tab active" : "tab"
            }
            onClick={() => this.uiFunc.handleSelect(comps)}
          >
            {comps.window_name}
            {comps.index === adminCurrentComp.index && comps.index !== 0 ? (
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
  }

  render() {
    const { adminMountedComp } = this.state;
    const { adminCurrentComp } = this.state;

    // state에서 컴포넌트 이름을 받아 이름에 해당하는 컴포넌트를 호출하는 로직
    const adminMountedCompRender = adminMountedComp.map((comp, index) => {
      let AdminCurrentComp = AdminMenuContent[comp.window_id];

      return (
        <div
          className={
            comp.window_id === adminCurrentComp.window_id
              ? "content-inner active"
              : "content-inner"
          }
          key={index}
        >
          <AdminCurrentComp />
        </div>
      );
    });

    return adminMountedCompRender;
  }
}

export default AdminCreateContent;
