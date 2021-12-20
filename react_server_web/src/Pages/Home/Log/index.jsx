import React, { Component, Fragment } from "react";
import {Table, Tag, Notification, Input, Button} from "@arco-design/web-react";
import Http from '../../../Services'
import './index.css'

export default class Log extends Component {
  state = {
    logList: [],
    updateLoading: false,
  }

  componentDidMount = () => {
    this.getDeviceLogList();
  }

  getDeviceLogList = async () => {
    const id = JSON.parse(localStorage.getItem("serverInfo")).id;
    const res = await Http.postRequest('/get_device_log_list', {id});

    if (res.code === 200) {
      const logList = res.data;

      console.log(logList);

      this.setState({
        logList,
      })

      Notification.success({title: 'Success', content: 'Log list updated successfully !'})
    } else {
      Notification.error({title: 'Error', content: 'Log list update failed !'})
    }
  }

  render() {
    const columns = [
      {
        title: "Time",
        dataIndex: "time",
        align: "center",
      },
      {
        title: "Device ID",
        dataIndex: "device_id",
        align: "center",
      },
      {
        title: "Device Name",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "status",
        align: "center",
        render: (col, item) => {
          let tag;

          if (item.status === 1) {
            tag = <Tag color="green">设备增加</Tag>;
          } else if (item.status === 2) {
            tag = <Tag color="orange">设备减少</Tag>;
          } else {
            tag = <Tag color="purple">设备更新</Tag>;
          }

          return <Fragment>{tag}</Fragment>;
        },
      },
    ];
    const InputSearch = Input.Search;
    const {logList, updateLoading} = this.state;

    return (
      <Fragment>
      <div className="operation">
          <span className="op-left">
            <InputSearch
              allowClear
              placeholder="Enter keyword to search ..."
              style={{ width: 350 }}
            />
          </span>

          <span className="op-right">
            <Button
              onClick={this.getDeviceLogList}
              type="outline"
              loading={updateLoading}
            >
              Update
            </Button>
          </span>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          data={logList}
          borderCell={true}
          pagination={{
            total: logList.length,
            pageSize: 8,
            showTotal: true,
            showJumper: true,
          }}
        />
      </Fragment>
    );
  }
}
