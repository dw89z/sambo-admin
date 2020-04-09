import React from "react";
import "./Loading.scss";

export default class extends React.Component {
  render() {
    return (
      <div className="loading">
        <div className="loading-inner">
          <div className="bar-01-wrap">
            <div className="bar-01"></div>
            <div className="bar-01 bar-01-anim"></div>
          </div>
          <div className="bar-02-wrap">
            <div className="bar-02"></div>
            <div className="bar-02 bar-02-anim"></div>
          </div>
          <div className="bar-03-wrap">
            <div className="bar-03"></div>
            <div className="bar-03 bar-03-anim"></div>
          </div>
        </div>
      </div>
    );
  }
}
