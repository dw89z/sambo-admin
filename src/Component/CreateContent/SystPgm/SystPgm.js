import React from "react";
import Loading from "../../Loading";
import TreeMenu from "react-simple-tree-menu";
import { postApi, putApi, getApi } from "../../../api";
import "./SystPgm.scss";

export default class extends React.Component {
  state = {
    loading: false,
    data: [
      {
        key: "mammal",
        label: "Mammal",
        nodes: [
          {
            key: "canidae",
            label: "Canidae"
          }
        ]
      },
      {
        key: "reptile",
        label: "Reptile",
        nodes: [
          {
            key: "squamata",
            label: "Squamata"
          }
        ]
      }
    ]
  };

  async componentDidMount() {
    await getApi("admin/pm/programlist").then(res => {
      const {
        data: { data }
      } = res;
      console.log(res);

      let treeUpper = data.map(data => {
        const tree = {
          key: data.program.window_name,
          label: data.program.window_name,
          nodes: []
        };
        const treeLower = data.sublist.map(node => {
          const nodes = {
            key: node.sublist.window_name,
            label: node.sublist.window_name
          };

          return nodes;
        });
        return tree;
      });
    });
  }
  render() {
    const { loading, data } = this.state;
    return (
      <>
        <div className="content-component">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="tree-section">
              <TreeMenu
                data={data}
                debounceTime={125}
                disableKeyboard={false}
                hasSearch={false}
                onClickItem={function noRefCheck() {}}
                resetOpenNodesOnDataUpdate={false}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}
