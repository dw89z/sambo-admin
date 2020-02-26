import React from "react";
import "../Scss/Contents.css";
import Dashboard from "./Dashboard";

class Contents extends React.Component {
  state = {
    axis: this.props.axis
  };
  render() {
    const { axis } = this.state;
    console.log(axis);
    return (
      <>
        <div className={this.props.axis ? "contents" : "contents left"}>
          <Dashboard />
        </div>
      </>
    );
  }
}

export default Contents;
