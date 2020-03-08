import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default function withAuth(AuthComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        redirect: false
      };
    }

    componentDidMount() {
      this.setState({ redirect: true });
    }

    render() {
      const { redirect } = this.state;
      if (redirect) {
        return <Redirect to="/" />;
      }
      return <AuthComponent {...this.props} />;
    }
  };
}
