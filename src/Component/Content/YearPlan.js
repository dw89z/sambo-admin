import React from "react";
import { jsonApi } from "../../api";
import Table from "../Fragments/Table";

class Yearplan extends React.Component {
  state = {
    data: [
      {
        dataField: "id",
        text: "Product ID"
      },
      {
        dataField: "name",
        text: "Product Name"
      },
      {
        dataField: "price",
        text: "Product Price"
      }
    ]
  };

  render() {
    return (
      <>
        <Table data={this.state.data} />
      </>
    );
  }
}

export default Yearplan;
