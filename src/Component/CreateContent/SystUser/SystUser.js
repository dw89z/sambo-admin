import React from "react";
import Loading from "../../Loading";
import "./SystUser.scss";

export default class extends React.Component {
  state = {
    loading: false
  };
  render() {
    const { loading } = this.state;
    return (
      <>
        <div className="content-component">
          {/* {loading ? <Loading /> : <div>asdfas</div>} */}
        </div>
      </>
    );
  }
}
