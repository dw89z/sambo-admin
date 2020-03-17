import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "./Fragments.scss";

class Table extends React.Component {
  state = {
    columns: [
      {
        dataField: "crtdat",
        text: "일자"
      },
      {
        dataField: "seqno",
        text: "등록번호"
      },
      {
        dataField: "title",
        text: "제목"
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
            data={this.props.data}
            columns={this.state.columns}
            rowClasses={rowClasses}
          />
        </div>
      </>
    );
  }
}

export default Table;
