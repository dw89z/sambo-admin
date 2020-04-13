import React from "react";

export default class extends React.Component {
  render() {
    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
        </div>
      </>
    );
  }
}
