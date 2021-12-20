import React, { Fragment, useEffect, useState } from "react";
import { Button, Notification, Tabs } from "@arco-design/web-react";
import PubSub from "pubsub-js";
import Server from "./Server";
import Device from "./Device";
import Http from "../../../Services";
import "./index.css";

const TabPane = Tabs.TabPane;

function Log() {
  const [activeTab, setActiveTab] = useState("0");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [serverLogList, setServerLogList] = useState([]);
  const [deviceLogList, setDeviceLogList] = useState([]);

  useEffect(() => {
    updateLog();

    const token = PubSub.subscribe('wsMessage',(_, msg)=>{
      if(msg) updateLog();
    });

    return () => {
      PubSub.unsubscribe(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateLog() {
    updateServerLogList().then();
    updateDeviceLogList().then();
  }

  async function updateServerLogList() {
    setUpdateLoading(true);
    const res = await Http.getRequest("/webManage/findAllServerLog");
    setUpdateLoading(false);

    if (res.code === 200) {
      const serverLogList = res.data;

      console.log(serverLogList);

      setServerLogList(serverLogList);
    } else {
      Notification.error({
        title: "Error",
        content: "Server log list update failed !",
      });
    }
  }

  async function updateDeviceLogList() {
    setUpdateLoading(true);
    const res = await Http.getRequest("/webManage/findAllDeviceLog");
    setUpdateLoading(false);

    if (res.code === 200) {
      const deviceLogList = res.data;

      console.log(deviceLogList);

      setDeviceLogList(deviceLogList);

      Notification.success({
        title: "Success",
        content: "Log list updated successfully !",
      });
    } else {
      Notification.error({
        title: "Error",
        content: "Device log list update failed !",
      });
    }
  }

  return (
    <Fragment>
      <Tabs
        activeTab={activeTab}
        onClickTab={setActiveTab}
        type="text"
        extra={
          <Button onClick={updateLog} type="outline" loading={updateLoading}>
            Update
          </Button>
        }
      >
        <TabPane key="0" title="服务器日志">
          <Server serverLogList={serverLogList} />
        </TabPane>
        <TabPane key="1" title="设备日志">
          <Device deviceLogList={deviceLogList} />
        </TabPane>
      </Tabs>
    </Fragment>
  );
}

export default Log;
