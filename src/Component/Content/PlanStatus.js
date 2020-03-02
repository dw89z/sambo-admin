import React from "react";
import { jsonApi } from "../../api";

class PlanStatus extends React.Component {
  state = {
    data: null
  };

  async componentDidMount() {
    const { data } = await jsonApi.getUser();
    this.setState({
      data
    });
    console.log(data);
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <table></table>
      </div>
    );
  }
}

export default PlanStatus;
