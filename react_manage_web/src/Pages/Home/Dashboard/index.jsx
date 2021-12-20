import React, { Component } from "react";
import * as echarts from "echarts";
import dataCenterIcon from "./images/data_center.png";
import deviceIcon from "./images/device.png";
import Http from "../../../Services";
import moment from "moment";
import "./index.css";

class Dashboard extends Component {
  state = {
    serverCount: 0,
    deviceCount: 0,
    allActivities: null,
  };

  componentDidMount() {
    this.getActivity();
    this.getServerCount();
    this.getDeviceCount();
  }

  getActivity = async () => {
    const res = await Http.getRequest("/webManage/findServerActivity");

    if (res.code === 200) {
      this.setState(
        {
          allActivities: res.data,
        },
        () => {
          this.drawLineChart();
        }
      );
    }
  };

  getServerCount = async () => {
    const res = await Http.getRequest("/webManage/serverCount");

    if (res.code === 200) {
      const serverCount = res.data;

      this.setState({
        serverCount,
      });
    }
  };

  getDeviceCount = async () => {
    const res = await Http.getRequest("/webManage/deviceCount");

    if (res.code === 200) {
      const deviceCount = res.data;

      this.setState({
        deviceCount,
      });
    }
  };

  drawLineChart = () => {
    const myChart = echarts.init(document.getElementById("line-chart"));
    let { allActivities } = this.state;

    allActivities = allActivities.reverse();

    const xData = allActivities.map((item) => moment(item.dayBefore).format('MM-DD'));
    const yData = allActivities.map((item) => item.activityCount);

    console.log(xData)
    console.log(yData)

    myChart.setOption({
      title: {
        text: "Activity",
      },
      xAxis: {
        data: xData,
      },
      yAxis: {},
      series: [
        {
          data: yData,
          type: "line",
          smooth: true,
        },
      ],
    });
  };

  render() {
    const { serverCount, deviceCount } = this.state;

    return (
      <div className="main-container">
        <div className="main-top">
          <div id="line-chart" className="main-line-chart"/>
          <div className="main-all-count">
            <div className="main-count">
              <span
                className="main-point"
                style={{ backgroundColor: "#3491fa" }}
              />
              <span className="main-count-info">
                <span className="main-count-number">{serverCount}</span>
                <span className="main-count-title">Data Center</span>
              </span>
              <img
                className="main-icon"
                src={dataCenterIcon}
                alt="count-icon"
              />
            </div>
            <div className="main-count">
              <span
                className="main-point"
                style={{ backgroundColor: "#feae32" }}
              />
              <span className="main-count-info">
                <span className="main-count-number">{deviceCount}</span>
                <span className="main-count-title">Device</span>
              </span>
              <img className="main-icon" src={deviceIcon} alt="count-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
