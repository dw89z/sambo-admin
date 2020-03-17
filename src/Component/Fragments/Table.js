import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "./Fragments.scss";

class Table extends React.Component {
  state = {};
  render() {
    return (
      <>
        <BootstrapTable keyField="id" />
      </>
    );
  }
}

export default Table;
