import React from "react";
import "./ConGrsales.scss";

export default class extends React.Component {
  render() {
    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          <div className="form">
            <form></form>
          </div>
        </div>
      </>
    );
  }
}