import React from "react";
import Loading from "../../Loading";
import TreeMenu from "react-simple-tree-menu";
import { postApi, putApi, getApi } from "../../../api";
import "./SystPgm.scss";

export default class extends React.Component {
  state = {
    loading: false
  };

  async componentDidMount() {
    await getApi("admin/pm/programlist").then(res => console.log(res));
  }
  render() {
    const { loading } = this.state;
    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="tree-section">
              <TreeMenu />
            </div>
          )}
        </div>
      </>
    );
  }
}
