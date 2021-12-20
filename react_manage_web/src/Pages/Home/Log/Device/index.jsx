import React, {Fragment, useEffect, useState} from 'react'
import {Select, Table, Tag} from "@arco-design/web-react";
import moment from "moment";
import './index.css'

const Option = Select.Option;

function Device(props) {
  const {deviceLogList} = props;
  const [logList, setLogList] = useState([]);
  const [options, setOptions] = useState([]);
  const [serverName, setServerName] = useState('');

  useEffect(() => {
    setOptions(deviceLogList.map(item => item.serverName));
    setLogList(deviceLogList[0].deviceLogList);
    setServerName(deviceLogList[0].serverName);
  }, [deviceLogList]);

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      align: 'center',
      render: (col, item) => {
        return item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: 'Device ID',
      dataIndex: 'deviceId',
      align: 'center',
    },
    {
      title: 'Device Name',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
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
      }
    },
  ];

  function selectServer(name) {
    setServerName(name);
    setLogList(deviceLogList.filter(item => item.serverName === name)[0].deviceLogList);
  }

  return (
    <Fragment>
      <Select
        className="server-select"
        placeholder='Please select server ...'
        size="large"
        bordered={false}
        value={serverName}
        onChange={selectServer}
      >
        {options.map((option, index) => (
          <Option key={index} value={option}>
            {option}
          </Option>
        ))}
      </Select>

      <Table
        rowKey='id'
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
  )
}

export default Device;