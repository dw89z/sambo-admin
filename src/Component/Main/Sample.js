import React from "react";

class Sample extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    sample: this.props.test
  };

  componentDidMount() {
    console.log(this.state.sample);
  }
  render() {
    // console.log(this.props);
    return (
      <>
        <div className={`${this.state.sample.id} sam`}>
          {this.state.sample.id}, {this.state.sample.mes}
        </div>
      </>
    );
  }
}

export default Sample;
