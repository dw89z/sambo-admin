import React from "react";
import MountContentIndex from "./ContentIndex";
import { postApi } from "../../api";
import qs from "querystring";
import "../Main/Main.css";

class CreateContent extends React.Component {
  state = {
    currentComp: this.props.currentComp,
    currentMode: this.props.currentMode,
    mountedComp: this.props.mountedComp
  };

  createTabs() {
    const { currentComp, menuAxis, mountedComp } = this.state;

    return (
      <ul className={menuAxis ? "tabs left" : "tabs"}>
        {mountedComp.map((comps, index) => (
          <li
            key={index}
            className={comps.index === currentComp.index ? "tab active" : "tab"}
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
  }

  async componentDidMount() {
    try {
      const { currentMode } = this.state;
      await postApi(
        "main/menu",
        qs.stringify({ mainid: currentMode.main_id })
      ).then(res => {});
    } catch (err) {}
  }

  render() {
    const { currentComp, mountedComp } = this.props;

    const mountedCompRender = mountedComp.map((comp, index) => {
      let component = comp.window_id;
      let CurrentComp = MountContentIndex[component];

      return (
        <>
          {this.createTabs()}
          <div
            className={
              comp.window_id === currentComp.window_id
                ? "content-inner active"
                : "content-inner"
            }
            key={index}
          >
            <CurrentComp key={index} />
          </div>
        </>
      );
    });

    return mountedCompRender;
  }
}

export default CreateContent;
