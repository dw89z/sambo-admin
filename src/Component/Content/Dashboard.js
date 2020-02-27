import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import "../../Scss/Dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "Vidoes Mades",
            backgroundColor: "rgba(255,0,255,0.75)",
            data: [4, 5, 2, 21, 2, 4]
          },
          {
            label: "Subscriptions",
            backgroundColor: "rgba(0,222,0,0.75)",
            data: [25, 12, 5, 35, 12, 1]
          },
          {
            label: "Vidoes Mades",
            backgroundColor: "rgba(255,0,255,0.75)",
            data: [4, 5, 2, 21, 2, 4]
          },
          {
            label: "Vidoes Mades",
            backgroundColor: "rgba(255,0,255,0.75)",
            data: [4, 5, 2, 21, 2, 4]
          },
          {
            label: "Vidoes Mades",
            backgroundColor: "rgba(255,0,255,0.75)",
            data: [4, 5, 2, 21, 2, 4]
          }
        ]
      }
    };
  }

  render() {
    return (
      <>
        <div className="chart-section">
          <div className="chart">
            <Bar
              data={this.state.data}
              options={{
                maintainAspectRatio: false,
                responsive: true
              }}
            />
            <Bar
              data={this.state.data}
              options={{
                maintainAspectRatio: false,
                responsive: true
              }}
            />
            <Bar
              data={this.state.data}
              options={{
                maintainAspectRatio: false,
                responsive: true
              }}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
