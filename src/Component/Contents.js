import React from "react";
import "../Scss/Contents.css";
import Dashboard from "./Dashboard";
import Components from "./Content/ContentIndex";

class Contents extends React.Component {
  render() {
    console.log(this.props);
    let comp = this.props.currentComp;
    const CurrentComp = Components[comp];
    return (
      <>
        <div className={this.props.axis ? "contents" : "contents left"}>
          <CurrentComp />
        </div>
      </>
    );
  }
}

export default Contents;
