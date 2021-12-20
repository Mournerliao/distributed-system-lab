import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Input,
  Notification,
  Popconfirm,
  Table,
  Tag,
} from "@arco-design/web-react";
import Http from "../../../Services";
import "./index.css";
import PubSub from "pubsub-js";

function List() {
  const columns = [
    {
      title: "Server ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (col, item) => {
        let tag;

        if (item.status === "online") {
          tag = <Tag color="green">{item.status}</Tag>;
        } else {
          tag = <Tag color="gray">{item.status}</Tag>;
        }

        return <Fragment>{tag}</Fragment>;
      },
    },
    {
      title: "Operation",
      dataIndex: "op",
      align: "center",
      render: (col, item) => {
        let changeButton;
        let deleteButton;

        if (item.status === "online") {
          changeButton = (
            <Button
              loading={changeLoading}
              onClick={changeServerState(item.id, item.status)}
              status="warning"
            >
              Pause
            </Button>
          );
          deleteButton = "";
        } else {
          changeButton = "";
          deleteButton = (
            <Popconfirm
              title="Are you sure you want to delete?"
              onOk={deleteServer(item.id)}
              okButtonProps={{ loading: deleteLoading }}
            >
              <Button status="danger">Delete</Button>
            </Popconfirm>
          );
        }

        return (
          <div>
            {changeButton}
            {deleteButton}
          </div>
        );
      },
    },
  ];

  const [serverList, setServerList] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    updateServerList().then();

    const token = PubSub.subscribe("wsMessage", (_, msg) => {
      if (msg) updateServerList().then();
    });

    return () => {
      PubSub.unsubscribe(token);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateServerList() {
    setUpdateLoading(true);
    const res = await Http.getRequest("/webManage/findAllServer");
    setUpdateLoading(false);

    if (res.code === 200) {
      const serverList = res.data.map((item) => {
        if (item.status === 0) return { ...item, status: "offline" };
        else return { ...item, status: "online" };
      });

      console.log(serverList);

      setServerList(serverList);

      Notification.success({
        title: "Success",
        content: "Server list updated successfully !",
      });
    } else {
      Notification.error({
        title: "Error",
        content: "Server list update failed !",
      });
    }
  }

  function changeServerState(id) {
    return async () => {
      setChangeLoading(true);
      const res = await Http.postRequest("/webManage/offlineServer", { id });
      setChangeLoading(false);

      if (res.code === 200 && res.data) {
        const list = serverList.map((item) => {
          if (item.id !== id) return item;

          if (item.status === "online") return { ...item, status: "offline" };
          else return { ...item, status: "online" };
        });

        setServerList(list);

        Notification.success({
          title: "Success",
          content: "Switch device status successfully !",
        });
      } else {
        Notification.error({
          title: "Error",
          content: "Failed to switch device status !",
        });
      }
    };
  }

  function deleteServer(id) {
    return async () => {
      setDeleteLoading(true);
      const res = await Http.postRequest("/webManage/deleteServer", { id });
      setDeleteLoading(false);

      if (res.code === 200 && res.data) {
        let list = serverList.filter((item) => item.id !== id);

        setServerList(list);

        Notification.success({
          title: "Success",
          content: "The Server has been deleted !",
        });
      } else {
        Notification.error({
          title: "Error",
          content: "Failed to delete the server !",
        });
      }
    };
  }

  return (
    <Fragment>
      <div className="operation">
        <span className="op-left">
          <Input
            className="op-search"
            allowClear
            placeholder="Enter keyword to search ..."
            style={{ width: 350 }}
          />
        </span>
        <span className="op-right">
          <Button
            onClick={updateServerList}
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
        data={serverList}
        borderCell={true}
        pagination={{
          total: serverList.length,
          pageSize: 10,
          showTotal: true,
          showJumper: true,
        }}
      />
    </Fragment>
  );
}

export default List;
