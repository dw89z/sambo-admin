import React from "react";
import ScmMenuContent from "../ScmMenuContent/ScmMenuIndex";

class ScmCreateContent extends React.Component {
  state = {
    scmMountedComp: this.props.scmMountedComp,
    scmCurrentComp: this.props.scmCurrentComp
  };

  render() {
    const { scmMountedComp } = this.state;
    const { scmCurrentComp } = this.state;

    // state에서 컴포넌트 이름을 받아 이름에 해당하는 컴포넌트를 호출하는 로직
    const scmMountedCompRender = scmMountedComp.map((comp, index) => {
      let ScmCurrentComp = ScmMenuContent[comp.window_id];

      return (
        <div
          className={
            comp.window_id === scmCurrentComp.window_id
              ? "content-inner active"
              : "content-inner"
          }
          key={index}
        >
          <ScmCurrentComp />
        </div>
      );
    });

    return scmMountedCompRender;
  }
}

export default ScmCreateContent;
