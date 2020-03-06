import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "../../Scss/Fragments.css";

class Table extends React.Component {
  state = {
    products: [
      {
        id: 1,
        name: "TV",
        price: 1000,
        exex: "duck",
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f"
      },
      {
        id: 2,
        name: "Mobile",
        price: 500,
        exex: "duck"
      }
    ],
    columns: [
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
      },
      {
        dataField: "exex",
        text: "duck boot"
      },
      {
        dataField: "a",
        text: "sfsaf"
      },
      {
        dataField: "b",
        text: "sfsaf"
      },
      {
        dataField: "c",
        text: "sfsaf"
      },
      {
        dataField: "d",
        text: "sfsaf"
      },
      {
        dataField: "e",
        text: "sfsaf"
      },
      {
        dataField: "f",
        text: "sfsaf"
      }
    ]
  };
  render() {
    const rowClasses = "year-table-row";
    return (
      <>
        <div className="year-table">
          <BootstrapTable
            keyField="id"
            data={this.state.products}
            columns={this.state.columns}
            rowClasses={rowClasses}
          />
        </div>
      </>
    );
  }
}

export default Table;
