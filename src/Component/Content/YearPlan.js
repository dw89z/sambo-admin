import React from "react";
import { jsonApi } from "../../api";
import Table from "../Fragments/Table";
import Basic from "../Fragments/Basic";

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
        <div>
          <Basic />
          <Table data={this.state.data} />
        </div>
      </>
    );
  }
}

export default Yearplan;
