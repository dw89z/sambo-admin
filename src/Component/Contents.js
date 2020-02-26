import React from "react";
import "../Scss/Contents.css";
import Dashboard from "./Dashboard";
import Components from "./Content/ContentIndex";

class Contents extends React.Component {
  render() {
    let content = this.props.content;
    // console.log(content);
    const ContentComp = Components[content];
    return (
      <>
        <div className={this.props.axis ? "contents" : "contents left"}>
          <ContentComp />
        </div>
      </>
    );
  }
}

export default Contents;
