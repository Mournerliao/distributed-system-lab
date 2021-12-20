import React, {Fragment, useEffect, useState} from 'react'
import {Table, Tag} from "@arco-design/web-react";
import moment from "moment";
import './index.css'

function Server(props) {
  const {serverLogList} = props;
  const [logList, setLogList] = useState([]);

  useEffect(() => {
    setLogList(serverLogList);
  }, [serverLogList]);

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
      title: 'Server ID',
      dataIndex: 'serverId',
      align: 'center',
    },
    {
      title: 'Server Name',
      dataIndex: 'serverName',
      align: 'center',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      align: 'center',
    },
    {
      title: 'Device Count',
      dataIndex: 'deviceCount',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (col, item) => {
        let tag;

        if (item.status === 1) {
          tag = <Tag color="green">上线</Tag>;
        } else if (item.status === 2) {
          tag = <Tag color="red">下线</Tag>;
        } else {
          tag = <Tag color="blue">负载变化</Tag>;
        }

        return <Fragment>{tag}</Fragment>;
      }
    },
  ];

  return (
    <Fragment>
      <Table
        className="server-log-table"
        rowKey='id'
        columns={columns}
        data={logList}
        borderCell={true}
        pagination={{
          total: logList.length,
          pageSize: 10,
          showTotal: true,
          showJumper: true,
        }}
      />
    </Fragment>
  )
}

export default Server;