import React from "react";
import "./Done.scss";

export class Done extends React.Component {
  state = {
    active: false
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        active: true
      });
    }, 50);
    setTimeout(() => {
      this.setState({
        active: false
      });
    }, 3000);
  }

  render() {
    return (
      <div
        className={
          this.props.done || this.props.error ? "common active" : "common"
        }
      >
        <p
          className={
            this.state.active && this.props.done
              ? "msg active"
              : this.state.active && this.props.error
              ? "msg error active"
              : "msg"
          }
        >
          {this.props.done || this.props.error}
        </p>
      </div>
    );
  }
}

export default Done;
