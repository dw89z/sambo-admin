import React from "react";
import Loading from "../../Loading";

export default class extends React.Component {
  state = {
    loading: true
  };
  render() {
    const { loading } = this.state;
    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          {loading ? <Loading /> : <></>}
        </div>
      </>
    );
  }
}
