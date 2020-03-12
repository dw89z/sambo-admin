import React from "react";
import AdminMenuComponents from "../AdminMenuContent/AdminMenuIndex";

class AdminCreateContent extends React.Component {
  state = {
    mountedComps: this.props.mountedComps,
    currentComp: this.props.currentComp
  };
  componentWillUnmount() {
    this.setState({
      currentComp: {
        index: 0,
        window_name: "대시보드",
        window_id: "Dashboard"
      },
      mountedComps: {
        index: 0,
        window_name: "대시보드",
        window_id: "Dashboard"
      }
    });
  }
  render() {
    const { mountedComps } = this.state;
    const { currentComp } = this.state;

    // state에서 컴포넌트 이름을 받아 이름에 해당하는 컴포넌트를 호출하는 로직
    const mountedCompsRender = mountedComps.map((comp, index) => {
      let CurrentComp = AdminMenuComponents[comp.window_id];

      return (
        <div
          className={
            comp.window_id === currentComp.window_id
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
}

export default AdminCreateContent;
